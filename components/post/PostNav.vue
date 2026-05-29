<script setup lang="ts">
import type { AdjacentPosts } from '~/types/post'

defineProps<{ adjacent: AdjacentPosts }>()
</script>

<template>
  <nav class="post-nav" aria-label="文章导航">
    <NuxtLink
      v-if="adjacent.prev"
      :to="`/posts/${adjacent.prev.slug}`"
      class="link link--prev"
    >
      <span class="hint">← 上一篇</span>
      <span class="title">{{ adjacent.prev.title }}</span>
    </NuxtLink>
    <span v-else />
    <NuxtLink
      v-if="adjacent.next"
      :to="`/posts/${adjacent.next.slug}`"
      class="link link--next"
    >
      <span class="hint">下一篇 →</span>
      <span class="title">{{ adjacent.next.title }}</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.post-nav {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 32px 0;
}
.link {
  padding: 14px 16px;
  border: 1px solid var(--border-card);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.76);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: all 0.2s ease;
}
.link:hover {
  border-color: rgba(14, 165, 233, 0.3);
  box-shadow: 0 12px 28px rgba(14, 165, 233, 0.12);
  transform: translateY(-2px);
}
.link--next {
  text-align: right;
  align-items: flex-end;
}
.hint {
  color: var(--text-muted);
  font-size: 12px;
  font-family: 'JetBrains Mono', monospace;
}
.title {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
@media (max-width: 600px) {
  .post-nav {
    grid-template-columns: 1fr;
  }
  .link--next {
    text-align: left;
    align-items: flex-start;
  }
}
</style>
