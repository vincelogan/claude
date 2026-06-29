import type { Localized } from '@/lib/i18n';

export type PriceLevel = 'budget' | 'mid' | 'high' | 'luxury';

export type GuideGroup = 'experience' | 'plan';

export interface Item {
  name: string; // proper nouns stay as-is (not translated)
  blurb: Localized;
  area?: string; // neighborhood / location
  bestFor?: Localized;
  tip?: Localized;
  price?: PriceLevel;
  tags?: string[];
  /** Optional external official link */
  link?: string;
}

export interface Section {
  id: string;
  title: Localized;
  intro?: Localized;
  items: Item[];
}

export interface FAQ {
  q: Localized;
  a: Localized;
}

export interface Guide {
  slug: string; // URL segment (shared across locales)
  group: GuideGroup;
  /** Short emoji used as a lightweight icon */
  icon: string;
  nav: Localized; // short nav label
  title: Localized; // H1
  /** SEO meta title (<= ~60 chars). Falls back to title if absent. */
  metaTitle?: Localized;
  /** SEO meta description (~150-160 chars) */
  metaDescription: Localized;
  /** Hero one-liner under the H1 */
  lede: Localized;
  /** 1-2 paragraph intro (supports plain text) */
  intro: Localized[];
  /** Unsplash hero image (royalty-free). Replace with branded/AI imagery in production. */
  hero: string;
  heroCredit?: string;
  /** Keywords this page targets (for internal reference + meta keywords) */
  keywords: string[];
  sections: Section[];
  faqs?: FAQ[];
  related?: string[]; // slugs
}
