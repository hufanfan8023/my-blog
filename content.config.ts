import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    posts: defineCollection({
      type: 'page',
      source: 'posts/*.md',
      schema: z.object({
        title: z.string().min(1).max(60),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        category: z.enum([
          '技术深度',
          '项目实战',
          '学习笔记',
          '想法碎片',
          'vibe coding',
        ]),
        tags: z.array(z.string()).min(1).max(8),
        description: z.string().min(20).max(160),
        featured: z.boolean().default(false),
        draft: z.boolean().default(false),
      }),
    }),
  },
})
