<script setup lang="ts">
import { useActiveHeading } from '~/composables/useActiveHeading'

defineProps<{
  links: { id: string; depth: number; text: string; children?: any[] }[]
}>()

const activeId = useActiveHeading('h2, h3')
</script>

<template>
  <aside class="post-toc" aria-label="目录">
    <div class="head">目录</div>
    <ul class="list">
      <li
        v-for="link in links"
        :key="link.id"
        class="item"
        :class="[
          `item--d${link.depth}`,
          { 'item--active': activeId === link.id },
        ]"
      >
        <a :href="`#${link.id}`">{{ link.text }}</a>
        <ul v-if="link.children && link.children.length" class="sub">
          <li
            v-for="c in link.children"
            :key="c.id"
            class="item item--d3"
            :class="{ 'item--active': activeId === c.id }"
          >
            <a :href="`#${c.id}`">{{ c.text }}</a>
          </li>
        </ul>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.post-toc {
  position: sticky;
  top: 80px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  font-size: 13px;
  z-index: var(--z-sticky-toc);
  padding: 16px;
  border: 1px solid rgba(14, 165, 233, 0.16);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 14px 34px rgba(14, 165, 233, 0.1);
}
.head {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0;
  color: var(--color-primary);
  margin-bottom: 12px;
  font-weight: 500;
}
.list,
.sub {
  list-style: none;
  margin: 0;
  padding: 0;
}
.sub {
  margin-top: 4px;
}
.item {
  position: relative;
  margin: 4px 0;
  border-left: 2px solid rgba(14, 165, 233, 0.12);
  border-radius: 0 6px 6px 0;
}
.item--d2 a {
  padding-left: 10px;
}
.item--d3 a {
  padding-left: 20px;
}
.item a {
  display: block;
  color: var(--text-secondary);
  padding: 4px 8px 4px 10px;
  line-height: 1.5;
  transition: all 0.15s ease;
}
.item a:hover {
  color: var(--text-primary);
  background: rgba(224, 242, 254, 0.42);
}
.item--active {
  border-left-color: var(--color-primary);
}
.item--active > a {
  color: var(--color-primary);
}
@media (max-width: 1280px) {
  .post-toc {
    display: none;
  }
}
</style>
