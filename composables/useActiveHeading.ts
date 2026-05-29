export function useActiveHeading(selector = 'h2, h3') {
  const activeId = ref('')

  onMounted(() => {
    const headings = Array.from(document.querySelectorAll<HTMLElement>(selector))
    if (!headings.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeId.value = entry.target.id
            return
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
    )
    headings.forEach((h) => observer.observe(h))

    onBeforeUnmount(() => observer.disconnect())
  })

  return activeId
}
