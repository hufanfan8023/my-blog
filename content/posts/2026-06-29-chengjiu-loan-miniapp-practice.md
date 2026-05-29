---
title: '成就贷小程序实战：金融业务的路由拦截、实名链路与加密请求层'
date: '2026-06-29'
category: '项目实战'
tags: ['uni-app', 'Vue 2', '小程序', '金融业务', '路由拦截', '加密']
description: '从成就贷小程序交接视角复盘金融类 uni-app 项目，覆盖分包结构、登录实名、路由拦截、请求加密、协议管理与打包交付'
featured: true
draft: false
---

成就贷小程序是一个典型的 C 端金融业务项目：用户从注册登录、实名认证、授信申请、借款申请，到还款、银行卡管理、申诉反馈，基本都在小程序里闭环完成。

这类项目和普通活动页最大的区别是，页面多、状态多、链路长，而且每一步都和风控、合规、用户身份强绑定。下面按我接手和交付时最关注的几个点来复盘。

::callout{type="info"}
这篇文章只保留工程方案和业务链路，真实 AppID、应用标识、接口域名、负责人信息等都做了脱敏，不适合作为线上配置文档使用。
::

## 一、技术栈不是难点，边界才是

项目技术栈比较传统，但非常符合当时的团队和业务环境：

| 层       | 选型                          | 作用                                       |
| -------- | ----------------------------- | ------------------------------------------ |
| 跨端框架 | uni-app + Vue 2               | 编译到微信小程序，沿用团队存量技术栈       |
| UI       | uView UI                      | 表单、弹层、picker 等移动端基础组件        |
| 状态     | Vuex                          | 存登录态、用户信息、银行卡、字典等全局数据 |
| 请求     | uni.request + uView HTTP 封装 | 统一处理 token、加解密、错误提示           |
| 安全     | RSA + AES + Base64            | 请求参数加密与响应解密                     |
| 埋点     | 神策数据                      | 页面访问、曝光、业务事件追踪               |
| 定位     | 高德地图小程序 SDK            | 地址选择器和定位初始化                     |

真正需要先划清的是项目边界。成就贷不是一个「页面集合」，而是一条金融业务履约链路。用户能不能借、能借多少、是否需要补充资料、证件是否过期、是否要刷脸，都不是单个页面能决定的，必须通过全局状态和路由前置校验来统一处理。

## 二、分包结构：把主入口和业务重模块拆开

项目采用 uni-app 分包机制，主包只保留首页、我的、公共组件和启动必需逻辑，实名、授信、借款、还款、银行卡、协议等模块拆到分包里：

```text
czqb-miniapp/
├── pages/                 # 主包：首页、个人中心
├── subPages/              # 分包：实名、授信、借款、还款、银行卡等
├── appealPages/           # 申诉反馈分包
├── components/            # 主包公共组件
├── common/                # 路由拦截、协议配置等公共逻辑
├── config/                # 环境配置
├── http/                  # 请求层与加解密
├── store/                 # Vuex 全局状态
├── utils/                 # 工具函数
├── mixins/                # 全局 mixin
└── static/                # 静态资源
```

这个拆法的收益很直接：用户首次打开小程序时，不需要把借款合同、结清证明、还款记录、申诉页面这些低频模块一次性加载进来。金融小程序首页往往还要拉用户额度、认证状态、营销弹窗和字典数据，主包越轻，启动体验越稳。

分包还有一个交接层面的好处：新人找业务时不需要全局搜索。`subPages/identify` 就是实名，`subPages/borrow` 就是借款，`subPages/repayment` 就是还款，业务边界和目录边界基本一致。

## 三、登录链路：不要只存 token，要存业务身份

成就贷的登录不是简单的「拿到 token 就结束」。小程序启动后会先走微信登录能力，再和后端用户体系合并：

```text
小程序启动
  ↓
wx.login() 获取 code
  ↓
后端换取 session_key / open_id
  ↓
判断是否老用户
  ├─ 老用户：自动登录，拉取用户信息
  └─ 新用户：进入手机号一键登录或验证码登录
  ↓
登录成功后写入 token、custNo、userInfo
  ↓
刷新银行卡、认证状态、额度等业务数据
```

这里最容易被低估的是 `custNo`。在金融业务里，token 解决的是「请求能不能通过鉴权」，`custNo` 解决的是「当前用户在信贷系统里是谁」。后续授信、借款、还款、银行卡、协议签署等接口都会围绕客户编号工作，所以它必须和 token 一样被纳入全局状态。

我更倾向于把登录态拆成三层理解：

| 数据       | 用途                         | 生命周期                 |
| ---------- | ---------------------------- | ------------------------ |
| `token`    | 接口鉴权                     | 失效后需要重新登录       |
| `custNo`   | 金融客户编号                 | 登录后贯穿业务请求       |
| `userInfo` | 认证、额度、手机号等业务状态 | 页面 onShow 时要主动刷新 |

外部渠道会通过 URL 参数带入登录凭据。这类特殊入口要单独收口，不能散落在每个页面里判断。否则后续渠道增加时，首页、借款页、还款页都可能出现重复兼容逻辑。

