import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Rio brand palette — ocean night, sunset gold, tropical accents
        night: {
          DEFAULT: '#071a24',
          50: '#0c2734',
          100: '#0a212c',
          900: '#04121a',
        },
        ocean: {
          DEFAULT: '#0f8aa6',
          light: '#22b8d6',
          deep: '#0a5e72',
        },
        gold: {
          DEFAULT: '#e6b34a',
          light: '#f3cd7a',
          deep: '#c4912f',
        },
        coral: '#ef6f5b',
        jungle: '#1f8a5b',
        sand: '#f6efe4',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '1200px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
