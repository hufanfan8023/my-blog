<script setup lang="ts">
const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const { data: post } = await useAsyncData(`post:${slug.value}`, () =>
  queryCollection('posts').path(`/posts/${slug.value}`).first(),
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: '文章不存在', fatal: true })
}

const allPosts = await useAllPosts()
const adjacent = useAdjacentPosts(allPosts, slug.value)
const related = useRelatedPosts(allPosts, slug.value, post.value!.tags || [], 3)

const wordCount = computed(() => calcWordCount(post.value?.body))
const readingTime = computed(() => calcReadingTime(post.value?.body))

const tocLinks = computed<any[]>(() => (post.value as any)?.body?.toc?.links || [])

useSeoMeta({
  title: post.value!.title,
  ogTitle: post.value!.title,
  description: post.value!.description,
  ogDescription: post.value!.description,
  ogType: 'article',
  articlePublishedTime: post.value!.date,
  articleTag: (post.value!.tags || []).join(','),
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.value!.title,
        description: post.value!.description,
        datePublished: post.value!.date,
        keywords: (post.value!.tags || []).join(','),
      }),
    },
  ],
})
</script>

<template>
  <div v-if="post" class="post-page">
    <ReadingProgress />
    <BackToTop />
    <CopyButton :key="slug" />

    <div class="container">
      <div class="layout">
        <article class="article">
          <PostHeader
            :title="post.title"
            :date="post.date"
            :category="post.category"
            :tags="post.tags || []"
            :reading-time="readingTime"
            :word-count="wordCount"
          />
          <div class="prose-blog">
            <ContentRenderer :value="post" />
          </div>
          <PostNav v-if="adjacent" :adjacent="adjacent" />
          <RelatedPosts :posts="related || []" />
        </article>

        <PostToc v-if="tocLinks.length" :links="tocLinks" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-page {
  padding: 40px 0 56px;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
.layout {
  display: grid;
  grid-template-columns: minmax(0, 780px) 240px;
  justify-content: center;
  gap: 36px;
  align-items: start;
}
.article {
  width: 100%;
  padding: 34px 42px;
  border: 1px solid rgba(14, 165, 233, 0.16);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 18px 46px rgba(14, 165, 233, 0.12);
}
@media (max-width: 1280px) {
  .layout {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (max-width: 768px) {
  .post-page {
    padding: 16px 0 32px;
  }
  .container {
    padding: 0 16px;
  }
  .article {
    padding: 22px 18px;
  }
}
</style>