## 四、实名链路：用前置检查保护每个敏感操作

金融小程序里，「借款前需要实名」只是表层规则。真实链路更细：

```text
进入敏感操作
  ↓
queryUserBorrowPreCheck
  ↓
判断是否已实名、证件是否过期、是否需要补录
  ├─ 已通过：继续业务
  ├─ 未实名：进入实名首页
  ├─ 认证中：拦截并提示等待审核
  ├─ 认证失败：允许重新认证
  └─ 证件临期或过期：重新上传证件
```

实名模块本身拆成三段：身份证 OCR、人脸识别、个人信息补充。页面上看起来是几个表单和上传组件，工程上真正重要的是状态机。

```ts
type AuditStatus = 1 | 2 | 3

const auditText: Record<AuditStatus, string> = {
  1: '认证中',
  2: '认证通过',
  3: '认证失败',
}

function canContinueBorrow(status: AuditStatus) {
  return status === 2
}
```

实际项目里还要判断证件有效期，约定「过期或 30 天内即将过期」都要重新上传。这类规则不要写在按钮点击里，应该放到认证前置检查或路由拦截里，让借款、绑卡、交易密码设置等入口都复用同一套判断。

## 五、路由拦截：所有跳转都走同一个入口

这个项目里最关键的一条开发规范是：**页面跳转必须使用 `uni.$u.route()`，不要直接 `uni.navigateTo()`。**

原因很简单，项目自定义了路由拦截系统。只有走统一跳转入口，登录、实名、刷脸、补录这些前置校验才会被触发。

| 拦截类型 | 典型场景                 | 检查逻辑                      |
| -------- | ------------------------ | ----------------------------- |
| 登录拦截 | 我的账单、银行卡、还款   | Vuex / Storage 是否有用户信息 |
| 实名拦截 | 借款、绑卡、设置交易密码 | 调接口检查认证状态            |
| 活体拦截 | 高风险操作               | 检查是否需要刷脸              |
| 补录拦截 | 授信或借款资料缺失       | 检查用户资料完整性            |

伪代码大概是这样：

```js
const guards = {
  login: checkLogin,
  auth: checkRealName,
  face: checkFaceRequired,
  fillInfo: checkReplenishInfo,
}

export async function routeTo(url, options = {}) {
  const matched = findRouteRule(url)

  for (const guardName of matched.guards) {
    const ok = await guards[guardName](url)
    if (!ok) return
  }

  return uni.$u.route(url, options)
}
```

这里的设计重点不是代码多复杂，而是「入口唯一」。只要团队里有人绕过统一入口，敏感页面就可能被直接打开，或者出现用户状态不一致的问题。交接时我会把这条放到最高优先级，因为它比某个页面怎么写更影响系统稳定性。

::callout{type="warning"}
金融业务里的前置校验不要相信「页面自己会判断」。页面判断只能兜底，真正的体验一致性来自统一路由入口和后端最终校验。
::

## 六、首页 onShow：刷新全局业务状态

成就贷首页不是静态首页，它承担了全局状态刷新职责。文档里的首页加载逻辑可以简化成这样：

```js
onShow() {
  // 1. 开始页面停留或曝光计时
  uni.$sensors.$state.$startTime = Date.now()

  // 2. 刷新用户核心信息
  this.refreshInfo()

  // 3. 启动首页曝光埋点
  this.startEvent()

  // 4. 已登录用户检查营销订阅或弹窗资源
  const status = uni.getStorageSync('statusThanPhone')
  if (status !== '2' && this.userInfo) {
    uni.$emit('servePopup', 1)
  }
}
```

为什么放在 `onShow` 而不是只放 `onLoad`？因为用户可能在实名页、银行卡页、授信页修改了状态，再回到首页时必须看到最新额度、认证状态和待办提示。金融业务的页面状态不能只看「第一次打开」，还要看「从别的业务页回来」。

全局数据大致分成几类：

| 数据       | 存储位置             | 用途                         |
| ---------- | -------------------- | ---------------------------- |
| `userInfo` | Vuex + Storage       | 用户信息、认证状态、额度状态 |
| `token`    | Vuex + Storage       | 请求鉴权                     |
| `custNo`   | Vuex + Storage       | 客户编号                     |
| `bankList` | Vuex + Storage       | 绑卡与还款                   |
| `areaData` | Storage + globalData | 地址选择器                   |
| `sysDict`  | Vuex                 | 职业、用途等字典项           |

这个表在交接时很有用。新人接手一个页面时，先看它依赖的是哪类全局数据，再决定是用缓存、刷新接口，还是监听事件同步。

## 七、请求加密：把复杂性封到 HTTP 层

请求层是金融项目最不该散写的地方。成就贷使用的是 RSA + AES + Base64 的组合方案：

```text
请求加密：
1. 生成 16 字节随机 AES key
2. AES key 做 Base64 编码
3. 使用 RSA 公钥加密编码后的 AES key
4. 使用 AES key 加密请求参数
5. 同时发送加密后的 key 和 payload

响应解密：
1. 从本次请求配置里取出对应 AES key
2. 用 AES key 解密响应 payload
3. JSON.parse 得到业务数据
```

