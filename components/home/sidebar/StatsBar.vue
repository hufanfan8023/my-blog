<script setup lang="ts">
import type { PostStats } from '~/types/post'

defineProps<{ stats: PostStats }>()
</script>

<template>
  <GlassCard class="card">
    <div class="row">
      <div class="item">
        <div class="num">{{ stats.totalPosts }}</div>
        <div class="label">POSTS</div>
      </div>
      <div class="divider" />
      <div class="item">
        <div class="num">{{ stats.totalTags }}</div>
        <div class="label">TAGS</div>
      </div>
      <div class="divider" />
      <div class="item">
        <div class="num">{{ stats.totalMonths }}</div>
        <div class="label">MONTHS</div>
      </div>
    </div>
  </GlassCard>
</template>

<style scoped>
.card {
  padding: 16px;
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.item {
  flex: 1;
  text-align: center;
}
.divider {
  width: 1px;
  height: 32px;
  background: var(--border-subtle);
}
.num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-primary);
}
.label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--text-muted);
  letter-spacing: 1px;
  margin-top: 2px;
}
</style>
