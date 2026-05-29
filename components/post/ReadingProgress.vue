<script setup lang="ts">
import { useReadingProgress } from '~/composables/useReadingProgress'

const progress = useReadingProgress()
</script>

<template>
  <ClientOnly>
    <div class="bar" aria-hidden="true">
      <div class="fill" :style="{ width: `${progress}%` }" />
    </div>
  </ClientOnly>
</template>

<style scoped>
.bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  z-index: var(--z-nav);
  pointer-events: none;
}
.fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), #06b6d4);
  transition: width 0.05s linear;
  box-shadow: 0 0 8px rgba(14, 165, 233, 0.5);
}
</style>
