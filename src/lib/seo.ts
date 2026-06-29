import type { Metadata } from 'next';
import { SITE, type Locale, absoluteUrl, ogLocale } from './site';

interface PageSeo {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article';
}

// Consistent metadata with canonical + hreflang alternates for both locales.
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

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: {
        'pt-BR': absoluteUrl('pt', path),
        en: absoluteUrl('en', path),
        'x-default': absoluteUrl(SITE.defaultLocale, path),
      },
    },
    openGraph: {
      type,
      title,
      description,
      url: canonical,
      siteName: SITE.name,
      locale: ogLocale(locale),
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
