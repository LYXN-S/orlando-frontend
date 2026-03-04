/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B5E3C',
          foreground: '#ffffff',
          light: '#FBF5EF',
          hover: '#6F4A2E',
          50: '#FBF5EF',
          100: '#F5E6D3',
          200: '#E8CDB0',
          300: '#D4A87A',
          400: '#B8784E',
          500: '#8B5E3C',
          600: '#8B5E3C',
          700: '#6F4A2E',
          800: '#553821',
          900: '#3B2615',
        },
        accent: {
          DEFAULT: '#6B7F3A',
          foreground: '#ffffff',
          hover: '#566832',
          light: '#E8EED6',
        },
        destructive: {
          DEFAULT: '#C0392B',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#FBF5EF',
          foreground: '#8C7B6B',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#2D1F14',
        },
        wine: '#722F37',
        success: '#27AE60',
        background: '#FEFCF9',
        foreground: '#2D1F14',
        border: '#E8DDD1',
        input: '#E8DDD1',
        ring: '#8B5E3C',
        sand: '#E8DDD1',
        cream: '#FBF5EF',
        espresso: '#2D1F14',
        kraft: '#C4A77D',
        linen: '#F5F0E8',
        terracotta: '#C67042',
        'aged-paper': '#F2E8D5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        handwritten: ['Caveat', 'cursive'],
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [],
}

