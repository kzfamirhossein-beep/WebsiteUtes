import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "rgb(var(--brand) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
        display: ["var(--font-playfair)", "serif"],
      },
      container: {
        center: true,
        padding: "1rem",
      },
      keyframes: {
        overlayIn: {
          '0%': { opacity: '1' },
          '100%': { opacity: '1' }
        },
        overlayOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        pop: {
          '0%': { transform: 'translateY(8px) scale(0.98)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        glow: {
          '0%': { filter: 'drop-shadow(0 0 0 rgba(160,124,0,0))' },
          '100%': { filter: 'drop-shadow(0 0 14px rgba(160,124,0,0.55))' }
        },
        vignette: {
          '0%': { boxShadow: 'inset 0 0 0 0 rgba(0,0,0,0.9)' },
          '100%': { boxShadow: 'inset 0 0 160px 40px rgba(0,0,0,0.85)' }
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        },
        pulseGlow: {
          '0%': { filter: 'drop-shadow(0 0 4px rgba(var(--brand),0.18))' },
          '50%': { filter: 'drop-shadow(0 0 18px rgba(var(--brand),0.6))' },
          '100%': { filter: 'drop-shadow(0 0 8px rgba(var(--brand),0.28))' }
        },
        breath: {
          '0%': { transform: 'scale(0.985)' },
          '50%': { transform: 'scale(1.015)' },
          '100%': { transform: 'scale(0.985)' }
        },
        twinkle: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
          '100%': { opacity: '0', transform: 'scale(0.8)' }
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100%)' }
        }
      },
      animation: {
        'overlay-in': 'overlayIn 600ms ease-out',
        'overlay-out': 'overlayOut 900ms ease-in forwards',
        'pop': 'pop 700ms cubic-bezier(0.22, 1, 0.36, 1)',
        'shimmer': 'shimmer 1.4s linear infinite',
        'glow': 'glow 1.2s ease-out forwards',
        'vignette': 'vignette 900ms ease-out forwards',
        'gradient': 'gradientShift 14s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.8s ease-in-out infinite',
        'breath': 'breath 5s ease-in-out infinite',
        'twinkle': 'twinkle 1.6s ease-in-out infinite',
        'fade-in': 'fadeIn 1200ms ease-out forwards',
        'slide-down': 'slideDown 400ms ease-out forwards',
        'slide-up': 'slideUp 400ms ease-out forwards'
      }
    },
  },
  plugins: [],
};

export default config;


