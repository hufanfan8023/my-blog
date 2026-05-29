<script setup lang="ts">
import { siteConfig } from '~/app/config/site'
</script>

<template>
  <GlassCard class="card">
    <div class="head">
      <NuxtLink to="/about" class="avatar-link">
        <img :src="siteConfig.author.avatar" alt="头像" class="avatar" width="64" height="64" />
      </NuxtLink>
      <div class="info">
        <div class="name">{{ siteConfig.author.name }}</div>
        <div class="bio">{{ siteConfig.author.bio }}</div>
        <div class="loc">📍 {{ siteConfig.author.location }}</div>
      </div>
    </div>
  </GlassCard>
</template>

<style scoped>
.card {
  padding: 18px;
  background: rgba(255, 255, 255, 0.76) !important;
  border-color: rgba(14, 165, 233, 0.2) !important;
}
.head {
  display: flex;
  gap: 14px;
  align-items: center;
}
.avatar-link {
  display: inline-block;
  flex-shrink: 0;
  border-radius: 50%;
  position: relative;
}
.avatar-link::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.86), rgba(14, 165, 233, 0.24) 58%, transparent 72%);
  z-index: -1;
  animation: pulseGlow 2.4s ease-in-out infinite;
}
.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 1px solid rgba(14, 165, 233, 0.5);
  display: block;
  background: var(--bg-page);
}
.name {
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 500;
}
.bio {
  color: var(--text-secondary);
  font-size: 13px;
  margin-top: 2px;
  line-height: 1.55;
}
.loc {
  color: var(--text-muted);
  font-size: 12px;
  font-family: 'JetBrains Mono', monospace;
  margin-top: 6px;
}
@keyframes pulseGlow {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.04); }
}
</style>
