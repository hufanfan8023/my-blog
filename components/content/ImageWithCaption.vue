<script setup lang="ts">
defineProps<{
  src: string
  alt?: string
  caption?: string
}>()
</script>

<template>
  <figure class="img-cap">
    <img :src="src" :alt="alt || caption" loading="lazy" decoding="async" />
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.img-cap {
  margin: 1.6em 0;
  text-align: center;
}
.img-cap img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  border: 1px solid var(--border-card);
  background: var(--bg-card);
}
figcaption {
  margin-top: 8px;
  color: var(--text-muted);
  font-size: 13px;
  font-family: 'JetBrains Mono', monospace;
}
</style>
