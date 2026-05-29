---
title: "统一鉴权中台从 0 到 1：双层权限模型与跨系统 SSO 实战"
date: "2026-06-22"
category: "项目实战"
tags: ["鉴权", "SSO", "Vue 3", "TypeScript", "动态路由", "权限管理", "架构设计"]
description: "面向公司 10+ 内部业务系统的统一鉴权平台前端独立复盘——从双层权限模型、动态路由注册器、跨系统 SSO 重定向到 AES 加密通道与基线改造文档的完整设计落地"
featured: true
draft: false
---

这是我做过最值得拿出来复盘的一个项目。从 2024 年 3 月接手「公司内部统一鉴权与权限管理平台」前端独立负责，到 9 月完成核心模块、形成可接入文档、横向赋能 4 个业务系统接入，整体支撑 10+ 系统统一鉴权。

文章不打算讲鉴权的通用知识——OAuth、JWT、RBAC 这些资料满网都是。我想说的是真实落地里那些「为什么这么选、当时还差点选错」的决策细节。

## 一、为什么需要一个「鉴权中台」

公司内部业务系统多，每个系统过去都自己写一套登录页、自己定义角色、自己维护菜单。结果是：

- **同一个员工要在 N 个系统反复输密码**，离职后还得跨系统去清理账号
- **菜单/按钮权限散落各处**，运营/管理员要给某个用户开权限，得登 N 个后台
- **登录链路质量参差**，有的系统连 token 失效都不刷，跳到一个白页让人莫名其妙
- **新业务系统从 0 起步**，研发要花半周时间把登录、权限、菜单这套流程再写一遍

需求被收敛成一句话：**做一个内部 SSO + 权限中台，让新业务系统按文档改造基线就能接入，运维统一管账号和菜单。**

听起来是个「老生常谈」的中台需求，难点其实在两个地方：

1. 「鉴权平台本身」是有自己用户和权限的（运维平台的人 ≠ 业务系统的人），怎么把两套权限解耦？
2. 业务系统会不断增加，前端不能每接一个就发一次版，路由和菜单必须由后端配置驱动。

这两个问题催生了下面整套架构。

## 二、技术栈与整体定位

技术选型上没什么花活，选的都是公司主线栈：

| 层 | 选型 | 原因 |
|---|---|---|
| 框架 | Vue 3 + TypeScript | 团队主栈，类型安全对中台尤其重要 |
| 构建 | Vite | 启动快，配合 TS 体感好 |
| 路由 | Vue Router 4 | `addRoute` 动态注册能力对动态菜单是刚需 |
| 状态 | Pinia | 比 Vuex 4 类型友好，适合中台多模块 |
| UI | Element Plus | 中后台事实标准 |
| 网络 | Axios | 拦截器生态成熟，加密层好挂 |
| 加密 | crypto-js（AES） | 与后端约定的算法 |

定位上明确了一件事：**鉴权平台不是「集成所有业务的大壳子」，它只解决登录、用户、角色、菜单、项目这五件事**。业务系统的页面始终在业务系统自己的域名下，鉴权平台只在登录态丢失时被「跳过去」、登录后再「跳回来」。

::callout{type="tip"}
中台最容易膨胀成「什么都管」的怪物。在动手前先画清楚边界、列出明确不做的事，比花哨的功能列表重要得多。
::

## 三、双层权限模型：把「平台自身」与「被纳管业务」彻底分开

这是整个项目最先要拍板的事。早期讨论时，PM 给的草图把「鉴权平台的角色」和「某个业务系统的角色」混在一张表里，立刻暴露了一个问题：admin 角色到底是「鉴权平台的超级管理员」还是「某个业务系统的超级管理员」？

我的方案是把权限模型显式拆成**两层**：

### 系统级（静态路由）

控制「**谁能登录鉴权平台**、能在鉴权平台里看到哪些功能」。

- 路由在前端代码里写死，包括：用户管理、角色管理、项目管理、审计日志、个人设置
- 角色也是平台自治的，比如 `platform-admin`、`platform-operator`、`platform-viewer`
- 这一层的菜单不会随业务系统增加而变化

### 项目级（动态路由）

每一个**被接入的业务系统**作为一个**子菜单**挂载到左侧导航，每个项目内部有独立的：

