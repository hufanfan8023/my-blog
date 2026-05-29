<script setup lang="ts">
import { siteConfig } from '~/app/config/site'

const allPosts = await useAllPosts()
const featured = useFeaturedPost(allPosts)
const stats = usePostStats(allPosts)
const hot = useHotPosts(allPosts, 5)
const archive = useArchiveMonths(allPosts)

const showSidebarExtra = computed(() => (allPosts.value?.length || 0) >= 8)

useSeoMeta({
  title: siteConfig.name,
  ogTitle: siteConfig.name,
  description: siteConfig.description,
  ogDescription: siteConfig.description,
  ogType: 'website',
})
</script>

<template>
  <div class="home">
    <div class="container">
      <div class="layout">
        <main class="main">
          <FeaturedPost v-if="featured" :post="featured" />
          <PostList :posts="allPosts || []" />
        </main>
        <aside class="sidebar">
          <ProfileCard />
          <NowPlaying />
          <TechStack />
          <HotPosts v-if="showSidebarExtra" :posts="hot || []" />
          <ArchiveTimeline :months="archive || []" />
          <StatsBar v-if="showSidebarExtra && stats" :stats="stats" />
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: 32px 0;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
.layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 32px;
}
.main {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
@media (max-width: 1024px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .sidebar {
    margin-top: 16px;
  }
}
@media (max-width: 768px) {
  .home {
    padding: 16px 0;
  }
  .container {
    padding: 0 16px;
  }
}
</style>
