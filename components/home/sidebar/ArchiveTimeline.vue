<script setup lang="ts">
import type { ArchiveMonth } from '~/types/post'

defineProps<{ months: ArchiveMonth[] }>()
</script>

<template>
  <GlassCard v-if="months.length" class="card">
    <div class="head">归档</div>
    <ul class="list">
      <li v-for="m in months" :key="m.yearMonth">
        <NuxtLink :to="`/archive/${m.yearMonth}`" class="row">
          <span class="ym">{{ m.yearMonth }}</span>
          <span class="count">{{ m.count }} 篇</span>
        </NuxtLink>
      </li>
    </ul>
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
  background: var(--color-amber);
  box-shadow: 0 0 8px var(--color-amber);
}
.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.row {
  display: flex;
  justify-content: space-between;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  transition: all 0.2s ease;
}
.ym {
  color: var(--text-secondary);
}
.count {
  color: var(--color-primary);
  font-weight: 500;
}
.row:hover .ym {
  color: var(--text-primary);
}
</style>
