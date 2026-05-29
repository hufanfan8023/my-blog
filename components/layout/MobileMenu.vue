<script setup lang="ts">
import { siteConfig } from '~/app/config/site'

const route = useRoute()
const open = useMobileMenuOpen()

watch(open, (v) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = v ? 'hidden' : ''
})

watch(() => route.path, () => (open.value = false))

function isActive(href: string) {
  if (href === '/') return route.path === '/'
  return route.path.startsWith(href)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div v-if="open" class="overlay" @click="open = false" />
    </Transition>
    <Transition name="slide">
      <aside
        v-if="open"
        class="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="导航菜单"
      >
        <header class="head">
          <span class="title">导航</span>
          <button class="close" aria-label="关闭导航菜单" @click="open = false">×</button>
        </header>
        <nav class="nav">
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
        <footer class="foot">
          <a :href="siteConfig.social.github" target="_blank" rel="noopener" class="social">
            GitHub
          </a>
          <NuxtLink to="/rss.xml" external class="social">RSS</NuxtLink>
        </footer>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(3, 105, 161, 0.18);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  z-index: var(--z-modal-overlay);
}
.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 280px;
  background:
    radial-gradient(ellipse 220px 100px at 80% 8%, rgba(255, 255, 255, 0.72), transparent 70%),
    rgba(240, 249, 255, 0.96);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-left: 1px solid var(--border-card);
  z-index: var(--z-modal);
  display: flex;
  flex-direction: column;
}
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-subtle);
}
.title {
  color: var(--text-primary);
  font-weight: 500;
}
.close {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 24px;
  line-height: 1;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
}
.close:hover {
  color: var(--text-primary);
  background: rgba(14, 165, 233, 0.08);
}
.nav {
  flex: 1;
  padding: 12px 0;
}
.link {
  display: block;
  padding: 12px 20px;
  color: var(--text-secondary);
  font-size: 15px;
  border-left: 2px solid transparent;
  transition: all 0.2s ease;
}
.link:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.58);
}
.link--active {
  color: var(--color-primary);
  border-left-color: var(--color-primary);
  background: rgba(224, 242, 254, 0.72);
}
.foot {
  padding: 16px 20px;
  border-top: 1px solid var(--border-subtle);
  display: flex;
  gap: 16px;
}
.social {
  color: var(--text-secondary);
  font-size: 13px;
  font-family: 'JetBrains Mono', monospace;
}
.social:hover {
  color: var(--color-primary);
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
