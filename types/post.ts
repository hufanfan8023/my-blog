export type Category =
  | '技术深度'
  | '项目实战'
  | '学习笔记'
  | '想法碎片'
  | 'vibe coding'

export interface PostMeta {
  title: string
  date: string
  category: Category
  tags: string[]
  description: string
  featured?: boolean
  draft?: boolean
}

export interface Post extends PostMeta {
  slug: string
  path: string
  body?: unknown
  readingTime?: number
}

export const CATEGORY_COLOR_MAP: Record<Category, string> = {
  技术深度: '#0ea5e9',
  项目实战: '#0284c7',
  学习笔记: '#06b6d4',
  想法碎片: '#f59e0b',
  'vibe coding': '#a855f7',
}

export const CATEGORY_TEXT_MAP: Record<Category, string> = {
  技术深度: '#0284c7',
  项目实战: '#0369a1',
  学习笔记: '#0891b2',
  想法碎片: '#d97706',
  'vibe coding': '#9333ea',
}

export const CATEGORY_GROUP_MAP: Record<Category, string> = {
  技术深度: '技术/项目',
  项目实战: '技术/项目',
  学习笔记: '笔记',
  想法碎片: '碎片',
  'vibe coding': '碎片',
}

export interface PostStats {
  totalPosts: number
  totalTags: number
  totalMonths: number
}

export interface ArchiveMonth {
  yearMonth: string
  count: number
}

export type PostMetaWithRoute = PostMeta & { slug: string; path: string }

export interface AdjacentPosts {
  prev: PostMetaWithRoute | null
  next: PostMetaWithRoute | null
}

export interface TagWithCount {
  tag: string
  count: number
}
