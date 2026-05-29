import { siteConfig } from '~/app/config/site'

export default defineEventHandler(async (event) => {
  const cfg = useRuntimeConfig().public
  const baseUrl = cfg.siteUrl || siteConfig.url

  const posts = await queryCollection(event, 'posts')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .all()

  const urls = [
    { loc: '/', priority: '1.0' },
    { loc: '/about', priority: '0.8' },
    { loc: '/tags', priority: '0.7' },
    { loc: '/archive', priority: '0.7' },
    ...posts.map((p: any) => ({
      loc: p.path,
      lastmod: p.date,
      priority: '0.9',
    })),
  ]

  setResponseHeader(event, 'Content-Type', 'application/xml')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u: any) =>
      `  <url><loc>${baseUrl}${u.loc}</loc>${
        u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''
      }<priority>${u.priority}</priority></url>`,
  )
  .join('\n')}
</urlset>`
})
