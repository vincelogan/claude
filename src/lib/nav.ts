import type { Localized } from './i18n';

// Lightweight navigation config (kept separate from heavy content so it can be
// imported into client components without bloating the bundle).

export interface NavLink {
  slug: string;
  icon: string;
  label: Localized;
}

export const EXPERIENCE_NAV: NavLink[] = [
  { slug: 'sightseeing', icon: '🗿', label: { en: 'Sightseeing', pt: 'Pontos turísticos' } },
  { slug: 'things-to-do', icon: '🏄', label: { en: 'Things to do', pt: 'O que fazer' } },
  { slug: 'carnaval', icon: '🎭', label: { en: 'Carnival', pt: 'Carnaval' } },
  { slug: 'reveillon', icon: '🎆', label: { en: 'Réveillon', pt: 'Réveillon' } },
  { slug: 'nightlife', icon: '🍸', label: { en: 'Parties & Nightlife', pt: 'Festas & Noite' } },
  { slug: 'stay', icon: '🏨', label: { en: 'Where to stay', pt: 'Onde se hospedar' } },
  { slug: 'eat', icon: '🍽️', label: { en: 'Where to eat', pt: 'Onde comer' } },
  { slug: 'vip', icon: '💎', label: { en: 'VIP experiences', pt: 'Experiências VIP' } },
];

export const PLAN_NAV: NavLink[] = [
  { slug: 'safety', icon: '🛡️', label: { en: 'Is Rio safe?', pt: 'O Rio é seguro?' } },
  { slug: 'getting-here', icon: '✈️', label: { en: 'How to get here', pt: 'Como chegar' } },
  { slug: 'transport', icon: '🚇', label: { en: 'Getting around', pt: 'Transporte' } },
  { slug: 'best-time', icon: '🌤️', label: { en: 'Best time to visit', pt: 'Melhor época' } },
];
