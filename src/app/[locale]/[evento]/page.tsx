import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EVENTS, getEvent } from '@/content';
import { PageHero } from '@/components/PageHero';
import { Sections } from '@/components/Sections';
import { FAQAccordion } from '@/components/FAQAccordion';
import { Countdown } from '@/components/Countdown';
import { JsonLd } from '@/components/JsonLd';
import { t, pick } from '@/lib/i18n';
import { SITE, isLocale, htmlLang, type Locale, absoluteUrl } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';
import { assetPath } from '@/lib/asset';

export function generateStaticParams() {
  return SITE.locales.flatMap((locale) => EVENTS.map((e) => ({ locale, evento: e.slug })));
}

export function generateMetadata({ params }: { params: { locale: string; evento: string } }): Metadata {
  const event = getEvent(params.evento);
  if (!event || !isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  return buildMetadata({
    locale,
    path: event.slug,
    title: `${pick(event.metaTitle, locale)} | ${SITE.shortName}`,
    description: pick(event.metaDescription, locale),
    keywords: event.keywords,
    image: event.hero,
    type: 'article',
  });
}

export default function EventPage({ params }: { params: { locale: string; evento: string } }) {
  if (!isLocale(params.locale)) notFound();
  const event = getEvent(params.evento);
  if (!event) notFound();
  const locale = params.locale as Locale;
  const home = `/${locale}`;

  const isCarnaval = event.slug === 'carnaval';
  const goSlug = isCarnaval ? 'carnival-tickets' : 'reveillon';
  const buyLabel = isCarnaval
    ? locale === 'pt'
      ? 'Comprar camarote'
      : 'Buy camarote tickets'
    : locale === 'pt'
    ? 'Reservar Réveillon'
    : 'Book a Réveillon gala';

  const eventLd = {
    '@context': 'https://schema.org',
    '@type': event.slug === 'carnaval' ? 'Festival' : 'Event',
    name: pick(event.name, locale),
    description: pick(event.metaDescription, locale),
    startDate: event.schema.startDate,
    endDate: event.schema.endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    inLanguage: htmlLang(locale),
    location: {
      '@type': 'Place',
      name: event.schema.location,
      address: { '@type': 'PostalAddress', addressLocality: 'Rio de Janeiro', addressCountry: 'BR' },
    },
    image: event.photo?.url ?? `${SITE.url}${event.hero}`,
    url: absoluteUrl(locale, event.slug),
    organizer: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    offers: {
      '@type': 'Offer',
      url: `${SITE.url}/go/${goSlug}`,
      priceCurrency: 'BRL',
      price: isCarnaval ? '250' : '200',
      availability: 'https://schema.org/InStock',
      validFrom: '2026-08-01',
    },
  };

  return (
    <article>
      <JsonLd data={eventLd} />
      <PageHero
        locale={locale}
        crumbs={[{ label: pick(event.nav, locale) }]}
        icon={event.icon}
        meta={pick(event.dateLabel, locale)}
        title={pick(event.name, locale)}
        lede={pick(event.lede, locale)}
        image={event.hero}
        photo={event.photo}
      />

      <div className="container-rio py-14">
        <div className="flex flex-col gap-6 rounded-2xl border border-ink/10 bg-cloud p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">{pick(event.nav, locale)}</p>
            <p className="mt-2 font-display text-xl font-semibold">{pick(event.dateLabel, locale)}</p>
          </div>
          <div className="flex flex-col items-start gap-4 sm:items-end">
            <Countdown to={event.countdownTo} locale={locale} />
            <a href={assetPath(`/go/${goSlug}`)} rel="sponsored nofollow" className="btn-vip">
              {buyLabel} →
            </a>
          </div>
        </div>

        <div className="mt-12 max-w-2xl space-y-5 text-lg prose-rio">
          {event.intro.map((p, i) => (
            <p key={i}>{pick(p, locale)}</p>
          ))}
        </div>

        <div className="mt-14">
          <Sections sections={event.sections} locale={locale} />
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold sm:text-3xl">{t('label.faq', locale)}</h2>
          <div className="mt-6">
            <FAQAccordion faqs={event.faqs} locale={locale} />
          </div>
        </section>

        <div className="mt-14 flex flex-wrap gap-3">
          <Link href={`${home}/onde-ficar`} className="btn-dark">{t('nav.stay', locale)} →</Link>
          <Link href={`${home}/vip`} className="btn-vip">{t('cta.concierge', locale)} →</Link>
        </div>
      </div>
    </article>
  );
}
