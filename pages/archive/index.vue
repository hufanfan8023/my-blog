<script setup lang="ts">
const allPosts = await useAllPosts()

const grouped = computed(() => {
  const map = new Map<string, typeof allPosts.value>()
  for (const p of allPosts.value || []) {
    const ym = p.date.slice(0, 7)
    if (!map.has(ym)) map.set(ym, [])
    map.get(ym)!.push(p)
  }
  return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]))
})

useSeoMeta({
  title: '归档',
  description: '所有文章按时间归档',
})
</script>

<template>
  <div class="archive">
    <div class="container">
      <h1 class="title">归档</h1>
      <div v-if="grouped.length" class="groups">
        <section v-for="[ym, ps] in grouped" :key="ym" class="group">
          <h2 class="group-title">
            <NuxtLink :to="`/archive/${ym}`">{{ ym }}</NuxtLink>
            <span class="cnt">{{ ps?.length }} 篇</span>
          </h2>
          <ul class="list">
            <li v-for="p in ps" :key="p.slug" class="row">
              <time class="date">{{ formatDate(p.date, 'list') }}</time>
              <NuxtLink :to="p.path" class="post-title">{{ p.title }}</NuxtLink>
            </li>
          </ul>
        </section>
      </div>
      <div v-else class="empty">还没有文章</div>
    </div>
  </div>
</template>

<style scoped>
.archive {
  padding: 40px 0 56px;
}
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 28px;
  border: 1px solid rgba(14, 165, 233, 0.16);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 18px 46px rgba(14, 165, 233, 0.1);
}
.title {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 24px;
}
.groups {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.group-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 18px;
  font-weight: 500;
  color: var(--color-primary);
  margin: 0 0 12px;
  display: flex;
  align-items: baseline;
  gap: 12px;
  border-bottom: 1px solid var(--border-subtle);
  padding-bottom: 8px;
}
.group-title a {
  color: inherit;
}
.cnt {
  font-size: 12px;
  color: var(--text-muted);
}
.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.row {
  display: flex;
  gap: 16px;
  align-items: baseline;
  padding: 10px 12px;
  border-radius: 8px;
  transition: background 0.2s ease;
}
.row:hover {
  background: rgba(224, 242, 254, 0.52);
}
.date {
  flex-shrink: 0;
  width: 56px;
  color: var(--text-muted);
  font-size: 12px;
  font-family: 'JetBrains Mono', monospace;
}
.post-title {
  color: var(--text-secondary);
  transition: color 0.2s ease;
  font-size: 14px;
}
.post-title:hover {
  color: var(--text-primary);
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
