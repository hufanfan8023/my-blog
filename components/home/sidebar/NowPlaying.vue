<script setup lang="ts">
import { siteConfig } from '~/app/config/site'
</script>

<template>
  <GlassCard v-if="siteConfig.author.nowPlaying" class="card">
    <div class="head">
      <span class="dot" aria-hidden="true" />
      <span class="title">最近在做</span>
    </div>
    <p class="content">{{ siteConfig.author.nowPlaying }}</p>
  </GlassCard>
</template>

<style scoped>
.card {
  padding: 14px 16px;
}
.head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-cyan);
  box-shadow: 0 0 12px var(--color-cyan);
  animation: pulse 1.5s ease-in-out infinite;
}
.title {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
}
.content {
  color: var(--text-secondary);
  font-size: 13px;
  font-family: 'JetBrains Mono', monospace;
  line-height: 1.6;
  margin: 0;
}
@keyframes pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}
</style>
