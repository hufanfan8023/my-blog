<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

function toggle() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <button
    class="theme-toggle"
    :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'"
    @click="toggle"
  >
    <ClientOnly>
      <span class="icon" :class="{ 'icon--dark': isDark }">
        <span v-if="isDark">☀</span>
        <span v-else>☾</span>
      </span>
      <template #fallback>
        <span class="icon">☾</span>
      </template>
    </ClientOnly>
  </button>
</template>

<style scoped>
.theme-toggle {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-card);
  background: rgba(14, 165, 233, 0.05);
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 16px;
  transition: all 0.2s ease;
}
.theme-toggle:hover {
  border-color: rgba(14, 165, 233, 0.3);
  color: var(--color-primary);
}
.icon {
  display: inline-block;
  transition: transform 0.3s ease;
}
.icon--dark {
  color: var(--color-amber);
  transform: rotate(180deg);
}
</style>
