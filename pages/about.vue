<script setup lang="ts">
import { siteConfig } from '~/app/config/site'
import { education, projects, skills, stats, timeline, traits } from '~/app/config/projects'

const withBasePath = useBasePath()

const capabilityHighlights = [
  'Vue 2 / Vue 3 / Nuxt / TypeScript 项目从 0 到 1 搭建',
  'uni-app、微信小程序、H5、PC Web、移动 APP 多端交付',
  '权限中台、金融贷款、跨境电商 ERP、景区 SaaS 等复杂业务落地',
  '工程化规范、通用组件库、性能优化与安全加密链路沉淀',
]

const projectHighlights = [
  {
    name: '成就贷小程序',
    role: '前端开发 / 主要维护人',
    period: '2024.09 — 至今',
    summary:
      '面向 C 端的小额消费贷款金融小程序，覆盖注册登录、实名认证、授信申请、借款用信、还款管理、申诉反馈全流程。',
    points: [
      '主包 + 多业务分包结合 preloadRule、lazyCodeLoading 控制包体与首屏体验。',
      '抽象 INTER_LOGIN / INTER_AUTH / INTER_FACE / INTER_FILLINFO 四类路由拦截规则。',
      '封装 RSA + AES + Base64 加密请求通道，并接入神策埋点与高德地图 SDK。',
    ],
  },
  {
    name: '统一鉴权与权限管理平台',
    role: '前端独立负责',
    period: '2024.03 — 2024.09',
    summary:
      '面向公司内部多业务系统的 SSO、用户、角色、菜单、项目与审计日志中台，整体前端架构与核心模块独立完成。',
    points: [
      '设计系统级与项目级双层权限模型，菜单与路由由后端配置驱动。',
      '封装动态路由注册、Token 注入、AES 加解密、失效重定向等基础能力。',
      '沉淀鉴权系统接入文档，支撑 10+ 业务系统统一接入。',
    ],
  },
  {
    name: '亚马逊运营系统',
    role: '前端开发工程师',
    period: '2020.03 — 2020.07',
    summary: '跨境电商运营工具，支撑订单、Listing、广告、库存、关键词监控等高密度业务场景。',
    points: [
      '基于 vxe-table 与 FormModel 二次封装配置化表格 / 表单。',
      '针对万级数据列表沉淀虚拟滚动方案，减少大列表卡顿。',
      '按需封装 ECharts 图表组件，统一平台可视化能力。',
    ],
  },
]

const contactItems = [
  { label: '邮箱', value: siteConfig.author.email, href: `mailto:${siteConfig.author.email}` },
  { label: '电话', value: siteConfig.author.phone, href: `tel:${siteConfig.author.phone}` },
  { label: 'GitHub', value: 'https://github.com/hffbox', href: siteConfig.social.github },
]

function projectHref(project: (typeof projects)[number]) {
  return withBasePath(project.links?.article || project.links?.github || '#projects')
}

useSeoMeta({
  title: '关于',
  description: `${siteConfig.author.name} · ${siteConfig.author.title} · ${siteConfig.author.summary}`,
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: siteConfig.author.name,
        jobTitle: siteConfig.author.title,
        email: siteConfig.author.email,
        telephone: siteConfig.author.phone,
        address: siteConfig.author.location,
        url: siteConfig.url,
        sameAs: [siteConfig.social.github],
        knowsAbout: siteConfig.author.techStack,
        description: siteConfig.author.summary,
      }),
    },
  ],
})
</script>