- 项目用户（哪些员工属于该业务系统的用户）
- 项目角色（这些用户在该业务系统里的角色）
- 项目菜单（这些角色能看到该业务系统的哪些菜单和按钮）

这一层完全由后端数据库驱动，前端**不关心**到底有几个项目、每个项目长什么名字。

```
鉴权平台
├── [系统级 - 写死]
│   ├── 用户管理
│   ├── 角色管理
│   ├── 项目管理
│   └── 审计日志
└── [项目级 - 动态]
    ├── 标签管理系统
    │   ├── 项目用户
    │   ├── 项目角色
    │   └── 项目菜单
    ├── 党建管理系统
    │   └── ...
    └── 成就贷后台
        └── ...
```

为什么这样切？因为这两套权限的**生命周期**和**变更方**完全不同：

- 系统级权限改动需要前端发版（极少发生）
- 项目级权限改动只是后端配置（高频，业务侧自助完成）

混在一起会出现一个尴尬场景：业务方想新增一个项目级菜单，发现得动鉴权平台的代码。彻底分开后，**新业务接入和平台迭代解耦**——这是后来支撑 10+ 系统稳定增长的关键。

::callout{type="info"}
判断「该不该分层」的简单标准：变更频率不一样、变更人不一样、生命周期不一样，三者占其二就该分。
::

## 四、动态路由注册器：让后端配置驱动前端

双层模型确定后，技术上最关键的工程问题是：**怎么把后端返回的菜单树变成 Vue Router 的路由表 + 侧边栏数据？**

### 后端约定的数据结构

后端按项目维度返回菜单树，结构大致：

```ts
interface MenuNode {
  id: number
  parentId: number | null
  name: string                // 菜单显示名
  path: string                // 路由路径，如 '/proj-tag/users'
  componentKey: string        // 前端约定的组件键，如 'tag/Users'
  icon?: string
  type: 'menu' | 'button'     // 菜单或按钮级权限
  permissionCode?: string     // 按钮级权限码，如 'tag:user:delete'
  children?: MenuNode[]
}

interface ProjectInfo {
  id: number
  code: string                // 项目代号，如 'tag'
  name: string                // 项目显示名
  menus: MenuNode[]
}
```

### 前端组件懒加载白名单

不能让后端把任意 `componentKey` 直接 `import()`——那等于把任意路径加载权交给了后端。我做了一张**前端白名单映射表**：

```ts
// src/router/component-map.ts
export const componentMap: Record<string, () => Promise<any>> = {
  'tag/Users':       () => import('@/views/projects/tag/Users.vue'),
  'tag/Roles':       () => import('@/views/projects/tag/Roles.vue'),
  'tag/Menus':       () => import('@/views/projects/tag/Menus.vue'),
  'party/Users':     () => import('@/views/projects/party/Users.vue'),
  // ... 其余项目
}
```

后端只能下发**白名单里存在**的 `componentKey`，下发未注册的键直接走 404。这一层不能省，否则鉴权中台等于把代码加载权敞开给了数据库，谁能改库谁就能拿到任意页面。

### 注册器实现

核心是一个递归函数，把菜单树拍平成 Vue Router 路由：

