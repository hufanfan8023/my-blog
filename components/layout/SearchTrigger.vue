<script setup lang="ts">
import { useMagicKeys } from '@vueuse/core'
import { siteConfig } from '~/app/config/site'

const open = useSearchOpen()

function toggle() {
  open.value = !open.value
}

const isMac = ref(false)

onMounted(() => {
  isMac.value = /Mac|iPod|iPhone|iPad/.test(navigator.platform)
  const keys = useMagicKeys({
    passive: false,
    onEventFired(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k' && e.type === 'keydown') {
        e.preventDefault()
        open.value = true
      }
    },
  })
  void keys
})
</script>

<template>
  <button
    class="search-trigger"
    aria-label="打开搜索（快捷键 Ctrl+K）"
    @click="toggle"
  >
    <span class="icon" aria-hidden="true">⌕</span>
    <span class="text">{{ siteConfig.search.placeholder }}</span>
    <kbd class="kbd">{{ isMac ? '⌘' : 'Ctrl' }} K</kbd>
  </button>
</template>

<style scoped>
.search-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 10px 0 12px;
  background: rgba(255, 255, 255, 0.52);
  border: 1px solid rgba(14, 165, 233, 0.2);
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 13px;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s ease;
  min-width: 200px;
}
.search-trigger:hover {
  border-color: rgba(14, 165, 233, 0.42);
  background: rgba(255, 255, 255, 0.82);
  color: var(--text-primary);
  box-shadow: 0 10px 24px rgba(14, 165, 233, 0.12);
}
.icon {
  font-size: 16px;
  color: var(--text-secondary);
}
.text {
  flex: 1;
  text-align: left;
}
.kbd {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  padding: 2px 6px;
  background: rgba(224, 242, 254, 0.74);
  border: 1px solid rgba(14, 165, 233, 0.16);
  border-radius: 4px;
  color: var(--text-muted);
}
@media (max-width: 768px) {
  .search-trigger {
    min-width: auto;
    padding: 0 10px;
  }
  .text,
  .kbd {
    display: none;
  }
}
</style>
