<script setup lang="ts">
import type { PostMeta, Category } from '~/types/post'
import { CATEGORY_COLOR_MAP } from '~/types/post'

const props = defineProps<{
  title: string
  date: string
  category: Category
  tags: string[]
  readingTime?: number
  wordCount?: number
}>()

const accent = computed(() => CATEGORY_COLOR_MAP[props.category] || '#0ea5e9')
</script>

<template>
  <header class="post-header">
    <NuxtLink to="/" class="back" aria-label="返回首页">← 返回</NuxtLink>
    <h1 class="title">{{ title }}</h1>
    <div class="meta">
      <time class="date">{{ formatDate(date, 'long') }}</time>
      <span class="dot">·</span>
      <span class="cat" :style="{ color: accent }">{{ category }}</span>
      <span v-if="readingTime" class="dot">·</span>
      <span v-if="readingTime" class="rt">{{ readingTime }} 分钟阅读</span>
      <span v-if="wordCount" class="dot">·</span>
      <span v-if="wordCount" class="rt">{{ wordCount }} 字</span>
    </div>
    <div class="tags">
      <TagPill
        v-for="t in tags"
        :key="t"
        :label="t"
        :category="category"
        :href="`/tags/${encodeURIComponent(t)}`"
      />
    </div>
  </header>
</template>

<style scoped>
.post-header {
  margin-bottom: 30px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(14, 165, 233, 0.14);
}
.back {
  display: inline-block;
  color: var(--text-secondary);
  font-size: 13px;
  font-family: 'JetBrains Mono', monospace;
  margin-bottom: 22px;
  transition: color 0.2s ease;
}
.back:hover {
  color: var(--color-primary);
}
.title {
  font-size: 32px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.3;
  margin: 0 0 16px;
  letter-spacing: 0;
}
.meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
  font-size: 13px;
}
.date,
.rt {
  color: var(--text-secondary);
  font-family: 'JetBrains Mono', monospace;
}
.dot {
  color: var(--text-muted);
}
.cat {
  font-weight: 500;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
@media (max-width: 768px) {
  .title {
    font-size: 24px;
  }
}
</style>
