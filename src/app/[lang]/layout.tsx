import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import '../globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { SITE, isLocale, type Locale, absoluteUrl } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';

const display = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export function generateStaticParams() {
  return SITE.locales.map((lang) => ({ lang }));
}

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const locale = (isLocale(params.lang) ? params.lang : SITE.defaultLocale) as Locale;
  return {
    metadataBase: new URL(SITE.url),
    ...buildMetadata({
      locale,
      title: `${SITE.name} — ${SITE.tagline[locale]}`,
      description: SITE.description[locale],
    }),
    icons: {
      icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    },
    robots: { index: true, follow: true },
  };
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  if (!isLocale(params.lang)) notFound();
  const locale = params.lang as Locale;

  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: SITE.name,
    url: absoluteUrl(locale),
    description: SITE.description[locale],
    areaServed: { '@type': 'City', name: 'Rio de Janeiro' },
    sameAs: Object.values(SITE.social),
  };

  const siteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    inLanguage: locale === 'pt' ? 'pt-BR' : 'en-US',
  };

  return (
    <html lang={locale === 'pt' ? 'pt-BR' : 'en'} className={`${display.variable} ${sans.variable}`}>
      <body>
        <JsonLd data={[orgLd, siteLd]} />
        <Header locale={locale} />
        <main>{children}</main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
