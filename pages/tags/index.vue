<script setup lang="ts">
const allPosts = await useAllPosts()
const allTags = useAllTags(allPosts)

const sized = computed(() => {
  if (!allTags.value?.length) return []
  const max = Math.max(...allTags.value.map((t) => t.count))
  return allTags.value.map((t) => {
    const ratio = t.count / max
    const size = ratio > 0.66 ? 'lg' : ratio > 0.33 ? 'md' : 'sm'
    return { ...t, size }
  })
})

useSeoMeta({
  title: '标签',
  description: '所有文章标签的集合',
})
</script>

<template>
  <div class="tags-page">
    <div class="container">
      <h1 class="page-title">标签</h1>
      <div v-if="sized.length" class="cloud">
        <NuxtLink
          v-for="t in sized"
          :key="t.tag"
          :to="`/tags/${encodeURIComponent(t.tag)}`"
          class="tag"
          :class="`tag--${t.size}`"
        >
          {{ t.tag }}
          <span class="count">{{ t.count }}</span>
        </NuxtLink>
      </div>
      <div v-else class="empty">还没有标签</div>
    </div>
  </div>
</template>

<style scoped>
.tags-page {
  padding: 40px 0 56px;
}
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 28px;
  border: 1px solid rgba(14, 165, 233, 0.16);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 18px 46px rgba(14, 165, 233, 0.1);
}
.page-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 24px;
}
.cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 8px;
}
.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid rgba(14, 165, 233, 0.3);
  background: rgba(240, 249, 255, 0.78);
  color: var(--color-primary-dark);
  transition: all 0.2s ease;
}
.tag:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(14, 165, 233, 0.6);
  box-shadow: 0 0 20px rgba(14, 165, 233, 0.15);
}
.tag--sm {
  font-size: 12px;
}
.tag--md {
  font-size: 14px;
}
.tag--lg {
  font-size: 16px;
  font-weight: 500;
}
.count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--text-muted);
}
.empty {
  color: var(--text-secondary);
  text-align: center;
  padding: 48px 0;
}
@media (max-width: 768px) {
  .container {
    margin: 0 16px;
    padding: 22px 18px;
  }
}
</style>
