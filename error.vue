<script setup lang="ts">
import { siteConfig } from '~/app/config/site'

const props = defineProps<{
  error: { statusCode: number; message?: string }
}>()

const config = computed(() => {
  switch (props.error?.statusCode) {
    case 404:
      return { code: '404', title: '页面未找到', desc: '你要找的内容可能被移走了，或者从未存在过' }
    case 500:
      return { code: '500', title: '服务异常', desc: '服务器开了个小差，稍后再试' }
    default:
      return {
        code: String(props.error?.statusCode || '???'),
        title: '出错了',
        desc: props.error?.message || '发生了未知错误',
      }
  }
})

function handleHome() {
  clearError({ redirect: '/' })
}

useHead({ title: `${config.value.code} · ${siteConfig.name}` })
</script>

<template>
  <div class="error-page">
    <div class="bg" aria-hidden="true" />
    <div class="content">
      <div class="code">{{ config.code }}</div>
      <div class="title">{{ config.title }}</div>
      <p class="desc">{{ config.desc }}</p>
      <button class="btn" @click="handleHome">返回首页</button>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: var(--bg-page);
}
.bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 600px 400px at 50% 30%, rgba(14, 165, 233, 0.18), transparent),
    radial-gradient(ellipse 500px 300px at 50% 70%, rgba(6, 182, 212, 0.12), transparent);
  pointer-events: none;
}
.content {
  position: relative;
  text-align: center;
  padding: 24px;
}
.code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 96px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary), var(--color-cyan));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
  margin-bottom: 16px;
}
.title {
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}
.desc {
  color: var(--text-secondary);
  font-size: 14px;
  margin: 0 0 24px;
}
.btn {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  padding: 10px 24px;
  background: var(--color-primary);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn:hover {
  background: var(--color-primary-dark);
  box-shadow: 0 0 24px rgba(14, 165, 233, 0.4);
}
</style>
