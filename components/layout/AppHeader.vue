<script setup lang="ts">
import { siteConfig } from '~/app/config/site'

const route = useRoute()
const mobileOpen = useMobileMenuOpen()

function isActive(href: string) {
  if (href === '/') return route.path === '/'
  return route.path.startsWith(href)
}
</script>

<template>
  <header class="app-header">
    <div class="container">
      <NuxtLink to="/" class="logo" aria-label="返回首页">
        <span class="logo-mark">&gt;_</span>
        <span class="logo-text">{{ siteConfig.name }}</span>
      </NuxtLink>

      <nav class="nav" aria-label="主导航">
        <NuxtLink
          v-for="item in siteConfig.nav"
          :key="item.href"
          :to="item.href"
          class="link"
          :class="{ 'link--active': isActive(item.href) }"
          :aria-current="isActive(item.href) ? 'page' : undefined"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="actions">
        <SearchTrigger class="search" />
        <button
          class="hamburger"
          aria-label="打开导航菜单"
          @click="mobileOpen = true"
        >
          <span /><span /><span />
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: var(--z-nav);
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(125, 211, 252, 0.94), rgba(224, 242, 254, 0.88));
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.62);
  box-shadow: 0 12px 30px rgba(14, 165, 233, 0.12);
}
.header-clouds {
  position: absolute;
  inset: 0 -12%;
  pointer-events: none;
  overflow: hidden;
  opacity: 0.58;
  mask-image: linear-gradient(180deg, #000 0%, #000 78%, transparent 100%);
}
.header-cloud {
  position: absolute;
  top: 4px;
  width: 220px;
  aspect-ratio: 3.35 / 1;
  filter:
    blur(0.12px)
    drop-shadow(0 13px 16px rgba(255, 255, 255, 0.22))
    drop-shadow(0 10px 18px rgba(14, 165, 233, 0.07));
  animation: headerCloudFloat 172s linear infinite;
}
.header-cloud--one {
  left: -210px;
}
.header-cloud--two {
  top: 18px;
  left: 34%;
  width: 170px;
  opacity: 0.64;
  animation-duration: 206s;
  animation-delay: -96s;
}
.cloud-lobe {
  position: absolute;
  border-radius: 999px;
  background:
    radial-gradient(circle at 31% 24%, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.96) 38%, rgba(224, 244, 255, 0.9) 72%, rgba(186, 230, 253, 0.42));
  box-shadow:
    inset 9px 10px 16px rgba(255, 255, 255, 0.82),
    inset -12px -13px 20px rgba(56, 189, 248, 0.12),
    0 10px 18px rgba(14, 165, 233, 0.06);
}
.cloud-lobe--base {
  left: 8%;
  right: 8%;
  bottom: 8%;
  height: 43%;
}
.cloud-lobe--left {
  left: 8%;
  top: 31%;
  width: 32%;
  height: 52%;
}
.cloud-lobe--center {
  left: 29%;
  top: 12%;
  width: 34%;
  height: 72%;
}
.cloud-lobe--crest {
  left: 47%;
  top: 2%;
  width: 29%;
  height: 76%;
}
.cloud-lobe--right {
  right: 6%;
  top: 32%;
  width: 29%;
  height: 50%;
}
.cloud-lobe--shine {
  left: 33%;
  top: 13%;
  width: 30%;
  height: 25%;
  background: rgba(255, 255, 255, 0.62);
  filter: blur(7px);
  box-shadow: none;
}
.container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 24px;
}
.logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-primary);
}
.logo-mark {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-size: 20px;
  background: linear-gradient(135deg, #0369a1, var(--color-primary));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.logo-text {
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-weight: 600;
  font-size: 18px;
}
.nav {
  display: flex;
  gap: 24px;
  flex: 1;
  margin-left: 16px;
}
.link {
  position: relative;
  color: var(--text-secondary);
  font-size: 14px;
  padding: 4px 0;
  transition: color 0.2s ease;
}
.link::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -19px;
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary), #7dd3fc);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.2s ease;
}
.link:hover {
  color: var(--text-primary);
}
.link:hover::after,
.link--active::after {
  transform: scaleX(1);
}
.link--active {
  color: var(--color-primary);
  font-weight: 500;
}
.actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.hamburger {
  display: none;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
  background: rgba(255, 255, 255, 0.48);
  border: 1px solid rgba(14, 165, 233, 0.2);
  border-radius: 8px;
  cursor: pointer;
}
.hamburger span {
  display: block;
  width: 16px;
  height: 1.5px;
  background: var(--text-secondary);
}
@keyframes headerCloudFloat {
  0% {
    transform: translate3d(-12vw, 0, 0);
  }
  100% {
    transform: translate3d(122vw, 0, 0);
  }
}
@media (max-width: 768px) {
  .nav {
    display: none;
  }
  .hamburger {
    display: flex;
  }
  .container {
    gap: 12px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .header-cloud {
    animation: none;
  }
}
</style>