<template>
  <div class="about">
    <div class="container">
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">FRONTEND ENGINEER · WUHAN</p>
          <h1 class="name">{{ siteConfig.author.name }}</h1>
          <p class="headline">{{ siteConfig.author.title }}</p>
          <p class="summary">{{ siteConfig.author.summary }}</p>

          <div class="hero-actions">
            <a :href="`mailto:${siteConfig.author.email}`" class="btn btn--primary">联系我</a>
            <a href="#projects" class="btn">查看项目</a>
          </div>
        </div>

        <div class="hero-profile">
          <div class="avatar-wrap">
            <img
              :src="withBasePath(siteConfig.author.avatar)"
              alt="胡凡凡头像"
              class="avatar"
              width="112"
              height="112"
            />
          </div>
          <div class="profile-lines">
            <span>9 年前端经验</span>
            <strong>Vue / Nuxt / uni-app</strong>
            <small>{{ siteConfig.author.location }} · 可负责从架构到上线的完整链路</small>
          </div>
        </div>
      </section>

      <section class="stats">
        <div v-for="item in stats" :key="item.label" class="stat-card">
          <strong>{{ item.num }}</strong>
          <span>{{ item.desc }}</span>
          <small>{{ item.label }}</small>
        </div>
      </section>

      <section class="intro-grid">
        <div class="intro-panel">
          <p class="section-kicker">ABOUT</p>
          <h2>我关注可复用的前端体系，也关注业务真实落地。</h2>
          <p>
            过去的工作覆盖金融贷款、统一鉴权、跨境电商 ERP、景区一体化、SaaS 培训与企业中台。
            我更擅长把复杂需求拆成稳定的前端模型：路由权限、请求加密、组件配置、跨端差异、性能瓶颈和协作规范。
          </p>
        </div>

        <div class="now-panel">
          <span class="pulse" aria-hidden="true" />
          <p class="section-kicker">NOW</p>
          <h2>最近在做</h2>
          <p>{{ siteConfig.author.nowPlaying }}</p>
        </div>
      </section>

      <section class="section">
        <div class="section-head">
          <p class="section-kicker">CAPABILITY</p>
          <h2>核心能力</h2>
        </div>
        <div class="highlight-list">
          <div v-for="item in capabilityHighlights" :key="item" class="highlight-item">
            {{ item }}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-head">
          <p class="section-kicker">SKILLS</p>
          <h2>技术栈与工程能力</h2>
        </div>
        <div class="skill-grid">
          <article v-for="skill in skills" :key="skill.title" class="skill-card">
            <span class="skill-icon">{{ skill.icon }}</span>
            <h3>{{ skill.title }}</h3>
            <div class="skill-tags">
              <span v-for="item in skill.items" :key="item">{{ item }}</span>
            </div>
          </article>
        </div>
      </section>

      <section id="projects" class="section">
        <div class="section-head">
          <p class="section-kicker">PORTFOLIO</p>
          <h2>作品集</h2>
        </div>
        <div class="project-grid">
          <a
            v-for="project in projects"
            :key="project.name"
            :href="projectHref(project)"
            class="project-card"
          >
            <img
              :src="withBasePath(project.cover)"
              :alt="project.name"
              class="cover"
              loading="lazy"
              decoding="async"
            />
            <div class="project-body">
              <div class="project-title-row">
                <h3>{{ project.name }}</h3>
                <span class="project-status" :class="`status--${project.status}`">
                  {{ project.status }}
                </span>
              </div>
              <p>{{ project.description }}</p>
              <div class="project-tags">
                <span v-for="tech in project.tech" :key="tech">{{ tech }}</span>
              </div>
              <small>{{ project.year }}</small>
            </div>
          </a>
        </div>
      </section>

      <section class="section">
        <div class="section-head">
          <p class="section-kicker">CASE STUDY</p>
          <h2>项目亮点</h2>
        </div>
        <div class="case-list">
          <article v-for="item in projectHighlights" :key="item.name" class="case-card">
            <div class="case-meta">
              <span>{{ item.period }}</span>
              <strong>{{ item.role }}</strong>
            </div>
            <div class="case-content">
              <h3>{{ item.name }}</h3>
              <p>{{ item.summary }}</p>
              <ul>
                <li v-for="point in item.points" :key="point">{{ point }}</li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      <section class="section">
        <div class="section-head">
          <p class="section-kicker">EXPERIENCE</p>
          <h2>工作经历</h2>
        </div>
        <div class="timeline">
          <article v-for="item in timeline" :key="`${item.year}-${item.org}`" class="timeline-item">
            <div class="timeline-point" aria-hidden="true" />
            <time>{{ item.year }}</time>
            <div>
              <h3>{{ item.title }} · {{ item.org }}</h3>
              <p>{{ item.desc }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="detail-grid">
        <div class="detail-panel">
          <p class="section-kicker">EDUCATION</p>
          <h2>教育经历</h2>
          <div class="education-list">
            <div v-for="item in education" :key="`${item.period}-${item.school}`">
              <strong>{{ item.school }}</strong>
              <span>{{ item.period }} · {{ item.degree }} · {{ item.major }}</span>
            </div>
          </div>
        </div>

        <div class="detail-panel">
          <p class="section-kicker">WORK STYLE</p>
          <h2>工作方式</h2>
          <div class="trait-list">
            <div v-for="item in traits" :key="item.title">
              <strong>{{ item.title }}</strong>
              <span>{{ item.desc }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="contact-band">
        <div>
          <p class="section-kicker">CONTACT</p>
          <h2>欢迎交流前端架构、跨端开发和业务工程化。</h2>
        </div>
        <div class="contacts">
          <a
            v-for="item in contactItems"
            :key="item.label"
            :href="item.href"
            class="contact-link"
            target="_blank"
            rel="noopener"
          >
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about {
  position: relative;
  padding: 48px 0 72px;
}

.container {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 24px;
}

.hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 32px;
  align-items: center;
  min-height: 360px;
  padding: 40px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 8px;
  background:
    radial-gradient(circle at 84% 18%, rgba(255, 255, 255, 0.76), transparent 28%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.72), rgba(224, 242, 254, 0.56));
  box-shadow: 0 24px 60px rgba(14, 165, 233, 0.14);
}

