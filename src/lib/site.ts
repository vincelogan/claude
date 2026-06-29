// Global site configuration — single source of truth for SEO + branding.

export const SITE = {
  domain: 'riodejaneiro.vip',
  url: 'https://riodejaneiro.vip',
  name: 'Rio de Janeiro VIP',
  shortName: 'Rio VIP',
  // Bilingual taglines
  tagline: {
    en: 'The Marvelous City, unlocked.',
    pt: 'A Cidade Maravilhosa, do seu jeito.',
  },
  description: {
    en: 'The premium insider guide to Rio de Janeiro — Carnival, Réveillon, nightlife, the best beaches, where to stay and eat, VIP experiences, plus honest safety and travel info for foreigners and Brazilians alike.',
    pt: 'O guia premium do Rio de Janeiro — Carnaval, Réveillon, vida noturna, as melhores praias, onde se hospedar e comer, experiências VIP, além de informações honestas de segurança e viagem.',
  },
  email: 'concierge@riodejaneiro.vip',
  locales: ['en', 'pt'] as const,
  defaultLocale: 'en' as const,
  social: {
    instagram: 'https://instagram.com/riodejaneiro.vip',
    youtube: 'https://youtube.com/@riodejaneiro.vip',
    tiktok: 'https://tiktok.com/@riodejaneiro.vip',
  },
  // Default social-share image. SVG placeholder ships by default; replace with a
  // branded/AI-generated 1200×630 raster (e.g. /img/og.jpg) for best social previews.
  ogImage: '/img/og.svg',
} as const;

export type Locale = (typeof SITE.locales)[number];

export function isLocale(value: string): value is Locale {
  return (SITE.locales as readonly string[]).includes(value);
}

export function localeName(l: Locale): string {
  return l === 'pt' ? 'Português' : 'English';
}

// Build a canonical absolute URL for a given locale + path.
export function absoluteUrl(locale: Locale, path = ''): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  const segs = [locale, clean].filter(Boolean).join('/');
  return `${SITE.url}/${segs}${segs ? '/' : ''}`;
}
