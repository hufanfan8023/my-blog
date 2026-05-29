<script setup lang="ts">
const bgRef = ref<HTMLElement | null>(null)

const cloudParts = ['base', 'left', 'center', 'crest', 'right', 'shine'] as const

const floatingClouds = [
  {
    name: 'far-left',
    top: '13%',
    width: 'min(36vw, 440px)',
    duration: '145s',
    delay: '-42s',
    opacity: '0.36',
    blur: '0.2px',
  },
  {
    name: 'upper-mid',
    top: '24%',
    width: 'min(30vw, 360px)',
    duration: '172s',
    delay: '-118s',
    opacity: '0.3',
    blur: '0.6px',
  },
  {
    name: 'lower-wide',
    top: '46%',
    width: 'min(44vw, 540px)',
    duration: '210s',
    delay: '-86s',
    opacity: '0.24',
    blur: '1px',
  },
  {
    name: 'small-fast',
    top: '34%',
    width: 'min(22vw, 260px)',
    duration: '128s',
    delay: '-16s',
    opacity: '0.28',
    blur: '0px',
  },
] as const

let animationFrame = 0
let targetX = 0
let targetY = 0
let currentX = 0
let currentY = 0
let glowX = 0
let glowY = 0

function floatingCloudStyle(cloud: (typeof floatingClouds)[number]) {
  return {
    '--float-top': cloud.top,
    '--float-width': cloud.width,
    '--float-duration': cloud.duration,
    '--float-delay': cloud.delay,
    '--float-opacity': cloud.opacity,
    '--float-blur': cloud.blur,
  }
}

function setIdle() {
  targetX = 0
  targetY = 0
  bgRef.value?.classList.remove('is-active')
}

function handlePointerMove(event: PointerEvent) {
  const el = bgRef.value
  if (!el) return

  const width = window.innerWidth || 1
  const height = window.innerHeight || 1

  targetX = event.clientX / width - 0.5
  targetY = event.clientY / height - 0.5
  glowX = event.clientX
  glowY = event.clientY

  el.classList.add('is-active')
}

function handlePointerLeave() {
  setIdle()
}

function tick() {
  const el = bgRef.value
  if (!el) return

  currentX += (targetX - currentX) * 0.08
  currentY += (targetY - currentY) * 0.08

  const driftX = currentX * 18
  const driftY = currentY * 12

  el.style.setProperty('--cloud-base-x', `${(-driftX * 0.36).toFixed(2)}px`)
  el.style.setProperty('--cloud-base-y', `${(-driftY * 0.24).toFixed(2)}px`)
  el.style.setProperty('--cloud-slow-x', `${(driftX * 0.42).toFixed(2)}px`)
  el.style.setProperty('--cloud-slow-y', `${(driftY * 0.32).toFixed(2)}px`)
  el.style.setProperty('--glow-x', `${glowX.toFixed(1)}px`)
  el.style.setProperty('--glow-y', `${glowY.toFixed(1)}px`)

  animationFrame = window.requestAnimationFrame(tick)
}

onMounted(() => {
  const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (shouldReduceMotion) return

  glowX = window.innerWidth / 2
  glowY = window.innerHeight / 2

  window.addEventListener('pointermove', handlePointerMove, { passive: true })
  window.addEventListener('pointerleave', handlePointerLeave)
  animationFrame = window.requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerleave', handlePointerLeave)

  if (animationFrame) {
    window.cancelAnimationFrame(animationFrame)
  }
})
</script>

<template>
  <div ref="bgRef" class="bg-anim" aria-hidden="true">
    <div class="sky-photo sky-photo--base" />
    <div class="sky-photo sky-photo--slow" />
    <div class="floating-clouds">
      <span
        v-for="cloud in floatingClouds"
        :key="cloud.name"
        class="floating-cloud"
        :style="floatingCloudStyle(cloud)"
      >
        <span
          v-for="part in cloudParts"
          :key="`${cloud.name}-${part}`"
          :class="['cloud-lobe', `cloud-lobe--${part}`]"
        />
      </span>
    </div>
    <div class="sky-tint" />
    <div class="sky-haze" />
    <div class="cursor-breeze" />
  </div>
</template>

<style scoped>
.bg-anim {
  --cloud-base-x: 0px;
  --cloud-base-y: 0px;
  --cloud-slow-x: 0px;
  --cloud-slow-y: 0px;
  --glow-x: 50vw;
  --glow-y: 45vh;

  position: fixed;
  inset: 0;
  z-index: var(--z-bg);
  pointer-events: none;
  overflow: hidden;
  background: #7dd3fc;
}

