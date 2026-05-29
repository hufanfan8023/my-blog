<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const open = useSearchOpen()
const query = ref('')
const results = ref<any[]>([])
const activeIdx = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)
const router = useRouter()

const allPosts = await useAllPosts()

const search = useDebounceFn(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) {
    results.value = []
    return
  }
  results.value = (allPosts.value || [])
    .map((p) => {
      let score = 0
      if (p.title.toLowerCase().includes(q)) score += 10
      if (p.description.toLowerCase().includes(q)) score += 5
      if (p.tags.some((t) => t.toLowerCase().includes(q))) score += 4
      if (p.category.toLowerCase().includes(q)) score += 2
      return { post: p, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((x) => x.post)
  activeIdx.value = 0
}, 200)

watch(query, search)

watch(open, async (v) => {
  if (v) {
    query.value = ''
    results.value = []
    activeIdx.value = 0
    await nextTick()
    inputRef.value?.focus()
  }
})

function close() {
  open.value = false
}

function go(post: any) {
  router.push(post.path)
  close()
}

function onKey(e: KeyboardEvent) {
  if (!open.value) return
  if (e.key === 'Escape') {
    close()
    e.preventDefault()
  } else if (e.key === 'ArrowDown') {
    activeIdx.value = Math.min(results.value.length - 1, activeIdx.value + 1)
    e.preventDefault()
  } else if (e.key === 'ArrowUp') {
    activeIdx.value = Math.max(0, activeIdx.value - 1)
    e.preventDefault()
  } else if (e.key === 'Enter' && results.value[activeIdx.value]) {
    go(results.value[activeIdx.value])
    e.preventDefault()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
})

function highlight(text: string, q: string) {
  if (!q) return text
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(re, '<mark>$1</mark>')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="overlay" @click="close" />
    </Transition>
    <Transition name="modal">
      <div
        v-if="open"
        class="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-title"
        @click.stop
      >
        <h2 id="search-title" class="sr-only">搜索文章</h2>
        <div class="input-wrap">
          <span class="ico" aria-hidden="true">⌕</span>
          <input
            ref="inputRef"
            v-model="query"
            class="input"
            type="search"
            placeholder="搜索标题、标签、描述…"
            autocomplete="off"
          />
          <kbd class="kbd">Esc</kbd>
        </div>
        <div v-if="query && !results.length" class="empty">
          未找到匹配结果
        </div>
        <ul v-if="results.length" class="results">
          <li
            v-for="(r, i) in results"
            :key="r.slug"
            class="item"
            :class="{ 'item--active': i === activeIdx }"
            @mouseenter="activeIdx = i"
            @click="go(r)"
          >
            <div class="r-title" v-html="highlight(r.title, query)" />
            <div class="r-desc" v-html="highlight(r.description, query)" />
            <div class="r-meta">
              <span class="r-cat">{{ r.category }}</span>
              <span v-for="t in r.tags.slice(0, 3)" :key="t" class="r-tag">#{{ t }}</span>
            </div>
          </li>
        </ul>
        <div v-if="!query" class="hint">
          输入关键词搜索 · ↑↓ 导航 · Enter 跳转 · Esc 关闭
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(3, 105, 161, 0.2);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: var(--z-modal-overlay);
}
.modal {
  position: fixed;
  top: 12vh;
  left: 50%;
  transform: translateX(-50%);
  width: min(600px, calc(100vw - 32px));
  max-height: 70vh;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(14, 165, 233, 0.3);
  border-radius: 8px;
  z-index: var(--z-modal);
  box-shadow: 0 16px 48px rgba(14, 165, 233, 0.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.input-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-card);
}
.ico {
  color: var(--text-muted);
  font-size: 18px;
}
.input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-size: 16px;
  font-family: inherit;
}
.input::placeholder {
  color: var(--text-muted);
}
.kbd {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  padding: 2px 6px;
  background: rgba(14, 165, 233, 0.08);
  border: 1px solid var(--border-card);
  border-radius: 4px;
  color: var(--text-muted);
}
.results {
  list-style: none;
  margin: 0;
  padding: 8px;
  overflow-y: auto;
}
.item {
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  border-left: 2px solid transparent;
}
.item--active {
  background: rgba(14, 165, 233, 0.1);
  border-left-color: var(--color-primary);
}
.r-title {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 2px;
}
.r-desc {
  color: var(--text-secondary);
  font-size: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.r-meta {
  display: flex;
  gap: 8px;
  margin-top: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
}
.r-cat {
  color: var(--color-primary);
}
.r-tag {
  color: var(--text-muted);
}
.empty,
.hint {
  padding: 32px 16px;
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
}
:deep(mark) {
  background: rgba(14, 165, 233, 0.25);
  color: var(--text-primary);
  padding: 0 2px;
  border-radius: 2px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translate(-50%, -8px) scale(0.96);
}
</style>
