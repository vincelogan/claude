// Global site configuration — single source of truth for SEO + branding.

export const SITE = {
  domain: 'riodejaneiro.vip',
  url: 'https://riodejaneiro.vip',
  name: 'riodejaneiro.vip',
  shortName: 'Rio.vip',
  tagline: {
    pt: 'O melhor do Rio, num só lugar.',
    en: 'The best of Rio, in one place.',
  },
  description: {
    pt: 'Carnaval, Réveillon, praias, hospedagem, gastronomia e experiências exclusivas no Rio de Janeiro — com tudo o que você precisa saber antes de chegar.',
    en: 'Carnival, New Year’s, beaches, hotels, food and exclusive experiences in Rio de Janeiro — plus everything you need to know before you land.',
  },
  email: 'concierge@riodejaneiro.vip',
  // pt-BR is the default locale (served at the root after redirect); en lives under /en.
  locales: ['pt', 'en'] as const,
  defaultLocale: 'pt' as const,
  updatedYear: 2026,
  social: {
    instagram: 'https://instagram.com/riodejaneiro.vip',
    youtube: 'https://youtube.com/@riodejaneiro.vip',
    tiktok: 'https://tiktok.com/@riodejaneiro.vip',
  },
  ogImage: '/img/og.svg',
} as const;

export type Locale = (typeof SITE.locales)[number];

export function isLocale(value: string): value is Locale {
  return (SITE.locales as readonly string[]).includes(value);
}

export function htmlLang(l: Locale): string {
  return l === 'pt' ? 'pt-BR' : 'en';
}

export function ogLocale(l: Locale): string {
  return l === 'pt' ? 'pt_BR' : 'en_US';
}

// Canonical absolute URL for a locale + path (path uses Portuguese slugs).
export function absoluteUrl(locale: Locale, path = ''): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  const segs = [locale, clean].filter(Boolean).join('/');
  return `${SITE.url}/${segs}${segs ? '/' : ''}`;
}
