<script setup lang="ts">
import type { PostMeta } from '~/types/post'
import { CATEGORY_COLOR_MAP } from '~/types/post'

defineProps<{ posts: (PostMeta & { path: string })[] }>()
</script>

<template>
  <GlassCard v-if="posts.length" class="card">
    <div class="head">热门文章</div>
    <ul class="list">
      <li v-for="p in posts" :key="p.slug">
        <NuxtLink :to="p.path" class="row">
          <span class="bar" :style="{ background: CATEGORY_COLOR_MAP[p.category] }" />
          <span class="title">{{ p.title }}</span>
        </NuxtLink>
      </li>
    </ul>
  </GlassCard>
</template>

<style scoped>
.card {
  padding: 16px;
}
.head {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.head::before {
  content: '';
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--color-cyan);
  box-shadow: 0 0 8px var(--color-cyan);
}
.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  transition: all 0.2s ease;
}
.bar {
  width: 3px;
  height: 14px;
  border-radius: 2px;
  flex-shrink: 0;
  transition: height 0.2s ease;
}
.title {
  color: var(--text-secondary);
  font-size: 13px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s ease;
}
.row:hover .title {
  color: var(--text-primary);
}
.row:hover .bar {
  height: 18px;
}
</style>
