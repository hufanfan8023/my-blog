<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const { copy, copied, isSupported } = useClipboard({ legacy: true })

function bindCopy(target: HTMLElement) {
  if (target.dataset.copyBound === '1') return
  target.dataset.copyBound = '1'

  const btn = document.createElement('button')
  btn.type = 'button'
  btn.className = 'copy-btn'
  btn.setAttribute('aria-label', '复制代码')
  btn.textContent = '复制'

  btn.addEventListener('click', async () => {
    const code = target.querySelector('code')?.textContent || target.textContent || ''
    if (!isSupported.value) return
    await copy(code.replace(/\n$/, ''))
    btn.textContent = '已复制'
    btn.classList.add('copy-btn--copied')
    setTimeout(() => {
      btn.textContent = '复制'
      btn.classList.remove('copy-btn--copied')
    }, 1600)
  })

  target.style.position = target.style.position || 'relative'
  target.appendChild(btn)
}

onMounted(() => {
  const blocks = Array.from(document.querySelectorAll<HTMLElement>('.prose-blog pre'))
  blocks.forEach(bindCopy)
})

watch(copied, () => {})
</script>

<template>
  <ClientOnly>
    <span class="copy-button-host" aria-hidden="true" />
  </ClientOnly>
</template>

<style>
.prose-blog pre .copy-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  padding: 4px 10px;
  background: rgba(14, 165, 233, 0.08);
  border: 1px solid var(--border-card);
  border-radius: 4px;
  color: var(--text-muted);
  cursor: pointer;
  opacity: 0;
  transition: all 0.15s ease;
  z-index: 1;
}

.prose-blog pre:hover .copy-btn,
.prose-blog pre .copy-btn:focus-visible {
  opacity: 1;
}

.prose-blog pre .copy-btn:hover {
  color: var(--color-primary);
  border-color: rgba(14, 165, 233, 0.4);
  background: rgba(14, 165, 233, 0.08);
}

.prose-blog pre .copy-btn--copied {
  color: var(--color-cyan);
  border-color: rgba(6, 182, 212, 0.4);
  background: rgba(6, 182, 212, 0.08);
}
</style>
