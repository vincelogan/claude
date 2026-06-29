import type { MetadataRoute } from 'next';
import { SITE, absoluteUrl } from '@/lib/site';
import { allSlugs } from '@/content';

const LAST_MOD = '2026-06-29';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of SITE.locales) {
    // Home
    entries.push({
      url: absoluteUrl(locale),
      lastModified: LAST_MOD,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: {
          en: absoluteUrl('en'),
          pt: absoluteUrl('pt'),
        },
      },
    });

    // Guides
    for (const slug of allSlugs()) {
      entries.push({
        url: absoluteUrl(locale, slug),
        lastModified: LAST_MOD,
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: {
            en: absoluteUrl('en', slug),
            pt: absoluteUrl('pt', slug),
          },
        },
      });
    }
  }

  return entries;
}
