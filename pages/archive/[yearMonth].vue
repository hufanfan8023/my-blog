<script setup lang="ts">
const route = useRoute()
const ym = computed(() => String(route.params.yearMonth || ''))

const allPosts = await useAllPosts()
const posts = usePostsByMonth(allPosts, ym.value)

useSeoMeta({
  title: `归档: ${ym.value}`,
  description: `${ym.value} 的文章归档`,
})
</script>

<template>
  <div class="archive-month">
    <div class="container">
      <NuxtLink to="/archive" class="back">← 全部归档</NuxtLink>
      <h1 class="title">{{ ym }} <span class="cnt">{{ posts?.length || 0 }} 篇</span></h1>
      <div v-if="posts?.length" class="list">
        <PostCard v-for="p in posts" :key="p.slug" :post="p" />
      </div>
      <div v-else class="empty">该月份暂无文章</div>
    </div>
  </div>
</template>

<style scoped>
.archive-month {
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
}
.back:hover {
  color: var(--color-primary);
}
.title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 26px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 24px;
  display: flex;
  align-items: baseline;
  gap: 12px;
}
.cnt {
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 400;
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
@media (max-width: 768px) {
  .container {
    margin: 0 16px;
    padding: 22px 18px;
  }
}
</style>
