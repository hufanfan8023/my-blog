<script setup lang="ts">
import type { PostMeta } from '~/types/post'
import { CATEGORY_COLOR_MAP } from '~/types/post'

defineProps<{ posts: (PostMeta & { path: string })[] }>()
</script>

<template>
  <section v-if="posts.length" class="related" aria-labelledby="related-title">
    <h3 id="related-title" class="head">相关文章</h3>
    <div class="grid">
      <NuxtLink
        v-for="p in posts"
        :key="p.slug"
        :to="p.path"
        class="card glass-card"
        :style="{ '--accent': CATEGORY_COLOR_MAP[p.category] }"
      >
        <span class="bar" aria-hidden="true" />
        <div class="body">
          <h4 class="title">{{ p.title }}</h4>
          <p class="desc">{{ p.description }}</p>
          <div class="meta">
            <time class="date">{{ formatDate(p.date, 'list') }}</time>
            <span class="cat">{{ p.category }}</span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.related {
  margin: 48px 0 32px;
}
.head {
  font-size: 18px;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-subtle);
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.card {
  position: relative;
  display: flex;
  background: rgba(255, 255, 255, 0.76);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--border-card);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
  text-decoration: none;
}
.card:hover {
  border-color: rgba(14, 165, 233, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(14, 165, 233, 0.1);
}
.bar {
  width: 3px;
  background: var(--accent);
  flex-shrink: 0;
}
.body {
  padding: 14px 16px;
  flex: 1;
  min-width: 0;
}
.title {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.desc {
  color: var(--text-secondary);
  font-size: 12px;
  margin: 0 0 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.meta {
  display: flex;
  gap: 8px;
  font-size: 11px;
  font-family: 'JetBrains Mono', monospace;
}
.date {
  color: var(--text-muted);
}
.cat {
  color: var(--accent);
}
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
