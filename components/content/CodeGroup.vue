<script setup lang="ts">
const tabs = ref<{ label: string; index: number }[]>([])
const active = ref(0)
const root = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!root.value) return
  const blocks = Array.from(root.value.querySelectorAll<HTMLElement>(':scope > pre'))
  tabs.value = blocks.map((b, i) => {
    const filename = b.getAttribute('filename')
    const lang = b.getAttribute('language') || b.dataset.language || `代码 ${i + 1}`
    return { label: filename || lang, index: i }
  })
  blocks.forEach((b, i) => {
    b.style.display = i === 0 ? 'block' : 'none'
  })
})

watch(active, (newIdx) => {
  if (!root.value) return
  const blocks = root.value.querySelectorAll<HTMLElement>(':scope > pre')
  blocks.forEach((b, i) => {
    b.style.display = i === newIdx ? 'block' : 'none'
  })
})
</script>

<template>
  <div class="code-group">
    <div v-if="tabs.length" class="tabs" role="tablist">
      <button
        v-for="t in tabs"
        :key="t.index"
        role="tab"
        :aria-selected="t.index === active"
        class="tab"
        :class="{ 'tab--active': t.index === active }"
        @click="active = t.index"
      >
        {{ t.label }}
      </button>
    </div>
    <div ref="root" class="content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.code-group {
  margin: 1.4em 0;
  border: 1px solid var(--border-card);
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-code);
}
.tabs {
  display: flex;
  gap: 0;
  padding: 0 8px;
  background: rgba(14, 165, 233, 0.06);
  border-bottom: 1px solid var(--border-card);
  overflow-x: auto;
}
.tab {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  background: none;
  border: none;
  color: var(--text-muted);
  padding: 10px 14px;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  white-space: nowrap;
}
.tab:hover {
  color: var(--text-secondary);
}
.tab--active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}
.content :deep(pre) {
  margin: 0 !important;
  border: none !important;
  border-radius: 0 !important;
}
</style>