.hero::before,
.hero::after {
  content: '';
  position: absolute;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.82);
  box-shadow:
    42px -18px 0 10px rgba(255, 255, 255, 0.7),
    92px 0 0 18px rgba(255, 255, 255, 0.56),
    144px -10px 0 3px rgba(255, 255, 255, 0.58);
  opacity: 0.62;
  pointer-events: none;
}

.hero::before {
  right: -80px;
  top: 62px;
  width: 150px;
  height: 48px;
  animation: heroCloud 18s ease-in-out infinite;
}

.hero::after {
  left: 42px;
  bottom: 34px;
  width: 120px;
  height: 36px;
  opacity: 0.38;
  animation: heroCloud 22s ease-in-out infinite reverse;
}

.hero-copy,
.hero-profile {
  position: relative;
  z-index: 1;
}

.eyebrow,
.section-kicker {
  margin: 0;
  color: var(--color-primary-dark);
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0;
}

.name {
  margin: 10px 0 6px;
  color: var(--text-primary);
  font-size: clamp(38px, 7vw, 72px);
  font-weight: 700;
  line-height: 1;
}

.headline {
  margin: 0 0 18px;
  color: #075985;
  font-size: 20px;
  font-weight: 600;
}

.summary {
  max-width: 700px;
  margin: 0;
  color: var(--text-body);
  font-size: 16px;
  line-height: 1.9;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0 18px;
  border: 1px solid rgba(14, 165, 233, 0.28);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.64);
  color: var(--color-primary-dark);
  font-size: 14px;
  font-weight: 600;
  transition: all 0.22s ease;
}

.btn:hover {
  transform: translateY(-2px);
  border-color: rgba(14, 165, 233, 0.5);
  box-shadow: 0 12px 28px rgba(14, 165, 233, 0.16);
}

.btn--primary {
  background: linear-gradient(135deg, var(--color-primary), #38bdf8);
  color: #ffffff;
  border-color: transparent;
}

.hero-profile {
  justify-self: center;
  display: grid;
  justify-items: center;
  gap: 18px;
}

.avatar-wrap {
  position: relative;
  display: grid;
  place-items: center;
  width: 152px;
  height: 152px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.95) 0 52%,
    rgba(186, 230, 253, 0.65) 53% 100%
  );
  box-shadow: 0 18px 42px rgba(14, 165, 233, 0.2);
  animation: avatarFloat 5s ease-in-out infinite;
}

.avatar-wrap::after {
  content: '';
  position: absolute;
  inset: -14px;
  border-radius: inherit;
  border: 1px solid rgba(255, 255, 255, 0.8);
  opacity: 0.78;
}

.avatar {
  width: 112px;
  height: 112px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.9);
  background: #ffffff;
}

.profile-lines {
  display: grid;
  gap: 6px;
  max-width: 260px;
  padding: 18px;
  border: 1px solid rgba(14, 165, 233, 0.16);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.62);
  text-align: center;
}

.profile-lines span {
  color: var(--text-secondary);
  font-size: 13px;
}

.profile-lines strong {
  color: var(--text-primary);
  font-size: 16px;
}

.profile-lines small {
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.6;
}

.stats,
.intro-grid,
.detail-grid {
  display: grid;
  gap: 16px;
}

.stats {
  grid-template-columns: repeat(4, 1fr);
  margin: 18px 0 36px;
}

