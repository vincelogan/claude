import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Charcoal + gold luxury palette (handoff v2.0).
        // Token names kept stable so components re-skin via the map below:
        //   mata  = the dark brand surface (charcoal)
        //   amber = the gold accent
        //   coral = secondary accent (deep gold)
        bone: '#FBFAF7', // page background (paper)
        cloud: '#FFFFFF', // cards over the paper
        ink: '#1C1C1C', // primary text / charcoal
        mata: { DEFAULT: '#1C1C1C', soft: '#252118' }, // dark sections, footer, hero
        amber: { DEFAULT: '#C5A059', soft: '#D9BC7E', deep: '#A07E3D' }, // gold
        coral: '#A07E3D', // secondary accent → deep gold
        sand: '#EFEADF', // subtle surfaces / borders
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