```ts
// src/router/dynamic.ts
import type { RouteRecordRaw } from 'vue-router'
import router from './index'
import { componentMap } from './component-map'
import LayoutProject from '@/layouts/ProjectLayout.vue'

export function buildProjectRoutes(project: ProjectInfo): RouteRecordRaw {
  // 项目根路由：作为侧边栏一级菜单
  const root: RouteRecordRaw = {
    path: `/proj-${project.code}`,
    name: `proj-${project.code}`,
    component: LayoutProject,
    meta: { title: project.name, projectId: project.id },
    children: [],
  }

  const walk = (nodes: MenuNode[]): RouteRecordRaw[] =>
    nodes
      .filter((n) => n.type === 'menu')
      .map((n) => {
        const loader = componentMap[n.componentKey]
        if (!loader) {
          console.warn(`[router] componentKey 未注册: ${n.componentKey}`)
          return null
        }
        const route: RouteRecordRaw = {
          path: n.path,
          name: `proj-${project.code}-${n.id}`,
          component: loader,
          meta: {
            title: n.name,
            icon: n.icon,
            permissions: collectPermissions(n),
          },
        }
        if (n.children?.length) {
          route.children = walk(n.children)
        }
        return route
      })
      .filter(Boolean) as RouteRecordRaw[]

  root.children = walk(project.menus)
  return root
}

function collectPermissions(node: MenuNode): string[] {
  // 把按钮级权限码收集到父菜单的 meta，用于按钮级指令
  const codes: string[] = []
  const dig = (n: MenuNode) => {
    if (n.type === 'button' && n.permissionCode) codes.push(n.permissionCode)
    n.children?.forEach(dig)
  }
  node.children?.forEach(dig)
  return codes
}

export function registerDynamicRoutes(projects: ProjectInfo[]) {
  // 先清掉已有的动态路由（重新登录或刷新场景）
  const existing = router.getRoutes().filter((r) => r.name?.toString().startsWith('proj-'))
  existing.forEach((r) => router.removeRoute(r.name!))

  // 重新注册
  projects.forEach((p) => {
    router.addRoute(buildProjectRoutes(p))
  })
}
```

侧边栏数据由同一份 `projects` 派生，挂在 Pinia 里：

```ts
// src/stores/menu.ts
export const useMenuStore = defineStore('menu', () => {
  const projects = ref<ProjectInfo[]>([])
  const sidebar = computed(() => projects.value.map(toSidebarItem))

  async function loadFromServer() {
    const data = await api.getMyProjects()
    projects.value = data
    registerDynamicRoutes(data)
  }

  return { projects, sidebar, loadFromServer }
})
```

### 刷新页面后路由丢失的坑

第一版上线后立刻遇到经典问题：用户在某个项目页刷新浏览器，路由表是空的，404。

修法分两步：

1. **`router.beforeEach` 判定动态路由是否已加载**，没加载就先 `await menuStore.loadFromServer()`，然后用 `next({ ...to, replace: true })` 重新进入
2. 用一个 `routesReady` 标志位防止刷新瞬间多次并发拉取

```ts
let routesReady = false

router.beforeEach(async (to, from, next) => {
  if (!routesReady && needAuth(to)) {
    try {
      await useMenuStore().loadFromServer()
      routesReady = true
      return next({ ...to, replace: true })
    } catch {
      return next('/login?redirect=' + encodeURIComponent(to.fullPath))
    }
  }
  next()
})
```

这一段当时让我加了一句 `console.log('[guard]', to.path, routesReady)` 调了大概一下午，刷新会触发两次 `beforeEach`、`replace: true` 的二次进入又会再走一遍守卫，逻辑链路要画清楚才不会绕进死循环。

## 五、跨系统 SSO 重定向：最容易翻车的一环

这是整个项目的「灵魂」。业务系统域名各异（`https://tag.example.com`、`https://party.example.com`...），鉴权平台是独立域名（`https://auth.example.com`）。整个流程要解决三个问题：

1. 业务系统怎么知道「自己的登录失效了」并把人送到鉴权平台？
2. 鉴权平台登录成功后，怎么把 `token` 安全地送回业务系统？
3. 业务系统的鉴权地址会变（迁移、灰度），怎么避免硬编码？

### 整体流程

```
业务系统页面          业务系统后端          鉴权平台前端          鉴权平台后端
     │                    │                    │                    │
     │  请求受保护接口      │                    │                    │
     │───────────────────>│                    │                    │
     │                    │                    │                    │
     │  401 + 响应头携带   │                    │                    │
     │  X-Auth-Redirect   │                    │                    │
     │<───────────────────│                    │                    │
     │                                                              │
     │  跳转 https://auth.example.com/login                          │
     │  ?redirect=https://tag.example.com/users                      │
     │─────────────────────────────────────────>│                    │
     │                                          │  登录请求           │
     │                                          │───────────────────>│
     │                                          │  返回 token         │
     │                                          │<───────────────────│
     │                                                              │
     │  跳回 https://tag.example.com/users?token=xxx&user=xxx        │
     │<─────────────────────────────────────────│                    │
     │                                                              │
     │  接收参数、写入 storage、立即清理 URL                            │
```

### 关键决策点