调用方不应该关心加密细节。页面层只发普通对象，请求层负责转换：

```js
async function secureRequest(config) {
  const aesKey = createRandomAesKey()

  const payload = aesEncrypt(JSON.stringify(config.data), aesKey)
  const encryptedKey = rsaEncrypt(base64Encode(aesKey))

  const res = await uni.request({
    ...config,
    data: {
      key: encryptedKey,
      payload,
    },
    header: {
      ...config.header,
      Authorization: getToken(),
    },
  })

  return JSON.parse(aesDecrypt(res.data.payload, aesKey))
}
```

有一个需要明确的风险点：如果历史系统约定的是 AES ECB 模式，前端只能按接口约定实现，但新方案不建议继续选 ECB。更稳妥的做法是 CBC + 随机 IV，或者直接使用更现代的认证加密模式。前端加密也不能替代 HTTPS 和后端签名校验，它更像是降低抓包明文暴露的成本。

## 八、协议系统：不要把协议散落在页面里

金融业务有大量协议：注册协议、隐私政策、用户授权、贷款合同、授权书、承诺函等。如果每个页面自己写协议名称、ID、跳转路径，后期维护会很痛。

项目把协议集中放在 `common/HX_AGREEMENT.js`，页面只关心协议 ID 和展示方式：

```js
// 单个协议
uni.$u.route('/subPages/common/agreementIndex?page=loanContract')

// 多个协议，通过 EventChannel 传给协议集合页
const eventChannel = this.getOpenerEventChannel()
eventChannel.emit('sendAgreementData', {
  data: ['register', 'privacy', 'authorization'],
  isReadBtn: true,
})
```

配套的 `agree-check` 组件负责协议勾选、协议名称点击、强制阅读后才能勾选等交互。这个组件看起来小，但它减少了大量重复逻辑，也避免了「A 页面要求读完才能勾，B 页面却没限制」这种合规体验不一致。

同理，`uni-h-button` 统一处理按钮样式和防重复点击。金融链路里重复提交尤其危险，借款申请、还款支付、绑卡确认这些按钮都不应该裸写。

## 九、环境和打包：HBuilderX 是项目事实入口

这个项目还有一个容易踩坑的点：不能用 `npm run dev` 当作启动方式。它是 HBuilderX 驱动的 uni-app 小程序项目，开发和打包都要走 HBuilderX 与微信开发者工具。

环境配置通过条件编译切换：

```js
let config

// #ifndef HBCFC-RELEASE
import uatConfig from '@/config/env/index.uat.js'
config = uatConfig
// #endif

// #ifdef HBCFC-RELEASE
import proConfig from '@/config/env/index.pro.js'
config = proConfig
// #endif

export default config
```

交接时我会把启动步骤写得很具体：

1. 用 HBuilderX 打开项目根目录
2. 配置微信开发者工具路径
3. 打开微信开发者工具的服务端口
4. 运行到微信小程序模拟器
5. 生产包选择对应条件编译平台
6. 在微信开发者工具上传，再到微信公众平台提交审核

这类信息看着不像技术亮点，但对接手效率影响很大。一个项目能不能顺利交出去，不只看代码抽象，也看新人能不能第一天跑起来。

## 十、我会重点交接的 checklist

如果让我再交接一次这类金融小程序，我会把下面这份清单放到文档最前面：

- [ ] 启动方式是否讲清楚：HBuilderX、微信开发者工具、服务端口、条件编译
- [ ] 登录态是否讲清楚：token、custNo、userInfo 分别解决什么问题
- [ ] 敏感入口是否都走统一路由：不要绕过 `uni.$u.route()`
- [ ] 实名状态是否统一检查：认证中、认证失败、证件临期都要覆盖
- [ ] 请求层是否统一封装：token、加密、解密、错误码不要散在页面里
- [ ] 首页是否刷新核心状态：从实名、借款、还款页返回后状态必须同步
- [ ] 协议是否集中维护：协议 ID、名称、组件和强制阅读规则不要散写
- [ ] 打包环境是否可追溯：UAT、生产、灰度的配置来源要明确

## 复盘

成就贷这类项目的难点不是某一个页面写得多复杂，而是几十个页面都依赖同一组身份、认证、额度、银行卡、协议和风控状态。只靠页面开发经验，很容易写成「每个页面自己判断一点」；真正能让项目稳定的是几条公共主线：

1. **路由拦截统一入口**，把登录、实名、刷脸、补录都收敛起来。
2. **请求层统一封装**，把 token、加密、解密、错误处理从页面里拿掉。
3. **全局状态有刷新策略**，尤其是首页和个人中心，不能只相信缓存。
4. **协议和按钮组件化**，把合规和防重复提交变成默认能力。
5. **交接文档写运行细节**，不要只写目录结构和技术栈。

金融小程序的工程质量，很多时候体现在「用户走不到错误状态」上。用户不需要知道背后有多少拦截、加密和状态同步，只要借款、还款、认证这些关键动作一路顺下去，就是前端工程价值最直接的体现。
