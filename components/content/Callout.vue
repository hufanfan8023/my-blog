<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'info' | 'warning' | 'tip'
  }>(),
  { type: 'info' },
)
</script>

<template>
  <aside class="callout" :class="`callout--${type}`">
    <span class="icon" aria-hidden="true">
      <span v-if="type === 'info'">i</span>
      <span v-else-if="type === 'warning'">!</span>
      <span v-else>✦</span>
    </span>
    <div class="content">
      <slot />
    </div>
  </aside>
</template>

<style scoped>
.callout {
  display: flex;
  gap: 12px;
  padding: 14px 18px;
  margin: 1.4em 0;
  border-radius: 8px;
  border-left: 3px solid var(--accent);
  background: var(--bg);
}
.callout--info {
  --accent: var(--color-primary);
  --bg: rgba(14, 165, 233, 0.08);
}
.callout--warning {
  --accent: #f59e0b;
  --bg: rgba(245, 158, 11, 0.08);
}
.callout--tip {
  --accent: #06b6d4;
  --bg: rgba(6, 182, 212, 0.08);
}
.icon {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--accent);
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
}
.content {
  flex: 1;
  color: var(--text-body);
  line-height: 1.7;
}
.content :deep(p) {
  margin: 0;
}
.content :deep(p + p) {
  margin-top: 0.6em;
}
</style>