**1. 鉴权地址不在前端硬编码**

第一版业务系统的代码里有 `const AUTH_URL = 'https://auth.example.com/login'`，结果鉴权平台第一次域名调整就让 4 个业务系统全部跟着发版。后来改成：

- 业务系统所有受保护接口在 401 时，**响应头**或响应体携带一个固定 `code`（如 `AUTH_REDIRECT_REQUIRED`）和重定向地址
- 业务前端拿到这个约定 code 才统一执行跳转，URL 由后端给

```ts
// 业务系统侧 - axios 响应拦截器
http.interceptors.response.use(undefined, (error) => {
  const { response } = error
  if (response?.status === 401) {
    const redirect = response.headers['x-auth-redirect']
    if (redirect) {
      const back = encodeURIComponent(window.location.href)
      window.location.replace(`${redirect}?redirect=${back}`)
      return new Promise(() => {}) // 阻断后续 catch
    }
  }
  return Promise.reject(error)
})
```

**2. token 通过 URL 回传，但落地后立刻清掉**

不能用 cookie——业务系统和鉴权平台是不同域名，跨站 cookie 在主流浏览器越来越严。`window.postMessage` 又得让原页面挂着监听器，跳转后页面已经卸载也不工作。

最终方案是把 `token` 拼到回跳 URL 的 query 里，**目标页接收后立即用 `history.replaceState` 把 URL 上的敏感参数清掉**：

```ts
// 业务系统侧 - 接收回跳的入口（一般在 main.ts 或顶层守卫）
function consumeAuthRedirect() {
  const url = new URL(window.location.href)
  const token = url.searchParams.get('token')
  const user = url.searchParams.get('user')
  if (token) {
    storage.set('token', token)
    if (user) storage.set('user', JSON.parse(decodeURIComponent(user)))

    url.searchParams.delete('token')
    url.searchParams.delete('user')
    window.history.replaceState({}, '', url.toString())
  }
}
```

清 URL 这一步不能省。否则用户复制地址栏分享给同事，token 就跟着泄露。也避免了浏览器历史里残留 token。

**3. 登出流程对称**

登出也走同样的回跳模式：业务系统调用 `/api/logout` 拿到鉴权平台的登出地址，跳过去清完平台 session 再跳回来，避免「业务系统以为登出了，平台 session 还活着」。

### 这一段踩过的坑

- **`replace` vs `href`**：跳转一定要用 `window.location.replace`，否则浏览器历史里会有一条 `auth.example.com/login?redirect=...` 的记录，用户点后退能回到登录中间页
- **`redirect` 参数的白名单校验**：鉴权平台后端必须校验 `redirect` 是不是已注册的业务系统域名，否则会变成开放重定向漏洞，攻击者可以拼一个 `?redirect=https://phishing.com` 把人导到钓鱼站
- **iframe 嵌套场景**：当时有个项目把业务系统嵌在另一个门户的 iframe 里，跳转到鉴权平台时被 X-Frame-Options 拦了。后来约定 iframe 内的 401 直接通知父窗口跳转，不在 iframe 内处理

::callout{type="warning"}
开放重定向是 SSO 系统最常见的安全洞之一。`redirect` 参数必须经过严格白名单匹配（**完整域名匹配**，不是 `startsWith`），否则等于送攻击者一个钓鱼跳板。
::

## 六、请求层封装：一个拦截器搞定鉴权 + 加密 + 错误码

中台所有页面通过一个统一的 `http` 实例发请求，业务侧不用关心 token 怎么注入、AES 怎么加密、登录失效怎么跳。

### Axios 拦截器骨架

