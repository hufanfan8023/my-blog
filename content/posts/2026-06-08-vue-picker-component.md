---
title: "Vue 省市区选择器封装实践"
date: "2026-06-08"
category: "项目实战"
tags: ["Vue", "高德地图", "uView", "组件封装"]
description: "从设计思路到高德地图 API 集成，手把手实现基于定位的默认选中省市区选择器，覆盖三级联动、缓存、降级策略"
featured: true
draft: false
---

成就贷小程序里有个很常见的场景：用户填地址。设计稿给的是从顶部弹出的三级联动 picker，先选省、再选市、再选区。直接用 uView 的 `u-picker` 改不动样式，自己造一个又怕踩坑。最后我做了一个折中——基于 uView 的 picker 包了一层业务组件，把数据源、定位、缓存这些事情吃掉。

## 需求拆解

把功能写成一个清单后看着就清晰多了：

- 三级联动：选完省自动加载市，选完市自动加载区
- 默认选中：根据用户当前定位预选省/市/区，命中失败回退到「浙江·杭州·西湖」
- 数据缓存：行政区数据一次拉取后缓存到 storage，下次直接用
- 降级：定位失败、API 失败时不阻塞，选择器照常可用

## 数据从哪来

最早想的是用本地静态 JSON 文件，但全国 3000+ 个区县的数据塞进 bundle 体积太大（约 800KB），首屏完全不能接受。换思路：

::callout{type="tip"}
**懒加载行政区数据**：首次打开 picker 时拉取省级，选省后再拉对应的市，选市再拉区。每次请求大约 5-30KB，体感顺滑。
::

数据源用的高德地图 [行政区域查询 API](https://lbs.amap.com/api/webservice/guide/api/district)：

```js
// services/region.js
const AMAP_KEY = process.env.AMAP_KEY
const BASE = 'https://restapi.amap.com/v3/config/district'

export async function getDistricts(keyword = '中国', subdistrict = 1) {
  const cacheKey = `region:${keyword}:${subdistrict}`
  const cached = uni.getStorageSync(cacheKey)
  if (cached) return cached

  const res = await uni.request({
    url: BASE,
    data: { key: AMAP_KEY, keywords: keyword, subdistrict },
  })

  if (res.data.status === '1') {
    uni.setStorageSync(cacheKey, res.data.districts[0].districts)
    return res.data.districts[0].districts
  }
  throw new Error(res.data.info)
}
```

每条数据带上 `subdistrict: 1` 表示只取下一级，避免一次拉太多。缓存用 storage，过期策略是「下次启动小程序时清一次」（在 `App.onLaunch` 里清），数据更新频率以年为单位，这个粒度够用。

## 默认选中的逻辑

选择器最容易做错的就是「打开时已经选好了用户最可能选的项」。流程是：

1. 调 `uni.getLocation` 拿经纬度
2. 调高德 [逆地理编码](https://lbs.amap.com/api/webservice/guide/api/georegeo) 拿到省/市/区名字
3. 在已加载的省/市/区列表里 find 对应的 index
4. 任何一步失败，回退到默认值

```js
async function detectDefault() {
  try {
    const { latitude, longitude } = await uni.getLocation()
    const { regeocode } = await reverseGeocode(latitude, longitude)
    const { province, city, district } = regeocode.addressComponent

    return {
      province: findIndex(provinces, province),
      city: findIndex(cities, city),
      district: findIndex(districts, district),
    }
  } catch {
    return DEFAULT_INDEX // [浙江, 杭州, 西湖]
  }
}
```

`findIndex` 不只是 `===` 匹配，要做模糊处理——逆地理返回的城市名可能带「市」字，行政区数据里不带：

```js
function findIndex(list, name) {
  const stripped = name.replace(/(省|市|区|县|自治区|自治州)$/, '')
  return list.findIndex((it) =>
    it.name === name || it.name === stripped || it.name.startsWith(stripped),
  )
}
```

## 联动的细节

uView picker 的 `change` 事件会给出当前三列的 index，我在外层做了一层 `watch`，列变化时重置后面的列：

::code-group
```js [composables/usePicker.js]
const provinceIdx = ref(0)
const cityIdx = ref(0)
const districtIdx = ref(0)

watch(provinceIdx, async () => {
  cityIdx.value = 0
  districtIdx.value = 0
  cities.value = await getDistricts(provinces.value[provinceIdx.value].adcode)
  districts.value = await getDistricts(cities.value[0].adcode)
})

watch(cityIdx, async () => {
  districtIdx.value = 0
  districts.value = await getDistricts(cities.value[cityIdx.value].adcode)
})
```

```vue [components/RegionPicker.vue]
<u-picker
  :show="visible"
  :columns="[provinces, cities, districts]"
  :default-index="defaultIndex"
  key-name="name"
  @change="onChange"
  @confirm="onConfirm"
/>
```
::

## 踩过的坑

- **iOS 真机定位授权失败时 `uni.getLocation` 不 reject 而是直接 hang**：包一层 5s 超时
- **adcode 末位不一定是 0**：有些直辖市的「区」adcode 末位是 9 或 8，不能用「末位是 0 的是市」这种规则筛选
- **port 4000 的本地代理在小程序上跑不通**：开发版小程序请求白名单只认 https，本地调试要通过 nginx 转发

## 最终效果

封装完后调用方只要写：

```vue
<RegionPicker v-model="address" :auto-locate="true" />
```

业务侧拿到的 `address` 是 `{ province, city, district, adcode }`。后续在多个表单里复用，没再出过问题。

::callout{type="info"}
组件库是项目里最赚的投资。这个 picker 后来又用在了「实名认证」「申请贷款」「物流地址」三个表单里，省下的复制粘贴时间够喝十次咖啡。
::
