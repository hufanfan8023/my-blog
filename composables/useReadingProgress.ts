import { useScroll, useWindowSize } from '@vueuse/core'

export function useReadingProgress() {
  const { y } = useScroll(typeof window !== 'undefined' ? window : null as any)
  const { height } = useWindowSize()

  return computed(() => {
    if (typeof document === 'undefined') return 0
    const total = document.documentElement.scrollHeight - height.value
    if (total <= 0) return 0
    return Math.min(100, Math.max(0, (y.value / total) * 100))
  })
}
