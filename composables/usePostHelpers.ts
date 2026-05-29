import type { Category } from '~/types/post'
import { CATEGORY_COLOR_MAP, CATEGORY_TEXT_MAP } from '~/types/post'

export function categoryColor(category: Category) {
  return CATEGORY_COLOR_MAP[category] || '#0ea5e9'
}

export function categoryTextColor(category: Category) {
  return CATEGORY_TEXT_MAP[category] || '#0284c7'
}

export function formatDate(date: string, format: 'short' | 'list' | 'long' = 'short') {
  const [y, m, d] = date.split('-')
  if (format === 'list') return `${m}-${d}`
  if (format === 'long') return `${y} 年 ${parseInt(m)} 月 ${parseInt(d)} 日`
  return `${y} · ${m} · ${d}`
}

function toText(content: unknown): string {
  if (!content) return ''
  if (typeof content === 'string') return content
  try {
    return JSON.stringify(content)
  } catch {
    return ''
  }
}

export function calcReadingTime(content: unknown): number {
  const text = toText(content)
  if (!text) return 1
  const cn = (text.match(/[一-龥]/g) || []).length
  const en = (text.match(/[a-zA-Z]+/g) || []).length
  return Math.max(1, Math.round(cn / 300 + en / 200))
}

export function calcWordCount(content: unknown): number {
  const text = toText(content)
  if (!text) return 0
  const cn = (text.match(/[一-龥]/g) || []).length
  const en = (text.match(/[a-zA-Z]+/g) || []).length
  return cn + en
}
