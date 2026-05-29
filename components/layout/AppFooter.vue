<script setup lang="ts">
import { siteConfig } from '~/app/config/site'

const year = new Date().getFullYear()
const withBasePath = useBasePath()
</script>

<template>
  <footer class="app-footer">
    <div class="container">
      <div>
        <p class="brand">{{ siteConfig.name }}</p>
        <p class="copyright">
          &copy; {{ year }} {{ siteConfig.author.name }} &middot; {{ siteConfig.description }}
        </p>
      </div>
      <nav class="links" aria-label="Footer links">
        <a :href="siteConfig.social.github" target="_blank" rel="noopener">GitHub</a>
        <a :href="withBasePath('/rss.xml')">RSS</a>
        <a :href="withBasePath('/sitemap.xml')">Sitemap</a>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  position: relative;
  margin-top: 88px;
  padding: 48px 0 28px;
  overflow: hidden;
  isolation: isolate;
  background: linear-gradient(
    180deg,
    rgba(224, 242, 254, 0),
    rgba(240, 249, 255, 0.56) 72%,
    rgba(255, 255, 255, 0.72)
  );
  border-top: 1px solid rgba(255, 255, 255, 0.72);
}

.app-footer::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 46% 70% at 14% 80%, rgba(255, 255, 255, 0.46), transparent 68%),
    radial-gradient(ellipse 48% 76% at 88% 72%, rgba(186, 230, 253, 0.28), transparent 72%);
}

.container {
  position: relative;
  z-index: 2;
  width: min(1200px, calc(100% - 48px));
  margin: 0 auto;
  padding: 14px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  background: rgba(240, 249, 255, 0.46);
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 8px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 16px 36px rgba(14, 165, 233, 0.08);
}

.brand {
  margin: 0;
  color: var(--text-primary);
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 700;
}

.copyright {
  margin: 2px 0 0;
  color: var(--text-secondary);
  font-size: 13px;
}

.links {
  display: flex;
  gap: 12px;
  font-size: 13px;
  font-family: 'JetBrains Mono', monospace;
}

.links a {
  color: var(--color-primary-dark);
  transition:
    color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;
  padding: 6px 10px;
  border: 1px solid rgba(14, 165, 233, 0.16);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.48);
}

.links a:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.78);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .app-footer {
    margin-top: 72px;
    padding: 34px 0 16px;
  }

  .container {
    width: calc(100% - 28px);
    align-items: flex-start;
  }

  .links {
    gap: 8px;
    flex-wrap: wrap;
  }
}
</style>
