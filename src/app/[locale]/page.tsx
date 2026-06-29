import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { EVENTS, NEIGHBORHOODS, ATTRACTIONS, EAT_SECTIONS, ESSENTIALS, FAQS, VIP_SECTIONS } from '@/content';
import { EventCard, NeighborhoodCard, AttractionCard, EssentialCard, ItemCard } from '@/components/Cards';
import { SectionHeader } from '@/components/Section';
import { WaveDivider } from '@/components/WaveDivider';
import { FAQAccordion } from '@/components/FAQAccordion';
import { Newsletter } from '@/components/Newsletter';
import { JsonLd } from '@/components/JsonLd';
import { t, pick, type Localized } from '@/lib/i18n';
import { SITE, isLocale, type Locale } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';
import { assetPath } from '@/lib/asset';

const HERO = '/img/hero.svg';

const heroH1: Localized = {
  pt: 'O melhor do Rio, num só lugar.',
  en: 'The best of Rio, in one place.',
};
const heroSub: Localized = {
  pt: 'Carnaval, Réveillon, praias, hospedagem, gastronomia e experiências exclusivas — com tudo o que você precisa saber antes de chegar.',
  en: 'Carnival, New Year’s, beaches, hotels, food and exclusive experiences — plus everything you need to know before you land.',
};

const chips: { href: string; label: Localized }[] = [
  { href: 'carnaval', label: { pt: 'Carnaval', en: 'Carnival' } },
  { href: 'reveillon', label: { pt: 'Réveillon', en: 'New Year’s' } },
  { href: 'o-que-fazer/cristo-redentor', label: { pt: 'Cristo Redentor', en: 'Christ the Redeemer' } },
  { href: 'o-que-fazer/pao-de-acucar', label: { pt: 'Pão de Açúcar', en: 'Sugarloaf' } },
  { href: 'onde-ficar', label: { pt: 'Onde ficar', en: 'Where to stay' } },
  { href: 'vip', label: { pt: 'VIP', en: 'VIP' } },
];

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = (isLocale(params.locale) ? params.locale : SITE.defaultLocale) as Locale;
  return buildMetadata({
    locale,
    title:
      locale === 'pt'
        ? 'Rio de Janeiro: guia completo 2026 | riodejaneiro.vip'
        : 'Rio de Janeiro Travel Guide 2026 | riodejaneiro.vip',
    description: SITE.description[locale],
    keywords: [
      'o que fazer no rio de janeiro',
      'things to do in rio de janeiro',
      'is rio de janeiro safe',
      'rio carnival 2027',
      'réveillon copacabana',
      'onde ficar no rio',
    ],
  });
}

