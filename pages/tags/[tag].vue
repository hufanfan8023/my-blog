<script setup lang="ts">
const route = useRoute()
const tag = computed(() => decodeURIComponent(String(route.params.tag || '')))

const allPosts = await useAllPosts()
const posts = usePostsByTag(allPosts, tag.value)

useSeoMeta({
  title: `标签: ${tag.value}`,
  description: `「${tag.value}」标签下的文章`,
})
</script>

<template>
  <div class="tag-page">
    <div class="container">
      <NuxtLink to="/tags" class="back">← 全部标签</NuxtLink>
      <h1 class="title">
        <span class="prefix">#</span>{{ tag }}
        <span class="count">{{ posts?.length || 0 }} 篇</span>
      </h1>

      <div v-if="posts?.length" class="list">
        <PostCard v-for="p in posts" :key="p.slug" :post="p" />
      </div>
      <div v-else class="empty">
        该标签下暂无文章
        <NuxtLink to="/" class="link">返回首页</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tag-page {
  padding: 40px 0 56px;
}
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 28px;
  border: 1px solid rgba(14, 165, 233, 0.16);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 18px 46px rgba(14, 165, 233, 0.1);
}
.back {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 24px;
  transition: color 0.2s ease;
}
.back:hover {
  color: var(--color-primary);
}
.title {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 24px;
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
}
.prefix {
  color: var(--color-primary);
  margin-right: 4px;
}
.count {
  font-size: 14px;
  font-weight: 400;
  color: var(--text-muted);
  font-family: 'JetBrains Mono', monospace;
}
.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.empty {
  color: var(--text-secondary);
  text-align: center;
  padding: 48px 0;
}
.link {
  display: block;
  margin-top: 12px;
  color: var(--color-primary);
}
@media (max-width: 768px) {
  .container {
    margin: 0 16px;
    padding: 22px 18px;
  }
}
</style>
