<script setup lang="ts">
import type { PostMeta } from '~/types/post'
const props = defineProps<{ post: PostMeta & { path: string } }>()

function openPost() {
  return navigateTo(props.post.path)
}
</script>

<template>
  <article
    class="post-card glass-card"
    role="link"
    tabindex="0"
    @click="openPost"
    @keydown.enter.prevent="openPost"
    @keydown.space.prevent="openPost"
  >
    <span class="bar" aria-hidden="true" />
    <div class="content">
      <h3 class="title">{{ post.title }}</h3>
      <p class="desc">{{ post.description }}</p>
      <div class="meta">
        <time class="date">{{ formatDate(post.date, 'list') }}</time>
        <span class="category">{{ post.category }}</span>
        <div class="tags">
          <TagPill
            v-for="t in post.tags.slice(0, 3)"
            :key="t"
            :label="t"
            :category="post.category"
            :href="`/tags/${encodeURIComponent(t)}`"
          />
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.post-card {
  position: relative;
  display: block;
  overflow: hidden;
  transition: all 0.2s ease;
  text-decoration: none;
  cursor: pointer;
}
.post-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--bg-card);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--border-featured);
  border-radius: 8px;
  transition: all 0.2s ease;
  z-index: 0;
}
.post-card:hover::before {
  background: var(--bg-card-strong);
  border-color: rgba(14, 165, 233, 0.5);
  box-shadow: 0 12px 40px rgba(14, 165, 233, 0.14), 0 0 32px rgba(14, 165, 233, 0.15);
}
.post-card:hover {
  transform: translateY(-2px);
}
.bar {
  display: block;
  position: relative;
  z-index: 1;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary), #06b6d4);
  transition: height 0.2s ease;
}
.post-card:hover .bar {
  height: 4px;
}
.content {
  position: relative;
  z-index: 1;
  flex: 1;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}
.title {
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 500;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.desc {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 4px;
}
.date {
  color: var(--text-muted);
  font-size: 12px;
  font-family: 'JetBrains Mono', monospace;
}
.category {
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 500;
}
.tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
@media (max-width: 768px) {
  .desc {
    display: none;
  }
}
</style>