```ts
// src/api/http.ts
import axios from 'axios'
import { aesEncrypt, aesDecrypt } from '@/utils/crypto'
import { useUserStore } from '@/stores/user'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 15000,
})

// 请求拦截器：注入 token + 加密敏感字段
http.interceptors.request.use((config) => {
  const token = useUserStore().token
  if (token) config.headers.Authorization = `Bearer ${token}`

  // 约定 config.meta.encrypt = true 时加密 body
  if (config.data && (config as any).meta?.encrypt) {
    config.data = { payload: aesEncrypt(JSON.stringify(config.data)) }
  }
  return config
})

// 响应拦截器：解密 + 错误码统一处理
http.interceptors.response.use(
  (resp) => {
    const data = resp.data
    if (data?.encrypted) {
      data.data = JSON.parse(aesDecrypt(data.payload))
    }
    if (data?.code !== 0) {
      // 业务错误码统一在这里抛
      ElMessage.error(data.message || '请求失败')
      return Promise.reject(data)
    }
    return data.data
  },
  async (error) => {
    const status = error.response?.status
    if (status === 401) {
      // 鉴权平台自身登录态失效：直接跳登录
      useUserStore().logout()
      const redirect = encodeURIComponent(location.pathname + location.search)
      location.replace(`/login?redirect=${redirect}`)
      return new Promise(() => {})
    }
    if (status === 403) {
      ElMessage.error('无权访问该资源')
    } else {
      ElMessage.error(error.message || '网络异常')
    }
    return Promise.reject(error)
  },
)

export default http
```

### AES 选型与坑

后端约定是 AES/CBC/PKCS7，密钥和 IV 通过环境变量配置。第一版用了 ECB 模式，被安全同学打回来——同样明文加密结果一样、容易被分析。换成 CBC + 随机 IV 后，IV 随密文一起回传：

```ts
import CryptoJS from 'crypto-js'

const KEY = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_AES_KEY)

export function aesEncrypt(plain: string): string {
  const iv = CryptoJS.lib.WordArray.random(16)
  const ct = CryptoJS.AES.encrypt(plain, KEY, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  // IV + 密文拼接后 Base64
  return CryptoJS.enc.Base64.stringify(iv.concat(ct.ciphertext))
}

export function aesDecrypt(b64: string): string {
  const all = CryptoJS.enc.Base64.parse(b64)
  const iv = CryptoJS.lib.WordArray.create(all.words.slice(0, 4))
  const ct = CryptoJS.lib.WordArray.create(all.words.slice(4))
  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: ct } as any,
    KEY,
    { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 },
  )
  return decrypted.toString(CryptoJS.enc.Utf8)
}
```

::callout{type="warning"}
前端 AES 密钥本质上是「混淆」而非「保密」——任何人都能扒出来。它的价值是在网络层让中间人**抓包后看不到明文**，但不能替代 HTTPS。真正的认证安全还是在 token 和签名上。
::

## 七、Pinia 状态层与按钮级权限指令

### 状态分层

```ts
// stores/user.ts        登录态、当前用户信息、token
// stores/menu.ts         项目列表、动态菜单、侧边栏
// stores/permission.ts   按钮级权限码集合
```

按钮级权限单独抽出来，因为它访问频率最高（每个按钮渲染时都要查），用 `Set<string>` 存查询是 O(1)：

```ts
export const usePermissionStore = defineStore('permission', () => {
  const codes = ref<Set<string>>(new Set())

  function setCodes(list: string[]) {
    codes.value = new Set(list)
  }

  function has(code: string) {
    return codes.value.has(code)
  }

  return { codes, setCodes, has }
})
```

### 按钮级权限指令

模板里写 `v-permission="'tag:user:delete'"` 比 `v-if="hasPerm(...)"` 优雅，做成自定义指令：

```ts
// directives/permission.ts
import type { Directive } from 'vue'
import { usePermissionStore } from '@/stores/permission'

export const vPermission: Directive<HTMLElement, string | string[]> = {
  mounted(el, binding) {
    const codes = Array.isArray(binding.value) ? binding.value : [binding.value]
    const store = usePermissionStore()
    const ok = codes.some((c) => store.has(c))
    if (!ok) {
      el.parentNode?.removeChild(el)
    }
  },
}
```

注意是 `removeChild` 而不是 `display: none`——否则 F12 改一下样式就能看到按钮，点一下还是能发请求。当然后端必须做最终校验，前端隐藏只是为了不误导用户。

## 八、接入文档：让业务团队自助接入

平台再好用，如果接入要靠我手把手对接，价值就大打折扣。我把整个接入流程沉淀成一份 Markdown 文档，结构是：

