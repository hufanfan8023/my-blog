<script setup lang="ts">
import { useScroll, useWindowSize } from '@vueuse/core'

const visible = ref(false)

onMounted(() => {
  const { y } = useScroll(window)
  const { height } = useWindowSize()
  watch(y, (val) => {
    visible.value = val > height.value * 1.5
  })
})

function back() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <ClientOnly>
    <Transition name="fade">
      <button
        v-if="visible"
        class="back-to-top"
        aria-label="回到页面顶部"
        @click="back"
      >
        ↑
      </button>
    </Transition>
  </ClientOnly>
</template>

<style scoped>
.back-to-top {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: var(--z-back-to-top);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(14, 165, 233, 0.3);
  color: var(--color-primary);
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.back-to-top:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: var(--color-primary);
  box-shadow: 0 0 24px rgba(14, 165, 233, 0.3);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
