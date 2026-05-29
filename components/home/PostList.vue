<script setup lang="ts">
import type { PostMeta } from '~/types/post'
import { siteConfig } from '~/app/config/site'

const props = defineProps<{ posts: (PostMeta & { path: string })[] }>()

const visible = ref(siteConfig.postsPerPage)

const visiblePosts = computed(() => props.posts.slice(0, visible.value))
const hasMore = computed(() => visible.value < props.posts.length)

function loadMore() {
  visible.value = Math.min(visible.value + siteConfig.postsPerPage, props.posts.length)
}
</script>

<template>
  <section class="post-list">
    <div class="list">
      <PostCard v-for="p in visiblePosts" :key="p.slug" :post="p" />
    </div>
    <div class="more">
      <button v-if="hasMore" class="btn" @click="loadMore">加载更多</button>
      <span v-else-if="posts.length > siteConfig.postsPerPage" class="end">— 已是全部 —</span>
    </div>
  </section>
</template>

<style scoped>
.post-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.more {
  margin-top: 16px;
  text-align: center;
}
.btn {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  padding: 10px 24px;
  background: rgba(14, 165, 233, 0.08);
  color: var(--color-primary);
  border: 1px solid rgba(14, 165, 233, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn:hover {
  background: rgba(14, 165, 233, 0.15);
  border-color: rgba(14, 165, 233, 0.5);
  box-shadow: 0 0 24px rgba(14, 165, 233, 0.2);
}
.end {
  color: var(--text-muted);
  font-size: 12px;
  font-family: 'JetBrains Mono', monospace;
}
</style>
