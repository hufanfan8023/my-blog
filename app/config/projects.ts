import type { Project } from '~/types/project'

export const projects: Project[] = [
  {
    name: '统一鉴权与权限管理平台',
    description:
      '面向公司内部多业务系统的 SSO + 菜单权限中台。双层权限模型 + 动态路由，已稳定支撑 10+ 业务系统统一接入。前端独立完成。',
    tech: ['Vue 3', 'TypeScript', 'Vite', 'Pinia', 'Element Plus', 'AES'],
    cover: '/images/projects/sensor-sdk.svg',
    links: { article: '/posts/2026-06-22-auth-platform-design' },
    status: '已上线',
    year: 2024,
  },
  {
    name: '成就贷小程序',
    description:
      '面向 C 端的小额消费贷款金融小程序。主包+多分包架构、路由拦截网关、RSA+AES+Base64 三重加密、60+ 业务页面。',
    tech: ['uni-app', 'Vue 2', 'Vuex', 'uView', '神策埋点', '高德地图'],
    cover: '/images/projects/chengjiu-loan.svg',
    links: { article: '/posts/2026-06-15-sensor-sdk-integration' },
    status: '已上线',
    year: 2024,
  },
  {
    name: '高尔夫人才培养平台',
    description:
      '中国高尔夫球协会专业人才培训平台，含小程序与后台管理两端。RBAC 权限控制 + 双端共用接口规范。',
    tech: ['Vue 3', 'Ant Design Vue', 'ECharts', 'uni-app'],
    cover: '/images/projects/vue-picker.svg',
    status: '已上线',
    year: 2023,
  },
  {
    name: '亚马逊运营系统',
    description:
      'ECCANG ERP 衍生的跨境电商运营工具。配置驱动的表格/表单封装、虚拟滚动、ECharts 按需图表。',
    tech: ['Vue', 'Ant Design Vue', 'vxe-table', 'ECharts'],
    cover: '/images/projects/sensor-sdk.svg',
    status: '已归档',
    year: 2020,
  },
]

export const timeline = [
  {
    year: '2024.03 — 至今',
    title: '前端开发工程师',
    org: '武汉天源迪科数据科技有限公司',
    desc: '主导前端工程化体系搭建；担任鉴权中台前端独立负责人；沉淀业务通用组件实现跨项目复用。',
  },
  {
    year: '2022.03 — 2024.01',
    title: '前端开发工程师',
    org: '浙江力石科技股份有限公司湖北分公司',
    desc: '负责多个景区 / SaaS 项目从立项到上线全流程；牵头疑难需求技术调研，与后端、UI 协同制定设计规范。',
  },
  {
    year: '2020.03 — 2022.03',
    title: '前端开发工程师',
    org: '深圳易仓科技有限公司',
    desc: '跨境电商 SaaS 平台 Web 前端架构与核心功能；攻克多浏览器兼容、虚拟滚动性能、复杂表单兼容等技术难点。',
  },
  {
    year: '2017.09 — 2020.03',
    title: '前端开发工程师',
    org: '武汉蜡烛科技有限公司',
    desc: '负责微信端、APP、PC 端多端业务开发；设计、维护通用组件库，保障多端体验一致性。',
  },
]

export const skills = [
  {
    title: '核心框架',
    icon: '◆',
    items: ['Vue 2 / Vue 3', 'Vue Router', 'Vuex / Pinia', 'React 基础'],
  },
  {
    title: '跨端开发',
    icon: '◇',
    items: ['uni-app', '微信小程序原生', 'H5', '移动端混合开发'],
  },
  {
    title: 'UI 组件库',
    icon: '◈',
    items: ['Ant Design Vue', 'Element Plus', 'uView UI', 'Vant', '二次封装与自研'],
  },
  {
    title: '可视化',
    icon: '○',
    items: ['ECharts 按需封装', 'vxe-table', '大数据量虚拟滚动'],
  },
  {
    title: '工程化',
    icon: '◌',
    items: ['Webpack / Vite', 'ESLint / Prettier', 'Husky / Commitlint', 'CI/CD + K8s'],
  },
  {
    title: '基础与安全',
    icon: '◐',
    items: ['HTML5 / CSS3 / ES6+', 'TypeScript', '性能优化', 'XSS / CSRF / RSA / AES'],
  },
]

export const education = [
  {
    period: '2019 — 2022',
    school: '武汉科技大学',
    degree: '本科',
    major: '计算机科学与技术',
  },
  {
    period: '2014 — 2017',
    school: '湖北生物科技职业学院',
    degree: '大专',
    major: '计算机科学与技术',
  },
]

export const traits = [
  {
    title: '技术驱动',
    desc: '热爱编程，关注前端生态与新技术，乐于沉淀通用方案与工具，推动团队效率提升。',
  },
  {
    title: '业务理解',
    desc: '能从前端视角理解业务诉求，主动给出体验与实现层面的优化建议，不止于「按图施工」。',
  },
  {
    title: '团队协作',
    desc: '沟通清晰，能与产品、设计、后端、测试高效协作，具备承担前端负责人角色的全流程把控经验。',
  },
  {
    title: '抽象沉淀',
    desc: '擅长将重复出现的业务问题抽象为可配置、可复用的方案（如鉴权接入、协议系统、路由拦截网关）。',
  },
]

export const stats = [
  { num: '9+', label: 'YEARS', desc: '前端经验' },
  { num: '10+', label: 'SYSTEMS', desc: '鉴权接入' },
  { num: '60+', label: 'PAGES', desc: '小程序页面' },
  { num: '4', label: 'COMPANIES', desc: '工作经历' },
]
