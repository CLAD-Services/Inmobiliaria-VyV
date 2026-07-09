/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#0F1115',
        concrete: '#F4F5F7',
        steel: '#1E222A',
        terracotta: '#E65F2B',
        brass: '#D4AF37',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'fade-scale': 'fadeInScale 0.3s ease-out forwards',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInScale: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
};

