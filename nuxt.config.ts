// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-27',
  devtools: { enabled: true },
  ssr: true,

  modules: ['@nuxt/content', '@nuxtjs/tailwindcss', '@nuxtjs/color-mode', '@vueuse/nuxt'],

  components: [{ path: '~/components', pathPrefix: false }],

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: '',
    storageKey: 'hff-blog-color-mode',
  },

  content: {
    build: {
      markdown: {
        toc: { depth: 3, searchDepth: 3 },
        highlight: {
          theme: {
            default: 'github-dark',
            light: 'github-light',
          },
          langs: [
            'js',
            'ts',
            'jsx',
            'tsx',
            'vue',
            'html',
            'css',
            'json',
            'yaml',
            'bash',
            'shell',
            'md',
            'mdc',
            'sql',
            'go',
            'python',
          ],
        },
      },
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      titleTemplate: '%s · 一只打打打',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#0ea5e9' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        {
          rel: 'alternate',
          type: 'application/rss+xml',
          title: '一只打打打 RSS',
          href: '/rss.xml',
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/sitemap.xml', '/rss.xml'],
    },
  },

  typescript: {
    strict: true,
  },
})
