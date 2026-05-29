export const siteConfig = {
  name: '一只打打打',
  description: '前端工程化 · 跨端业务 · 项目复盘 · 学习笔记',
  url: 'https://hff-blog.example.com',
  defaultLocale: 'zh-CN',
  author: {
    name: '胡凡凡',
    title: '前端开发工程师 / 9 年经验',
    avatar: '/images/avatar.svg',
    bio: '专注前端工程化、跨端开发与复杂业务抽象',
    location: '武汉',
    phone: '156****2305',
    email: 'qhufan@foxmail.com',
    techStack: [
      'Vue 3',
      'Vue 2',
      'Nuxt',
      'TypeScript',
      'uni-app',
      '小程序',
      'Pinia',
      'Element Plus',
      'Vite',
    ],
    nowPlaying: '持续沉淀 Nuxt 3 博客、鉴权中台接入经验与 uni-app 金融小程序架构复盘',
    summary:
      '9 年前端开发经验，覆盖微信小程序、H5、PC Web、移动 APP 多端形态，主导过金融贷款、跨境电商 ERP、景区一体化、SaaS 培训、企业中台等多类业务的前端架构设计与落地。擅长工程化体系搭建、通用组件库设计、性能优化与复杂业务抽象。',
  },
  nav: [
    { label: '首页', href: '/' },
    { label: '归档', href: '/archive' },
    { label: '标签', href: '/tags' },
    { label: '关于', href: '/about' },
  ],
  social: {
    github: 'https://github.com/hffbox',
    email: 'qhufan@foxmail.com',
    rss: '/rss.xml',
  },
  postsPerPage: 8,
  search: {
    enabled: true,
    placeholder: '搜索文章…',
  },
} as const

export type SiteConfig = typeof siteConfig