.stat-card,
.intro-panel,
.now-panel,
.skill-card,
.project-card,
.case-card,
.timeline,
.detail-panel,
.contact-band {
  border: 1px solid rgba(14, 165, 233, 0.16);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.74);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 12px 34px rgba(14, 165, 233, 0.08);
}

.stat-card {
  display: grid;
  gap: 2px;
  padding: 18px;
}

.stat-card strong {
  color: var(--color-primary-dark);
  font-family: 'JetBrains Mono', monospace;
  font-size: 28px;
  line-height: 1.1;
}

.stat-card span {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
}

.stat-card small {
  color: var(--text-muted);
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
}

.intro-grid {
  grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
  margin-bottom: 44px;
}

.intro-panel,
.now-panel,
.detail-panel,
.contact-band {
  padding: 24px;
}

.intro-panel h2,
.now-panel h2,
.section-head h2,
.detail-panel h2,
.contact-band h2 {
  margin: 6px 0 0;
  color: var(--text-primary);
  font-size: 24px;
  font-weight: 700;
  line-height: 1.35;
}

.intro-panel p:last-child,
.now-panel p:last-child {
  margin: 14px 0 0;
  color: var(--text-secondary);
  line-height: 1.85;
}

.now-panel {
  position: relative;
  overflow: hidden;
}

.now-panel::after {
  content: '';
  position: absolute;
  right: -48px;
  bottom: -34px;
  width: 160px;
  height: 54px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.68);
  box-shadow:
    -42px -12px 0 0 rgba(255, 255, 255, 0.46),
    34px -16px 0 8px rgba(255, 255, 255, 0.5);
}

.pulse {
  position: absolute;
  top: 22px;
  right: 22px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-cyan);
  box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.34);
  animation: pulse 1.7s ease-in-out infinite;
}

.section {
  margin-bottom: 44px;
}

.section-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(14, 165, 233, 0.16);
  padding-bottom: 12px;
}

.highlight-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.highlight-item {
  min-height: 72px;
  padding: 18px 20px;
  border: 1px solid rgba(14, 165, 233, 0.16);
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.82), rgba(224, 242, 254, 0.48));
  color: var(--text-primary);
  font-weight: 600;
  line-height: 1.65;
}

.skill-grid,
.project-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.skill-card {
  padding: 20px;
  transition: all 0.22s ease;
}

.skill-card:hover,
.project-card:hover,
.case-card:hover {
  transform: translateY(-4px);
  border-color: rgba(14, 165, 233, 0.34);
  box-shadow: 0 18px 42px rgba(14, 165, 233, 0.14);
}

.skill-icon {
  color: var(--color-primary);
  font-size: 18px;
}

.skill-card h3 {
  margin: 10px 0 12px;
  color: var(--text-primary);
  font-size: 17px;
  font-weight: 700;
}

.skill-tags,
.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tags span,
.project-tags span {
  padding: 4px 8px;
  border: 1px solid rgba(14, 165, 233, 0.18);
  border-radius: 6px;
  background: rgba(240, 249, 255, 0.76);
  color: var(--text-secondary);
  font-size: 12px;
}

.project-card {
  display: block;
  overflow: hidden;
  text-decoration: none;
  transition: all 0.22s ease;
}

.cover {
  display: block;
  width: 100%;
  height: 150px;
  object-fit: cover;
  background: #e0f2fe;
  border-bottom: 1px solid rgba(14, 165, 233, 0.14);
}

.project-body {
  padding: 18px;
}

.project-title-row {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.project-title-row h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 17px;
  font-weight: 700;
  line-height: 1.35;
}

.project-status {
  flex-shrink: 0;
  padding: 2px 7px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
}

.status--已上线,
.status--进行中 {
  background: rgba(14, 165, 233, 0.12);
  color: var(--color-primary-dark);
}

.status--已归档 {
  background: rgba(148, 163, 184, 0.16);
  color: var(--text-muted);
}

.project-body p {
  margin: 0 0 14px;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.65;
}

.project-body small {
  display: inline-block;
  margin-top: 12px;
  color: var(--text-muted);
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
}

.case-list {
  display: grid;
  gap: 14px;
}

.case-card {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 22px;
  padding: 22px;
  transition: all 0.22s ease;
}

.case-meta {
  display: grid;
  align-content: start;
  gap: 8px;
}

