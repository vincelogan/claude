import type { Metadata } from 'next';
import { SITE, type Locale, absoluteUrl } from './site';

interface PageSeo {
  locale: Locale;
  path?: string; // path after locale, e.g. 'carnaval'
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article';
}

// Builds consistent metadata with canonical + hreflang alternates for both locales.
export function buildMetadata({
  locale,
  path = '',
  title,
  description,
  keywords,
  image,
  type = 'website',
}: PageSeo): Metadata {
  const canonical = absoluteUrl(locale, path);
  const fallbackImage = SITE.ogImage.startsWith('http')
    ? SITE.ogImage
    : `${SITE.url}${SITE.ogImage}`;
  const ogImage = image ?? fallbackImage;

  const languages: Record<string, string> = {
    en: absoluteUrl('en', path),
    pt: absoluteUrl('pt', path),
    'x-default': absoluteUrl(SITE.defaultLocale, path),
  };

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type,
      title,
      description,
      url: canonical,
      siteName: SITE.name,
      locale: locale === 'pt' ? 'pt_BR' : 'en_US',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}
