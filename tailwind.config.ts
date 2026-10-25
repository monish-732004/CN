import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        orbitron: ['var(--font-orbitron)', 'Orbitron', 'monospace'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: '#0A0A1A',
        surface: '#0F1630',
        card: '#161D3A',
        'border-gold': '#FFD700',
        primary: '#4FC3F7',
        secondary: '#CE93D8',
        accent: '#FFC107',
        success: '#66BB6A',
        error: '#EF5350',
        'text-main': '#F0F0FF',
        'text-muted': '#8892B0',
      },
      animation: {
        'gold-pulse': 'goldPulse 1.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
}
export default config
