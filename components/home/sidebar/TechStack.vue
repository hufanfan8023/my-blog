<script setup lang="ts">
import { siteConfig } from '~/app/config/site'
</script>

<template>
  <GlassCard class="card">
    <div class="head">技术栈</div>
    <div class="tags">
      <NuxtLink
        v-for="t in siteConfig.author.techStack"
        :key="t"
        :to="`/tags/${encodeURIComponent(t)}`"
        class="tag"
      >
        {{ t }}
      </NuxtLink>
    </div>
  </GlassCard>
</template>

<style scoped>
.card {
  padding: 16px;
}
.head {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.head::before {
  content: '';
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--color-primary);
  box-shadow: 0 0 8px var(--color-primary);
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.tag {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  font-size: 12px;
  color: var(--color-primary-light);
  background: rgba(14, 165, 233, 0.08);
  border: 1px solid rgba(14, 165, 233, 0.3);
  border-radius: 4px;
  transition: all 0.2s ease;
}
.tag:hover {
  background: rgba(14, 165, 233, 0.15);
  border-color: rgba(14, 165, 233, 0.6);
}
</style>
