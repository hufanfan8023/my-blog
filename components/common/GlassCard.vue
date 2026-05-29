<script setup lang="ts">
defineProps<{
  /** 是否使用更强的玻璃感（更不透明） */
  strong?: boolean
  /** 是否带蓝色描边（精选区） */
  highlight?: boolean
  /** 自定义 class */
  as?: keyof HTMLElementTagNameMap
}>()
</script>

<template>
  <component
    :is="as || 'div'"
    class="glass-card"
    :class="{ 'glass-card--strong': strong, 'glass-card--highlight': highlight }"
  >
    <slot />
  </component>
</template>

<style scoped>
.glass-card {
  position: relative;
  background: var(--bg-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-card);
  border-radius: 8px;
  box-shadow: 0 10px 28px rgba(14, 165, 233, 0.08);
}
.glass-card--strong {
  background: var(--bg-card-strong);
}
.glass-card--highlight {
  background: var(--bg-featured);
  border: 1px solid var(--border-featured);
  border-radius: 8px;
  box-shadow: 0 14px 36px rgba(14, 165, 233, 0.12);
}
@supports not (backdrop-filter: blur(12px)) {
  .glass-card {
    background: rgba(255, 255, 255, 0.92);
  }
}
</style>
