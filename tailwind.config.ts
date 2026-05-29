import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: 'class',
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
    './content/**/*.md',
  ],
  theme: {
    extend: {
      colors: {
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        ink: {
          950: '#0b1220',
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
        },
        text: {
          primary: '#0c4a6e',
          body: '#1e293b',
          secondary: '#475569',
          muted: '#94a3b8',
        },
        brand: {
          DEFAULT: '#0ea5e9',
          light: '#38bdf8',
          dark: '#0284c7',
        },
        accent: {
          DEFAULT: '#06b6d4',
          light: '#22d3ee',
        },
        warm: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '1.5' }],
        sm: ['14px', { lineHeight: '1.6' }],
        base: ['16px', { lineHeight: '1.7' }],
        lg: ['18px', { lineHeight: '1.5' }],
        xl: ['22px', { lineHeight: '1.4' }],
        '2xl': ['28px', { lineHeight: '1.3' }],
        '3xl': ['32px', { lineHeight: '1.2' }],
      },
      borderRadius: {
        card: '10px',
      },
      backdropBlur: {
        xs: '4px',
      },
      boxShadow: {
        glow: '0 0 24px rgba(14, 165, 233, 0.25)',
        'glow-strong': '0 0 32px rgba(14, 165, 233, 0.4)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.2)',
        card: '0 8px 24px rgba(14, 165, 233, 0.1)',
        'card-hover': '0 12px 32px rgba(14, 165, 233, 0.16), 0 0 24px rgba(14, 165, 233, 0.08)',
      },
      maxWidth: {
        prose: '720px',
        container: '1200px',
      },
      animation: {
        shimmer: 'shimmer 1.5s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 16px rgba(14, 165, 233, 0.2)' },
          '50%': { boxShadow: '0 0 32px rgba(14, 165, 233, 0.5)' },
        },
      },
    },
  },
}
