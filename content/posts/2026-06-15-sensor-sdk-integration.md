---
title: "神策 SDK 埋点开发全流程"
date: "2026-06-15"
category: "项目实战"
tags: ["神策", "埋点", "小程序", "TypeScript"]
description: "从 SDK 接入到自定义事件设计，再到统一封装与异常追踪，一份微信小程序埋点工程化的完整指南"
featured: false
draft: false
---

埋点这件事最讨厌的不是接 SDK，而是「每个开发都用自己的写法埋点」。结果产品来对数据时，三个开发口径不一样、字段名不一样、漏埋的页面没人知道。在做成就贷小程序时，我把这套从 SDK 接入到事件命名规范的流程标准化了，下面是完整记录。

## 接入神策 SDK

成就贷的环境是微信小程序 + uniapp。神策的小程序 SDK 不能直接 npm 装，要把 `sensorsdata.min.js` 放到 `/utils/sensors/` 下手动引入：

```js
// utils/sensors/index.js
import sensors from './sensorsdata.min.js'

sensors.init({
  name: 'sa',
  server_url: 'https://your-sensors-host/sa?project=production',
  show_log: false,
  send_timeout: 6000,
  is_track_app_start: true,  // 自动埋 $MPLaunch / $MPShow
})

sensors.use('PageLeave', { heartbeat_interval_time: 5 })
sensors.use('Performance')

export default sensors
```

::callout{type="warning"}
**`server_url` 不能写到代码里**。生产、测试、灰度三个环境的 url 不一样，写死后切环境会污染数据。我用 `process.env.SA_URL` 注入，CI 阶段根据分支替换。
::

## 自动埋点能拿到什么

神策默认会自动埋这几类事件：

| 事件名 | 触发时机 |
|--------|---------|
| `$MPLaunch` | 小程序冷启动 |
| `$MPShow` | 小程序进入前台 |
| `$MPHide` | 小程序退出后台 |
| `$MPViewScreen` | 进入页面 |
| `$MPClick` | 点击事件（需要单独配置） |
| `$WebPageLeave` | 页面退出（停留时长） |

够用 60% 场景。剩下 40% 是业务自定义事件——比如「申请贷款按钮点击」「OCR 识别结果」「省市区选择完成」。

## 自定义事件的命名规范

我们团队定的规则是 `[模块]_[对象]_[动作]`，全部小写下划线分隔：

```
loan_apply_button_click
loan_form_submit_success
ocr_idcard_recognize_failed
region_picker_select_complete
```

- 模块前缀让人在事件列表里能按业务找
- 对象在中间，描述具体被操作的元素
- 动作放最后，常见动作就几个：`click` / `view` / `submit` / `success` / `failed` / `complete`

事件属性也有规范，公共字段必带：

::code-group
```ts [types/track.ts]
export interface BaseProps {
  channel: string         // 渠道来源
  user_role: 'guest' | 'normal' | 'vip'
  page_path: string       // 当前页面路径
  page_referrer?: string  // 来源页
}

export interface LoanApplyProps extends BaseProps {
  product_id: string
  amount: number
  duration: number
  has_collateral: boolean
}
```

```ts [utils/sensors/track.ts]
import sensors from './index'
import type { BaseProps } from '~/types/track'

function getBaseProps(): BaseProps {
  const pages = getCurrentPages()
  const cur = pages[pages.length - 1]
  return {
    channel: getApp().globalData.channel,
    user_role: getApp().globalData.user?.role || 'guest',
    page_path: cur?.route || '',
    page_referrer: pages[pages.length - 2]?.route,
  }
}

export function track<T extends Record<string, any>>(event: string, props?: T) {
  sensors.track(event, { ...getBaseProps(), ...props })
}
```
::

调用方：

```ts
import { track } from '@/utils/sensors/track'

track<LoanApplyProps>('loan_apply_button_click', {
  product_id: 'p_001',
  amount: 50000,
  duration: 12,
  has_collateral: false,
})
```

封装完后的好处：所有埋点都带公共字段、TypeScript 强制约束属性、改公共字段时一处改全站生效。

## 设备/用户绑定

埋点最容易出错的是「用户登录前后是不是同一个人」。神策提供了 `login` / `logout` API：

```ts
// 用户登录成功后
sensors.login(user.id)

// 用户退出
sensors.logout()
```

`login(userId)` 会把之前匿名设备 ID 下的事件归到这个 userId 名下。这个细节没人提醒的话很容易漏，导致「登录前的浏览行为」和「登录后的下单行为」对不上。

## 异常追踪

下面这段是业务封装的重点。神策原生不抓 JS 异常，但我们的需求是「线上炸了能在事件流里看到错误」：

```ts
// utils/sensors/error.ts
function reportError(err: Error, context: Record<string, any> = {}) {
  track('app_error_occurred', {
    error_message: err.message,
    error_stack: err.stack?.slice(0, 500), // 截断防止超长
    error_context: JSON.stringify(context).slice(0, 1000),
  })
}

// 在小程序的 App.onError 里调
App({
  onError(err: string) {
    reportError(new Error(err))
  },
})
```

::callout{type="tip"}
**栈信息一定要截断**。神策单个属性默认上限 8192 字节，但我截 500 字节后看的人体感更好——超长 stack 在事件流里反而难定位。
::

## 数据校验

每次新埋点上线前，我会跑一遍这个 checklist：

- [ ] 在测试环境触发事件
- [ ] 在神策的「埋点管理」面板确认事件出现
- [ ] 检查公共字段是否都齐
- [ ] 检查关键属性的类型（number 不要变成 string）
- [ ] 数据量级估算（高频事件每天 10w+ 时要和数据组对一下采样策略）

## 复盘

整套埋点系统跑了大半年，回头看几个值得记录的点：

1. **统一封装是性价比最高的事**。前期多花 1 周写 SDK 封装，后面每次新埋点节省 30 分钟讨论时间
2. **TypeScript 约束属性比 PRD 文档可靠**。文档会过期，类型不会
3. **事件命名规范早立**。我们后期改了一次命名规则，影响 200+ 历史事件，痛苦至极

埋点不是「写完就完」的事，每次大功能上线前都要回头看一遍数据是否能回答业务问题。这一点对前端工程师可能不直观，但越早建立这个意识，越早能从「执行者」转向「共建者」。
