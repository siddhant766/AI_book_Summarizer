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
        brand: {
          50: '#f4f3ff',
          100: '#eae8ff',
          200: '#d7d4ff',
          300: '#b8b2ff',
          400: '#9386ff',
          500: '#6d53ff', // electric indigo
          600: '#5a37f5',
          700: '#4c26df',
          800: '#3e1fb9',
          900: '#341b99',
          950: '#1f0e66',
        },
        slate: {
          900: '#0F172A',
          950: '#030712'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