.case-meta span {
  color: var(--color-primary-dark);
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
}

.case-meta strong {
  color: var(--text-primary);
  font-size: 14px;
}

.case-content h3,
.timeline-item h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 700;
}

.case-content p,
.timeline-item p {
  margin: 10px 0;
  color: var(--text-secondary);
  line-height: 1.75;
}

.case-content ul {
  display: grid;
  gap: 8px;
  margin: 0;
  padding-left: 18px;
  color: var(--text-body);
}

.case-content li::marker {
  color: var(--color-primary);
}

.timeline {
  position: relative;
  display: grid;
  gap: 0;
  padding: 8px 24px;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 34px;
  bottom: 34px;
  left: 32px;
  width: 2px;
  background: linear-gradient(180deg, var(--color-primary), rgba(14, 165, 233, 0));
}

.timeline-item {
  position: relative;
  display: grid;
  grid-template-columns: 148px minmax(0, 1fr);
  gap: 22px;
  padding: 20px 0 20px 34px;
}

.timeline-point {
  position: absolute;
  left: 4px;
  top: 28px;
  width: 11px;
  height: 11px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  background: var(--color-primary);
  box-shadow: 0 0 0 6px rgba(14, 165, 233, 0.12);
  transition: all 0.2s ease;
}

.timeline-item:hover .timeline-point {
  transform: scale(1.2);
  box-shadow: 0 0 0 9px rgba(14, 165, 233, 0.16);
}

.timeline-item time {
  color: var(--color-primary-dark);
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
}

.detail-grid {
  grid-template-columns: 0.85fr 1.15fr;
  margin-bottom: 44px;
}

.education-list,
.trait-list {
  display: grid;
  gap: 14px;
  margin-top: 18px;
}

.education-list div,
.trait-list div {
  display: grid;
  gap: 4px;
  padding-top: 14px;
  border-top: 1px solid rgba(14, 165, 233, 0.12);
}

.education-list strong,
.trait-list strong {
  color: var(--text-primary);
  font-size: 15px;
}

.education-list span,
.trait-list span {
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.7;
}

.contact-band {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(320px, 1fr);
  gap: 24px;
  align-items: center;
  overflow: hidden;
  background:
    radial-gradient(circle at 92% 20%, rgba(255, 255, 255, 0.7), transparent 28%),
    linear-gradient(135deg, rgba(224, 242, 254, 0.78), rgba(255, 255, 255, 0.78));
}

.contacts {
  display: grid;
  gap: 10px;
}

.contact-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 14px;
  border: 1px solid rgba(14, 165, 233, 0.16);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.66);
  transition: all 0.2s ease;
}

.contact-link:hover {
  transform: translateX(3px);
  border-color: rgba(14, 165, 233, 0.38);
  background: rgba(255, 255, 255, 0.9);
}

.contact-link span {
  color: var(--text-muted);
  font-size: 13px;
}

.contact-link strong {
  color: var(--text-primary);
  font-size: 14px;
  text-align: right;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.34);
  }
  50% {
    transform: scale(1.12);
    box-shadow: 0 0 0 10px rgba(6, 182, 212, 0);
  }
}

@keyframes avatarFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes heroCloud {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(16px, -6px, 0);
  }
}

@media (max-width: 980px) {
  .hero,
  .intro-grid,
  .detail-grid,
  .contact-band {
    grid-template-columns: 1fr;
  }

  .hero-profile {
    justify-self: start;
  }

  .stats,
  .skill-grid,
  .project-grid,
  .highlight-list {
    grid-template-columns: repeat(2, 1fr);
  }

  .case-card {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .about {
    padding: 24px 0 48px;
  }

  .container {
    padding: 0 16px;
  }

  .hero {
    padding: 26px 20px;
    border-radius: 8px;
  }

  .stats,
  .skill-grid,
  .project-grid,
  .highlight-list {
    grid-template-columns: 1fr;
  }

  .section-head {
    display: block;
  }

  .timeline {
    padding: 8px 18px;
  }

  .timeline::before {
    left: 26px;
  }

  .timeline-item {
    grid-template-columns: 1fr;
    gap: 8px;
    padding-left: 30px;
  }

  .timeline-point {
    left: 3px;
  }

  .contact-link {
    display: grid;
    justify-content: stretch;
  }

  .contact-link strong {
    text-align: left;
    overflow-wrap: anywhere;
  }
}
</style>
