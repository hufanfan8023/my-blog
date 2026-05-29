<script setup lang="ts">
import type { Category } from '~/types/post'
import { CATEGORY_COLOR_MAP, CATEGORY_TEXT_MAP } from '~/types/post'

const props = withDefaults(
  defineProps<{
    label: string
    /** 分类色，如果没传则按 category 取 */
    category?: Category
    color?: string
    href?: string
    size?: 'sm' | 'md'
    selected?: boolean
  }>(),
  { size: 'sm' },
)

const borderColor = computed(() =>
  props.color || (props.category ? CATEGORY_COLOR_MAP[props.category] : 'var(--color-primary)'),
)
const textColor = computed(() =>
  props.color || (props.category ? CATEGORY_TEXT_MAP[props.category] : 'var(--color-primary-dark)'),
)
const styleVars = computed(() => ({
  '--tag-border': borderColor.value,
  '--tag-text': textColor.value,
}))

const Tag = props.href ? resolveComponent('NuxtLink') : 'span'
</script>

<template>
  <component
    :is="Tag"
    :to="href"
    class="tag-pill"
    :class="[
      `tag-pill--${size}`,
      { 'tag-pill--selected': selected, 'tag-pill--link': !!href },
    ]"
    :style="styleVars"
    @click.stop
  >
    {{ label }}
  </component>
</template>

<style scoped>
.tag-pill {
  display: inline-flex;
  align-items: center;
  border: 1px solid color-mix(in srgb, var(--tag-border) 40%, transparent);
  background: color-mix(in srgb, var(--tag-border) 8%, transparent);
  color: var(--tag-text);
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  white-space: nowrap;
  transition: all 0.2s ease;
  line-height: 1;
}
.tag-pill--sm {
  font-size: 12px;
  padding: 3px 8px;
  height: 22px;
}
.tag-pill--md {
  font-size: 13px;
  padding: 4px 10px;
  height: 26px;
}
.tag-pill--link {
  cursor: pointer;
}
.tag-pill--link:hover {
  border-color: color-mix(in srgb, var(--tag-border) 70%, transparent);
  background: color-mix(in srgb, var(--tag-border) 15%, transparent);
}
.tag-pill--selected {
  background: var(--tag-border);
  border-color: var(--tag-border);
  color: #ffffff;
}
</style>
