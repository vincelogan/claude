import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Editorial luxury palette — warm, light, photography-first.
        bone: '#F7F3EC',
        cloud: '#FCFAF5',
        ink: '#15120E',
        mata: { DEFAULT: '#0B3D2E', soft: '#12513C' },
        amber: { DEFAULT: '#C99A3B', soft: '#E0B765' },
        coral: '#E15A3C',
        sand: '#E8DFCF',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '1240px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both',
      },
    },
  },
  plugins: [],
};

export default config;
