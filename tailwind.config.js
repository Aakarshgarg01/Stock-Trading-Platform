/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0B0E14',
          light: '#F8FAFC',
          card: '#121721',
          'card-light': '#FFFFFF',
          hover: '#1B2232',
          'hover-light': '#F1F5F9',
          border: '#1E293B',
          'border-light': '#E2E8F0',
        },
        trade: {
          green: '#10B981',
          'green-light': '#34D399',
          'green-dim': 'rgba(16, 185, 129, 0.15)',
          red: '#F43F5E',
          'red-light': '#FB7185',
          'red-dim': 'rgba(244, 63, 94, 0.15)',
          blue: '#3B82F6',
          yellow: '#F59E0B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      keyframes: {
        flashGreen: {
          '0%': { backgroundColor: 'rgba(16, 185, 129, 0.4)' },
          '100%': { backgroundColor: 'transparent' },
        },
        flashRed: {
          '0%': { backgroundColor: 'rgba(244, 63, 94, 0.4)' },
          '100%': { backgroundColor: 'transparent' },
        },
      },
      animation: {
        'flash-green': 'flashGreen 0.8s ease-out',
        'flash-red': 'flashRed 0.8s ease-out',
      },
    },
  },
  plugins: [],
}
