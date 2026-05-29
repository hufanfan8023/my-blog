---
title: "Hello World：博客搭建手记"
date: "2026-06-01"
category: "技术深度"
tags: ["Nuxt", "博客", "工程化"]
description: "用 Nuxt 3 + @nuxt/content + Tailwind 搭建一个天蓝云朵风格的个人博客，从设计 token 到 MDC 组件的完整记录"
featured: false
draft: false
---

第一次正经搭一个博客。不是用 Hexo、Hugo 这类成熟方案，而是从 Nuxt 3 起步，自己写设计 token、组件结构、内容查询。一方面我想要更可控的视觉表达，另一方面也想把博客本身当作一个工程练习。

## 为什么不用现成的主题

成熟主题的优势是开箱即用，劣势是「不像我」。我在第一版做过纸墨留白风格，也尝试过深色科技风，后来发现更适合自己的表达是清新的天蓝云朵视觉：轻一点、干净一点，同时保留工程师博客需要的结构感和信息密度。

技术栈决策时主要在两组之间犹豫：

- Next.js 15 + MDX：生态成熟，但 React Server Components 的心智成本对个人博客而言性价比偏低
- Nuxt 3 + @nuxt/content：Vue 默认同构，文件路由 + MDC 组件在博客场景下更顺手

最终选了后者。我自己工作中长期写 Vue，博客也用 Vue 更能反向沉淀经验。

## 设计 token 是第一生产力

整套设计规范我先定的不是组件，而是 token：

```ts
:root {
  --bg-page: #dff6ff;
  --bg-card: rgba(255, 255, 255, 0.76);
  --color-primary: #0EA5E9;
  --color-cyan: #06B6D4;
  --text-primary: #0C4A6E;
  --text-secondary: #475569;
}
```

`#475569` 这个值是反复测出来的：它落在云朵白卡片上比浅灰更稳，正文、摘要和辅助信息都能保持足够对比度。这种细节如果不写在 token 里，最后会散落在十几个组件的 inline style 里。

::callout{type="tip"}
个人项目最容易省略的就是「先想好规则」。一开始多花 30 分钟定 token，后面省下 3 小时改色值。
::

## MDC 比 MDX 更舒服

@nuxt/content v3 用的 MDC 语法是 Markdown 加上「`::component`」块：

```mdc
::callout{type="warning"}
这是一段警告
::
```

写起来比 MDX 的 `<Callout type="warning">...</Callout>` 更接近原生 Markdown。一个反复写文章的作者，应该在 90% 的时候只输入文字、偶尔切到组件，而不是相反。

## 云朵动效的性能成本

云朵背景不能为了氛围牺牲滚动体验。我把它拆成 CSS 云层和少量鼠标位移计算，并加了三层降级：

1. 背景云层使用 CSS 渐变和伪元素，不引入大图资源
2. 用户开启 `prefers-reduced-motion` 时，自动停掉漂移动画
3. 卡片列表的阴影只在 hover 态增强，不长期渲染高成本发光

测下来在我手头的 iPhone 13 / Pixel 6a / 一台旧的红米 Note 9 上都跑得动，长列表滚动时也能保持稳定。

## 搜索从第一天就要有

老博客经验：等文章超过 20 篇再加搜索是噩梦。我直接把 `⌘K` 弹层做成了首版必选。实现成本比想象低——用 @nuxt/content 的查询能力做模糊匹配，加权排序：

```ts
// 标题命中权重最高
let score = 0
if (p.title.includes(q)) score += 10
if (p.description.includes(q)) score += 5
if (p.tags.some((t) => t.includes(q))) score += 4
```

总共不到 30 行核心逻辑，体验完爆「在浏览器里 Ctrl+F」。

## 接下来

- [ ] 接入 Giscus 评论
- [ ] 自动生成 OG 图
- [ ] 亮色主题
- [ ] 接 Umami 看流量

写博客的麻烦不在搭，在持续写。这一篇先发出来，逼自己进入「博主」状态。
