# 一只打打打

Nuxt 3 + @nuxt/content + Tailwind 搭建的个人博客，天蓝云朵清新风格。

## 文档

设计与实现规范在仓库根的 `博客设计方案/` 目录：

- `博客技术栈方案.md` — 框架、模块、版本与分步实施计划
- `设计规范.md` — 视觉 token、组件规范、配色体系
- `交互设计.md` — 状态矩阵、动效时长、键盘交互
- `开发规范.md` — 工程规范、首版交付清单

## 启动

```bash
pnpm install        # 或 npm install / yarn
cp .env.example .env
pnpm dev            # http://localhost:3000
```

## 构建与预览

```bash
pnpm build          # 服务端构建
pnpm generate       # 静态站点构建（推荐用于 Vercel/Cloudflare Pages）
pnpm preview        # 预览构建产物
```

## 部署

- 默认走 Nitro 自动检测，Vercel/Cloudflare Pages 直接导入仓库即可
- 通过 `NUXT_PUBLIC_SITE_URL` 注入站点根 URL，影响 `/sitemap.xml` 与 `/rss.xml` 的绝对链接
- 若部署到 Cloudflare Pages，可在 `nuxt.config.ts` 中加 `nitro: { preset: 'cloudflare-pages' }`

## 写文章

在 `content/posts/` 新建 `YYYY-MM-DD-slug.md`，frontmatter 需包含：

```yaml
---
title: '标题'
date: '2026-06-15'
category: '技术深度' # 见 content.config.ts
tags: ['Vue', 'Nuxt']
description: '20-160 字描述'
featured: false
draft: false
---
```

可用的 MDC 组件：

- `::callout{type="info|warning|tip"}` — 提示块
- `::code-group` — 多 Tab 代码组
- `::image-with-caption{src="..." caption="..."}` — 带说明图片

## 目录速览

```
app/config/      站点配置（站点信息、作品集、时间线）
assets/css/      Tailwind 入口与全局 token
components/      common/content/home/layout/post/search 分组
composables/     文章查询、阅读进度、目录高亮
content/posts/   Markdown 文章
pages/           Nuxt 文件路由
server/routes/   sitemap.xml & rss.xml
types/           Post / Project 类型
```
