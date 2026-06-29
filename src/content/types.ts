import type { Localized } from '@/lib/i18n';

export type PriceLevel = 'budget' | 'mid' | 'high' | 'luxury';

/** A reusable list item (dish, venue, tip, etc.) */
export interface Item {
  name: string; // proper nouns kept as-is
  blurb: Localized;
  area?: string;
  bestFor?: Localized;
  tip?: Localized;
  price?: PriceLevel;
  tags?: string[];
  /** Optional /go/<slug> affiliate/booking redirect for a reserve CTA */
  bookingSlug?: string;
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

/** A featured event (Carnaval, Réveillon) shown on the home + pillar pages. */
export interface RioEvent {
  slug: string;
  icon: string;
  name: Localized;
  nav: Localized;
  /** ISO date the countdown targets (start of the headline night). */
  countdownTo: string; // 'YYYY-MM-DDTHH:mm:ssZ'
  dateLabel: Localized; // human readable date range
  /** Multi-line schedule fragments for the pillar page */
  metaTitle: Localized;
  metaDescription: Localized;
  lede: Localized;
  intro: Localized[];
  hero: string;
  photo?: Photo;
  keywords: string[];
  sections: Section[];
  faqs: FAQ[];
  /** schema.org Event fields */
  schema: {
    startDate: string;
    endDate: string;
    location: string;
  };
}

/** A real, freely-licensed photo with attribution. */
export interface Photo {
  url: string;
  credit?: string;
  license?: string;
}

/** A neighborhood (hub + detail template). */
export interface Neighborhood {
  slug: string;
  name: string;
  zone: Localized; // e.g. "Zona Sul"
  tagline: Localized;
  bestFor: Localized;
  metaDescription: Localized;
  intro: Localized[];
  /** honest trade-off — the credibility signal */
  tradeoff: Localized;
  highlights: Localized[]; // bullet list
  hero: string; // SVG art fallback
  photo?: Photo; // real licensed photo (preferred when present)
  price: PriceLevel;
  faqs?: FAQ[];
}

/** A hotel entity (hub + detail template, Hotel schema). */
export interface Hotel {
  slug: string;
  name: string;
  neighborhood: string; // bairro label
  zone: Localized;
  subtype: Localized;
  price: PriceLevel;
  officialUrl?: string;
  bookingSlug?: string; // /go/<slug>
  blurb: Localized;
  tradeoff?: Localized;
  tags?: string[];
  hero: string;
  photo?: Photo;
}

/** A restaurant entity (detail template, Restaurant schema). */
export interface Restaurant {
  slug: string;
  name: string;
  cuisine: Localized;
  neighborhood: string;
  michelin?: string; // e.g. "★★ Michelin (2026)"
  price: PriceLevel;
  officialUrl?: string;
  bookingSlug?: string;
  blurb: Localized;
  tags?: string[];
  hero: string;
  photo?: Photo;
}

export type AttractionCategory = 'icones' | 'praias' | 'natureza' | 'cultura' | 'vida-noturna';

/** An attraction / thing to do (hub + detail template). */
export interface Attraction {
  slug: string;
  name: string;
  category: AttractionCategory;
  area: string;
  tagline: Localized;
  metaDescription: Localized;
  intro: Localized[];
  howToGet: Localized;
  bestTime: Localized;
  costNote: Localized;
  tip: Localized;
  hero: string;
  photo?: Photo;
  /** Official site and official ticket-purchase URL */
  officialUrl?: string;
  ticketUrl?: string;
  keywords: string[];
  faqs?: FAQ[];
}