1. **基线代码改造清单**（要新增的文件、要修改的文件、要删除的旧鉴权代码）
2. **路由配置规范**（哪些写在前端代码、哪些必须由后端配置）
3. **菜单上报规范**（`componentKey` 命名约定、`permissionCode` 命名约定）
4. **SSO 重定向对接说明**（响应头 / 响应体格式、redirect 参数处理、token 接收）
5. **常见问题排查**（401 死循环、菜单不显示、按钮权限不生效）

文档第一稿是给标签管理系统接入时同步写的，第二个项目（党建管理）按文档自助接入，反馈了几个含糊的地方就立刻迭代。到第四个项目（优惠券管理）时，业务团队基本不需要找我答疑，几小时就跑通流程。

::callout{type="tip"}
中台项目的 ROI 不在「平台本身做了多少功能」，而在「业务团队接入这个平台之后省了多少工」。文档比代码更影响这个数字。
::

## 九、踩过的坑与回头看

### 坑一：第一版把「平台用户」和「项目用户」放在同一张表

设计初期为了「省事」，所有用户进同一张 `user` 表，靠 `roleType` 字段区分。结果在「同一员工同时是平台运营员 + 业务系统普通用户」时数据语义就错了。**第二版果断拆表**——平台用户、项目用户独立，两边只通过 `employeeId` 软关联。

教训：**身份语义不同的实体不要为了 DRY 强行合并**。

### 坑二：动态路由刷新丢失，最初用 `keep-alive` 救火

最早遇到刷新 404 时，我条件反射想到「页面状态没缓存」，加了 `keep-alive`，没用。问题在路由表本身没注册，不是组件状态丢了。后来才回到 `beforeEach` 等待动态路由加载完成的正确解法。

教训：**症状相似的问题，根因可能完全不同**。看到 404 先想路由表是否已注册，再想组件渲染。

### 坑三：审计日志体量爆炸

刚上线时审计日志记录所有操作，一个月数据 30G，前端列表查询慢得感人。后来：

- 后端按 「敏感操作」（增删改、登录、权限变更）和「普通操作」（列表查询、详情查看）分级
- 前端默认只显示敏感操作，普通操作走「高级筛选」
- 列表加虚拟滚动 + 服务端分页，单页固定 20 条

教训：**审计日志默认就要做分级和分页设计**，不要写完功能再回头优化。

### 坑四：iframe 嵌入场景的鉴权跳转被 X-Frame-Options 拦截

当时有个门户把业务系统嵌成 iframe，业务系统 401 时尝试跳转鉴权平台，被浏览器拦了。临时解法是 iframe 内通过 `postMessage` 通知父窗口跳转，长期方案是门户层做整体登录态检查、避免业务系统在 iframe 内独立鉴权。

教训：**SSO 流程要把 iframe / SPA 嵌套这种边缘场景列入测试用例**，不然上线后才发现一片业务方在用。

## 十、收益与回顾

整个项目从 2024 年 3 月到 9 月，前端独立完成。结果上：

- **稳定支撑 10+ 业务系统**接入，覆盖标签管理、党建管理、成就贷后台、优惠券管理等
- **新业务接入周期**从「研发自实现登录与权限（约 3-5 人天）」缩短到「按文档改造基线 + 后端配置项目（约 0.5-1 人天）」
- **沉淀了一份《鉴权系统接入文档》**，业务团队从需要专人对接变为自助接入

复盘下来，最让我觉得「值」的不是写了多少代码，而是把双层权限模型、动态路由、SSO 重定向这三件事的边界讲清楚之后，整个系统能自然扩展。每接入一个新业务，没人需要回头改鉴权平台。

如果再做一次，我大概会做的不一样的几件事：

1. **更早把 SSO 重定向流程画成时序图**——一开始是文字描述，团队对齐成本不小，画图后讨论效率高很多
2. **把「鉴权地址来自接口而非硬编码」从 v1 就做掉**，不要等域名调整时才补救
3. **审计日志 v1 就做分级**，别等爆库了才设计

写到这里也算把这个项目给自己交代了一遍。鉴权这种「基础设施类」项目最大的特点是：做得好没人感知，做得差所有人骂你。能让 10+ 团队悄无声息地用着，已经是它最大的体面。

接下来想写的是请求层 AES 加密的更深一层（IV 处理、key 旋转、与后端的密钥协商），等下一篇。
