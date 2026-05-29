import { siteConfig } from '~/app/config/site'

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export default defineEventHandler(async (event) => {
  const cfg = useRuntimeConfig().public
  const baseUrl = cfg.siteUrl || siteConfig.url

  const posts = await queryCollection(event, 'posts')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .limit(20)
    .all()

  setResponseHeader(event, 'Content-Type', 'application/rss+xml')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>${siteConfig.defaultLocale}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${posts
  .map(
    (p: any) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${baseUrl}${p.path}</link>
      <description><![CDATA[${p.description}]]></description>
      <category>${escapeXml(p.category)}</category>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <guid isPermaLink="true">${baseUrl}${p.path}</guid>
    </item>`,
  )
  .join('\n')}
  </channel>
</rss>`
})
