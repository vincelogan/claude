import type { Locale } from './site';

// UI chrome strings (navigation, buttons, recurring labels).
// Page/content copy lives in src/content.

type Dict = Record<string, { en: string; pt: string }>;

const DICT: Dict = {
  'nav.guides': { en: 'Guides', pt: 'Guias' },
  'nav.plan': { en: 'Plan your trip', pt: 'Planeje sua viagem' },
  'nav.menu': { en: 'Menu', pt: 'Menu' },
  'nav.close': { en: 'Close', pt: 'Fechar' },

  'cta.explore': { en: 'Explore', pt: 'Explorar' },
  'cta.readGuide': { en: 'Read the guide', pt: 'Ver o guia' },
  'cta.viewAll': { en: 'View all', pt: 'Ver tudo' },
  'cta.planTrip': { en: 'Start planning', pt: 'Começar a planejar' },
  'cta.discover': { en: 'Discover', pt: 'Descubra' },

  'home.categoriesTitle': { en: 'Everything Rio, curated', pt: 'Tudo do Rio, com curadoria' },
  'home.categoriesSub': {
    en: 'From the world’s biggest party to a quiet sunset at Arpoador — the experiences that define the Marvelous City.',
    pt: 'Da maior festa do mundo a um pôr do sol tranquilo no Arpoador — as experiências que definem a Cidade Maravilhosa.',
  },
  'home.planTitle': { en: 'Know before you go', pt: 'Saiba antes de ir' },
  'home.planSub': {
    en: 'Honest, practical answers to the questions every traveler asks about Rio.',
    pt: 'Respostas honestas e práticas para as perguntas que todo viajante faz sobre o Rio.',
  },

  'label.highlights': { en: 'Highlights', pt: 'Destaques' },
  'label.goodToKnow': { en: 'Good to know', pt: 'Bom saber' },
  'label.faq': { en: 'Frequently asked', pt: 'Perguntas frequentes' },
  'label.area': { en: 'Area', pt: 'Região' },
  'label.bestFor': { en: 'Best for', pt: 'Ideal para' },
  'label.tip': { en: 'Insider tip', pt: 'Dica de quem conhece' },
  'label.onThisPage': { en: 'On this page', pt: 'Nesta página' },
  'label.relatedGuides': { en: 'Related guides', pt: 'Guias relacionados' },

  'footer.tagline': {
    en: 'Your insider key to the Marvelous City.',
    pt: 'Sua chave para a Cidade Maravilhosa.',
  },
  'footer.guides': { en: 'Guides', pt: 'Guias' },
  'footer.plan': { en: 'Plan', pt: 'Planejar' },
  'footer.rights': { en: 'All rights reserved.', pt: 'Todos os direitos reservados.' },
  'footer.disclaimer': {
    en: 'Independent travel guide. Prices, dates and details change — always confirm with official sources before booking.',
    pt: 'Guia de viagem independente. Preços, datas e detalhes mudam — confirme sempre com fontes oficiais antes de reservar.',
  },

  'price.budget': { en: 'Budget', pt: 'Econômico' },
  'price.mid': { en: 'Mid-range', pt: 'Intermediário' },
  'price.high': { en: 'Upscale', pt: 'Sofisticado' },
  'price.luxury': { en: 'Luxury', pt: 'Luxo' },
};

export function t(key: string, locale: Locale): string {
  const entry = DICT[key];
  if (!entry) return key;
  return entry[locale];
}

// Helper for bilingual content objects stored in src/content.
export type Localized<T = string> = { en: T; pt: T };

export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}
