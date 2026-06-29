import type { MetadataRoute } from 'next';
import { SITE, absoluteUrl } from '@/lib/site';
import { EVENTS, NEIGHBORHOODS, ATTRACTIONS, HOTELS, RESTAURANTS } from '@/content';

const LAST_MOD = '2026-06-29';

export const dynamic = 'force-static';

// All routes (Portuguese slugs, shared across locales).
function paths(): string[] {
  const base = ['', 'onde-ficar', 'hoteis', 'o-que-fazer', 'onde-comer', 'vip', 'planejar', 'sobre'];
  const events = EVENTS.map((e) => e.slug);
  const bairros = NEIGHBORHOODS.map((n) => `onde-ficar/${n.slug}`);
  const attractions = ATTRACTIONS.map((a) => `o-que-fazer/${a.slug}`);
  const hotels = HOTELS.map((h) => `hoteis/${h.slug}`);
  const restaurants = RESTAURANTS.map((r) => `onde-comer/${r.slug}`);
  return [...base, ...events, ...bairros, ...attractions, ...hotels, ...restaurants];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const path of paths()) {
    for (const locale of SITE.locales) {
      entries.push({
        url: absoluteUrl(locale, path),
        lastModified: LAST_MOD,
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : path.includes('/') ? 0.7 : 0.8,
        alternates: {
          languages: {
            'pt-BR': absoluteUrl('pt', path),
            en: absoluteUrl('en', path),
          },
        },
      });
    }
  }
  return entries;
}