export default function Home({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  const home = `/${locale}`;

  // Onde comer mosaic — 4 fine dining + 1 historic classic.
  const fine = EAT_SECTIONS.find((s) => s.id === 'alta-gastronomia')!.items;
  const classic = EAT_SECTIONS.find((s) => s.id === 'classicos')!.items[0];
  const eatMosaic = [...fine, classic];

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: pick(f.q, locale),
      acceptedAnswer: { '@type': 'Answer', text: pick(f.a, locale) },
    })),
  };

  return (
    <>
      <JsonLd data={faqLd} />

      {/* 1. HERO */}
      <section className="relative isolate overflow-hidden bg-mata text-white">
        <Image src={assetPath(HERO)} alt="" fill priority sizes="100vw" className="object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-mata/80 via-mata/55 to-mata" />
        <div className="container-rio relative py-24 sm:py-32 lg:py-40">
          <div className="max-w-3xl animate-fade-up">
            <span className="eyebrow !text-amber-soft before:!bg-amber-soft">riodejaneiro.vip</span>
            <h1 className="mt-5 font-display font-semibold leading-[1.04]" style={{ fontSize: 'clamp(2.8rem,6vw,5.5rem)' }}>
              {pick(heroH1, locale)}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/75">{pick(heroSub, locale)}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`${home}/o-que-fazer`} className="btn-vip">{t('cta.explore', locale)} →</Link>
              <Link href={`${home}/planejar`} className="btn-ghost-light">{t('cta.plan', locale)}</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {chips.map((c) => (
                <Link
                  key={c.href}
                  href={`${home}/${c.href}`}
                  className="rounded-full border border-white/25 px-3.5 py-1.5 text-sm text-white/85 transition hover:border-amber-soft hover:bg-white/10"
                >
                  {pick(c.label, locale)}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <WaveDivider className="absolute bottom-0 left-0 h-6 w-full text-amber-soft" />
      </section>

      {/* 2. ESSENTIALS */}
      <section className="bg-sand">
        <div className="container-rio py-12">
          <p className="eyebrow mb-5">{t('home.essentialsEyebrow', locale)}</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ESSENTIALS.map((e) => (
              <EssentialCard
                key={e.id}
                icon={e.icon}
                title={pick(e.title, locale)}
                blurb={pick(e.blurb, locale)}
                href={`${home}/planejar#${e.id}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED EVENTS */}
      <section className="bg-mata text-white">
        <div className="container-rio py-20 sm:py-24">
          <SectionHeader light eyebrow={t('home.eventsEyebrow', locale)} title={t('home.eventsTitle', locale)} />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {EVENTS.map((e) => (
              <EventCard key={e.slug} event={e} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. ONDE FICAR */}
      <section className="container-rio py-20 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader eyebrow={t('home.stayEyebrow', locale)} title={t('home.stayTitle', locale)} lead={t('home.stayLead', locale)} />
          <Link href={`${home}/onde-ficar`} className="btn-outline">{t('cta.seeNeighborhoods', locale)} →</Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {NEIGHBORHOODS.map((n) => (
            <NeighborhoodCard key={n.slug} n={n} locale={locale} />
          ))}
        </div>
      </section>

      {/* 5. O QUE FAZER */}
      <section className="bg-cloud">
        <div className="container-rio py-20 sm:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeader eyebrow={t('home.doEyebrow', locale)} title={t('home.doTitle', locale)} />
            <Link href={`${home}/o-que-fazer`} className="btn-outline">{t('cta.seeThingsToDo', locale)} →</Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {ATTRACTIONS.map((a) => (
              <AttractionCard key={a.slug} a={a} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. ONDE COMER */}
      <section className="container-rio py-20 sm:py-24">
        <SectionHeader eyebrow={t('home.eatEyebrow', locale)} title={t('home.eatTitle', locale)} />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {eatMosaic.map((item) => (
            <ItemCard key={item.name} item={item} locale={locale} />
          ))}
          <Link
            href={`${home}/onde-comer`}
            className="flex items-center justify-center rounded-2xl border border-dashed border-ink/25 p-5 text-sm font-semibold text-mata transition hover:border-amber hover:bg-cloud"
          >
            {t('cta.viewAll', locale)} →
          </Link>
        </div>
      </section>

      {/* 7. VIP BAND */}
      <section className="relative overflow-hidden bg-mata text-white">
        <WaveDivider className="absolute top-0 left-0 h-6 w-full text-amber-soft" flip />
        <div className="container-rio py-20 sm:py-24">
          <SectionHeader light eyebrow={t('home.vipEyebrow', locale)} title={t('home.vipTitle', locale)} lead={t('home.vipLead', locale)} />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {VIP_SECTIONS.map((s) => (
              <div key={s.id} className="rounded-2xl border border-white/15 bg-white/5 p-6">
                <h3 className="font-display text-xl font-semibold text-amber-soft">{pick(s.title, locale)}</h3>
                <ul className="mt-4 space-y-3">
                  {s.items.map((item) => (
                    <li key={item.name} className="text-sm">
                      <span className="font-semibold text-white">{item.name}</span>
                      <span className="block text-white/65">{pick(item.blurb, locale)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href={`${home}/vip`} className="btn-vip">{t('cta.requestConcierge', locale)} →</Link>
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="container-rio py-20 sm:py-24">
        <SectionHeader eyebrow={t('home.faqEyebrow', locale)} title={t('home.faqTitle', locale)} className="mb-10" />
        <FAQAccordion faqs={FAQS} locale={locale} />
        <div className="mt-8">
          <Link href={`${home}/planejar`} className="btn-outline">{t('cta.plan', locale)} →</Link>
        </div>
      </section>

      {/* 9. NEWSLETTER */}
      <section className="bg-sand">
        <div className="container-rio flex flex-col items-center gap-6 py-16 text-center">
          <SectionHeader title={t('home.newsletterTitle', locale)} lead={t('home.newsletterLead', locale)} className="!max-w-xl text-center [&>*]:mx-auto" />
          <Newsletter locale={locale} variant="light" />
        </div>
      </section>
    </>
  );
}
