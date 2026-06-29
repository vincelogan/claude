import type { Metadata } from 'next';
import { Fraunces, Hanken_Grotesk } from 'next/font/google';
import { notFound } from 'next/navigation';
import '../globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { SITE, isLocale, htmlLang, type Locale, absoluteUrl } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';
import { assetPath } from '@/lib/asset';

const display = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export function generateStaticParams() {
  return SITE.locales.map((locale) => ({ locale }));
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = (isLocale(params.locale) ? params.locale : SITE.defaultLocale) as Locale;
  return {
    metadataBase: new URL(SITE.url),
    ...buildMetadata({
      locale,
      title: `${SITE.name} — ${SITE.tagline[locale]}`,
      description: SITE.description[locale],
    }),
    icons: { icon: [{ url: assetPath('/favicon.svg'), type: 'image/svg+xml' }] },
    robots: { index: true, follow: true },
  };
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;

  const destinationLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: 'Rio de Janeiro',
    description: SITE.description[locale],
    url: absoluteUrl(locale),
    touristType: ['Beach', 'Culture', 'Nightlife', 'Luxury'],
    geo: { '@type': 'GeoCoordinates', latitude: -22.9068, longitude: -43.1729 },
  };
  const siteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    inLanguage: htmlLang(locale),
    potentialAction: {
      '@type': 'SearchAction',
      target: `${absoluteUrl(locale)}o-que-fazer?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang={htmlLang(locale)} className={`${display.variable} ${sans.variable}`}>
      <body>
        <JsonLd data={[destinationLd, siteLd]} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-mata focus:px-4 focus:py-2 focus:text-white"
        >
          {locale === 'pt' ? 'Pular para o conteúdo' : 'Skip to content'}
        </a>
        <Header locale={locale} />
        <main id="main">{children}</main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
