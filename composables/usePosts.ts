import type { PostMeta, PostMetaWithRoute, ArchiveMonth, PostStats, TagWithCount, AdjacentPosts } from '~/types/post'

function toMeta(p: any): PostMetaWithRoute {
  const slug: string = (p.path || p.id || '').replace(/^\/?(content\/)?posts\//, '').replace(/\.md$/, '')
  return {
    title: p.title,
    date: p.date,
    category: p.category,
    tags: p.tags || [],
    description: p.description,
    featured: !!p.featured,
    draft: !!p.draft,
    slug,
    path: p.path?.startsWith('/posts/') ? p.path : `/posts/${slug}`,
  }
}

export async function useAllPosts() {
  const { data } = await useAsyncData('posts:all', async () => {
    const list = await queryCollection('posts')
      .where('draft', '=', false)
      .order('date', 'DESC')
      .all()
    return list.map(toMeta)
  })
  return data
}

export function useFeaturedPost(all: Ref<PostMetaWithRoute[] | null>) {
  return computed(() => all.value?.find((p) => p.featured) || all.value?.[0] || null)
}

export async function usePostBySlug(slug: string) {
  const { data } = await useAsyncData(`post:${slug}`, () =>
    queryCollection('posts').path(`/posts/${slug}`).first(),
  )
  return data
}

export function useAllTags(all: Ref<PostMetaWithRoute[] | null>) {
  return computed<TagWithCount[]>(() => {
    const map = new Map<string, number>()
    for (const p of all.value || []) {
      for (const t of p.tags) map.set(t, (map.get(t) || 0) + 1)
    }
    return [...map.entries()]
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
  })
}

export function usePostsByTag(all: Ref<PostMetaWithRoute[] | null>, tag: string) {
  return computed(() => (all.value || []).filter((p) => p.tags.includes(tag)))
}

export function useAdjacentPosts(all: Ref<PostMetaWithRoute[] | null>, slug: string) {
  return computed<AdjacentPosts>(() => {
    const list = all.value || []
    const idx = list.findIndex((p) => p.slug === slug)
    if (idx === -1) return { prev: null, next: null }
    return {
      prev: list[idx + 1] || null,
      next: list[idx - 1] || null,
    }
  })
}

export function usePostStats(all: Ref<PostMetaWithRoute[] | null>) {
  return computed<PostStats>(() => {
    const list = all.value || []
    const tags = new Set<string>()
    const months = new Set<string>()
    for (const p of list) {
      months.add(p.date.slice(0, 7))
      for (const t of p.tags) tags.add(t)
    }
    return {
      totalPosts: list.length,
      totalTags: tags.size,
      totalMonths: months.size,
    }
  })
}

export function useArchiveMonths(all: Ref<PostMetaWithRoute[] | null>) {
  return computed<ArchiveMonth[]>(() => {
    const map = new Map<string, number>()
    for (const p of all.value || []) {
      const ym = p.date.slice(0, 7)
      map.set(ym, (map.get(ym) || 0) + 1)
    }
    return [...map.entries()]
      .map(([yearMonth, count]) => ({ yearMonth, count }))
      .sort((a, b) => b.yearMonth.localeCompare(a.yearMonth))
  })
}

export function usePostsByMonth(all: Ref<PostMetaWithRoute[] | null>, yearMonth: string) {
  return computed(() => (all.value || []).filter((p) => p.date.startsWith(yearMonth)))
}

export function useHotPosts(all: Ref<PostMetaWithRoute[] | null>, limit = 5) {
  return computed(() => {
    return [...(all.value || [])]
      .sort((a, b) => (b.tags.length - a.tags.length) || (a.date < b.date ? 1 : -1))
      .slice(0, limit)
  })
}

export function useRelatedPosts(
  all: Ref<PostMetaWithRoute[] | null>,
  currentSlug: string,
  currentTags: string[],
  limit = 3,
) {
  return computed(() => {
    const list = (all.value || []).filter((p) => p.slug !== currentSlug)
    const scored = list
      .map((p) => ({
        post: p,
        score: p.tags.filter((t) => currentTags.includes(t)).length,
      }))
      .sort((a, b) => b.score - a.score || (a.post.date < b.post.date ? 1 : -1))
    const top = scored.filter((x) => x.score > 0).slice(0, limit).map((x) => x.post)
    if (top.length === limit) return top
    return scored.slice(0, limit).map((x) => x.post)
  })
}