.sky-photo {
  position: absolute;
  inset: -8%;
  background-image: url('/images/sky-clouds-cc0.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center 42%;
  transform: translate3d(var(--cloud-base-x), var(--cloud-base-y), 0) scale(1.05);
  will-change: transform, background-position;
}

.sky-photo--base {
  opacity: 0.58;
  filter: saturate(1.16) brightness(1.14) contrast(0.96);
  transition: filter 0.35s ease;
}

.bg-anim.is-active .sky-photo--base {
  filter: saturate(1.22) brightness(1.17) contrast(0.98);
}

.sky-photo--slow {
  inset: -14%;
  opacity: 0.26;
  background-size: 118% auto;
  background-position: center 52%;
  mix-blend-mode: screen;
  filter: saturate(1.08) brightness(1.2) blur(0.2px);
  animation: skyDrift 260s ease-in-out infinite alternate;
}

.floating-clouds {
  position: absolute;
  inset: -8% -24%;
  z-index: 1;
  pointer-events: none;
  transform: translate3d(calc(var(--cloud-base-x) * -0.36), calc(var(--cloud-base-y) * -0.24), 0);
}

.floating-cloud {
  position: absolute;
  top: var(--float-top);
  left: -34%;
  width: var(--float-width);
  aspect-ratio: 3.6 / 1;
  opacity: var(--float-opacity);
  filter: blur(var(--float-blur));
  mix-blend-mode: screen;
  animation: floatingCloudDrift var(--float-duration) linear infinite;
  animation-delay: var(--float-delay);
  will-change: transform;
}

.cloud-lobe {
  position: absolute;
  border-radius: 999px;
  background:
    radial-gradient(
      circle at 28% 24%,
      rgba(255, 255, 255, 0.98),
      rgba(255, 255, 255, 0.92) 34%,
      rgba(226, 246, 255, 0.62) 72%,
      rgba(186, 230, 253, 0.16)
    ),
    linear-gradient(180deg, rgba(255, 255, 255, 0.8), rgba(224, 242, 254, 0.34));
  box-shadow:
    inset 10px 10px 18px rgba(255, 255, 255, 0.6),
    inset -16px -14px 24px rgba(56, 189, 248, 0.08),
    0 18px 34px rgba(14, 165, 233, 0.08);
}

.cloud-lobe--base {
  right: 7%;
  bottom: 8%;
  left: 7%;
  height: 42%;
}

.cloud-lobe--left {
  top: 30%;
  left: 8%;
  width: 32%;
  height: 52%;
}

.cloud-lobe--center {
  top: 12%;
  left: 29%;
  width: 34%;
  height: 72%;
}

.cloud-lobe--crest {
  top: 3%;
  left: 47%;
  width: 28%;
  height: 74%;
}

.cloud-lobe--right {
  top: 32%;
  right: 6%;
  width: 28%;
  height: 50%;
}

.cloud-lobe--shine {
  top: 14%;
  left: 35%;
  width: 28%;
  height: 26%;
  background: rgba(255, 255, 255, 0.52);
  box-shadow: none;
  filter: blur(7px);
}

.sky-tint {
  position: absolute;
  inset: 0;
  z-index: 2;
  background:
    linear-gradient(
      180deg,
      rgba(56, 189, 248, 0.56) 0%,
      rgba(186, 230, 253, 0.42) 34%,
      rgba(240, 249, 255, 0.64) 100%
    ),
    radial-gradient(ellipse 76% 44% at 50% 0%, rgba(255, 255, 255, 0.36), transparent 70%);
}

.sky-haze {
  position: absolute;
  inset: 0;
  z-index: 3;
  background:
    linear-gradient(
      180deg,
      transparent 0%,
      rgba(240, 249, 255, 0.26) 58%,
      rgba(255, 255, 255, 0.78) 100%
    ),
    radial-gradient(ellipse 90% 34% at 50% 100%, rgba(255, 255, 255, 0.58), transparent 72%);
}

.cursor-breeze {
  position: absolute;
  z-index: 4;
  left: var(--glow-x);
  top: var(--glow-y);
  width: min(34vw, 320px);
  min-width: 180px;
  aspect-ratio: 1;
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, -50%) scale(0.9);
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.54) 0 10%,
    rgba(186, 230, 253, 0.28) 34%,
    transparent 70%
  );
  filter: blur(8px);
  mix-blend-mode: screen;
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
  will-change: left, top, transform, opacity;
}

.bg-anim.is-active .cursor-breeze {
  animation: breezePulse 3.4s ease-in-out infinite;
  transform: translate(-50%, -50%) scale(1);
}

@keyframes breezePulse {
  0%,
  100% {
    opacity: 0.42;
    filter: blur(8px);
  }

  50% {
    opacity: 0.68;
    filter: blur(10px);
  }
}

@keyframes skyDrift {
  0% {
    transform: translate3d(calc(-1.8% + var(--cloud-slow-x)), calc(-0.6% + var(--cloud-slow-y)), 0)
      scale(1.08);
    background-position: 42% 50%;
  }
  100% {
    transform: translate3d(calc(1.8% + var(--cloud-slow-x)), calc(0.8% + var(--cloud-slow-y)), 0)
      scale(1.1);
    background-position: 58% 54%;
  }
}

@keyframes floatingCloudDrift {
  0% {
    transform: translate3d(-12vw, 0, 0) scale(0.96);
  }

  50% {
    transform: translate3d(58vw, -1.6vh, 0) scale(1);
  }

  100% {
    transform: translate3d(128vw, 0.8vh, 0) scale(0.98);
  }
}

@media (max-width: 768px) {
  .sky-photo {
    inset: -18%;
    background-position: center top;
  }

  .floating-clouds {
    inset: -12% -38%;
  }

  .floating-cloud {
    min-width: 190px;
    opacity: var(--float-opacity);
  }
}

@media (prefers-reduced-motion: reduce) {
  .sky-photo--slow,
  .floating-cloud {
    animation: none;
  }

  .cursor-breeze {
    display: none;
  }
}
</style>
