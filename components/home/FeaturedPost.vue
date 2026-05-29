<script setup lang="ts">
import type { PostMeta } from '~/types/post'

const props = defineProps<{ post: (PostMeta & { path: string }) | null }>()

function openPost() {
  if (props.post) return navigateTo(props.post.path)
}
</script>

<template>
  <article
    v-if="post"
    class="featured glass-card glass-card--highlight"
    role="link"
    tabindex="0"
    @click="openPost"
    @keydown.enter.prevent="openPost"
    @keydown.space.prevent="openPost"
  >
    <span class="bar" aria-hidden="true" />
    <div class="body">
      <span class="badge">FEATURED</span>
      <h2 class="title">{{ post.title }}</h2>
      <p class="desc">{{ post.description }}</p>
      <div class="meta">
        <time class="date">{{ formatDate(post.date) }}</time>
        <span class="dot">·</span>
        <span class="category">{{ post.category }}</span>
        <div class="tags">
          <TagPill
            v-for="t in post.tags.slice(0, 4)"
            :key="t"
            :label="t"
            :category="post.category"
            size="md"
            :href="`/tags/${encodeURIComponent(t)}`"
          />
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.featured {
  position: relative;
  display: block;
  overflow: hidden;
  background: var(--bg-featured);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-featured);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(14, 165, 233, 0.08);
  transition: all 0.25s ease;
  text-decoration: none;
  cursor: pointer;
}
.featured:hover {
  border-color: rgba(14, 165, 233, 0.5);
  box-shadow: 0 12px 40px rgba(14, 165, 233, 0.14), 0 0 32px rgba(14, 165, 233, 0.15);
  transform: translateY(-2px);
}
.bar {
  display: block;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary), #06b6d4);
  transition: height 0.2s ease;
}
.featured:hover .bar {
  height: 4px;
}
.body {
  padding: 24px;
}
.badge {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 2px;
  color: var(--color-primary);
  margin-bottom: 12px;
}
.title {
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
  margin: 0 0 10px;
}
.desc {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 16px;
}
.meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.date {
  color: var(--text-muted);
  font-size: 12px;
  font-family: 'JetBrains Mono', monospace;
}
.dot {
  color: var(--text-muted);
}
.category {
  color: var(--color-primary);
  font-size: 12px;
}
.tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
</style>
