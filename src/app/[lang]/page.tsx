import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { EXPERIENCE_GUIDES, PLAN_GUIDES } from '@/content';
import { CategoryCard } from '@/components/CategoryCard';
import { JsonLd } from '@/components/JsonLd';
import { t, pick, type Localized } from '@/lib/i18n';
import { SITE, isLocale, type Locale } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';
import { assetPath } from '@/lib/asset';

const HERO = '/img/hero.svg';

const heroHeadline: Localized = {
  en: 'Everything best in Rio de Janeiro,',
  pt: 'Tudo de melhor no Rio de Janeiro,',
};
const heroHeadline2: Localized = {
  en: 'in one place.',
  pt: 'em um só lugar.',
};
const heroSub: Localized = {
  en: 'Carnival and Réveillon, the best beaches, where to stay and eat, VIP experiences — plus honest answers on safety and getting here. Your insider key to the Marvelous City.',
  pt: 'Carnaval e Réveillon, as melhores praias, onde se hospedar e comer, experiências VIP — e respostas honestas sobre segurança e como chegar. Sua chave para a Cidade Maravilhosa.',
};

const stats: { value: string; label: Localized }[] = [
  { value: '2M+', label: { en: 'at New Year on Copacabana', pt: 'no Réveillon de Copacabana' } },
  { value: '7', label: { en: 'New Wonder of the World', pt: 'Nova Maravilha do Mundo' } },
  { value: '38°C', label: { en: 'of summer beach weather', pt: 'de verão na praia' } },
];

const seasonal: Localized = {
  en: 'Carnival 2027 runs Feb 5–10 · Réveillon Dec 31',
  pt: 'Carnaval 2027: 5–10 de fev · Réveillon: 31 de dez',
};

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const locale = (isLocale(params.lang) ? params.lang : SITE.defaultLocale) as Locale;
  return buildMetadata({
    locale,
    title: `Rio de Janeiro Travel Guide ${2026} | ${SITE.name}`,
    description: SITE.description[locale],
    keywords: [
      'rio de janeiro travel guide',
      'things to do in rio de janeiro',
      'is rio de janeiro safe',
      'rio carnival 2027',
      'reveillon copacabana',
      'guia rio de janeiro',
    ],
  });
}

export default function Home({ params }: { params: { lang: string } }) {
  const locale = params.lang as Locale;
  const [featured, ...rest] = EXPERIENCE_GUIDES;

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: locale === 'pt' ? 'O Rio de Janeiro é seguro para turistas?' : 'Is Rio de Janeiro safe for tourists?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            locale === 'pt'
              ? 'Sim, com bom senso. Fique na Zona Sul (Ipanema, Leblon, Copacabana, Botafogo), use apps como Uber/99 à noite e leve poucos valores à praia.'
              : 'Yes, with street smarts. Stay in the South Zone (Ipanema, Leblon, Copacabana, Botafogo), use ride apps like Uber/99 at night, and take minimal valuables to the beach.',
        },
      },
      {
        '@type': 'Question',
        name: locale === 'pt' ? 'Quando é o Carnaval do Rio 2027?' : 'When is Rio Carnival 2027?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            locale === 'pt'
              ? 'O Carnaval 2027 vai de 5 a 10 de fevereiro, com os desfiles do Grupo Especial no Sambódromo em 7 e 8 de fevereiro.'
              : 'Carnival 2027 runs February 5–10, with the Special Group samba schools parading at the Sambadrome on February 7 and 8.',
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={faqLd} />

      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-night text-white">
        <Image
          src={assetPath(HERO)}
          alt="Aerial view of Rio de Janeiro with Sugarloaf Mountain and Guanabara Bay"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night/70 via-night/50 to-night" />
        <div className="container-rio relative py-24 sm:py-32 lg:py-40">
          <div className="max-w-3xl animate-fade-up">
            <p className="kicker !text-gold-light">
              <span className="h-px w-8 bg-gold-light" /> riodejaneiro.vip
            </p>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
              {pick(heroHeadline, locale)}<br />
              <span className="text-gradient">{pick(heroHeadline2, locale)}</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              {pick(heroSub, locale)}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href={`/${locale}/sightseeing`} className="btn-gold">
                {t('cta.discover', locale)} →
              </Link>
              <Link href={`/${locale}/vip`} className="btn-ghost">
                💎 {t('nav.plan', locale) === 'Planeje sua viagem' ? 'Experiências VIP' : 'VIP experiences'}
              </Link>
            </div>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/80 ring-1 ring-white/15">
              🎉 {pick(seasonal, locale)}
            </p>
          </div>

          <dl className="mt-16 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/15 pt-8">
            {stats.map((s) => (
              <div key={s.value}>
                <dt className="font-display text-3xl font-semibold text-gold-light sm:text-4xl">{s.value}</dt>
                <dd className="mt-1 text-xs leading-snug text-white/60">{pick(s.label, locale)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-rio py-20 sm:py-24">
        <div className="mb-10 max-w-2xl">
          <p className="kicker">{t('label.highlights', locale)}</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">{t('home.categoriesTitle', locale)}</h2>
          <p className="mt-4 text-night/60">{t('home.categoriesSub', locale)}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <CategoryCard guide={featured} locale={locale} large />
          {rest.map((g) => (
            <CategoryCard key={g.slug} guide={g} locale={locale} />
          ))}
        </div>
      </section>

      {/* PLAN / KNOW BEFORE YOU GO */}
      <section className="bg-white py-20 sm:py-24">
        <div className="container-rio">
          <div className="mb-10 max-w-2xl">
            <p className="kicker">{t('nav.plan', locale)}</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">{t('home.planTitle', locale)}</h2>
            <p className="mt-4 text-night/60">{t('home.planSub', locale)}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PLAN_GUIDES.map((g) => (
              <Link
                key={g.slug}
                href={`/${locale}/${g.slug}`}
                className="group rounded-2xl border border-night/10 bg-sand p-6 transition hover:-translate-y-0.5 hover:border-gold hover:shadow-lg"
              >
                <span className="text-3xl" aria-hidden>{g.icon}</span>
                <h3 className="mt-4 text-lg font-semibold">{pick(g.nav, locale)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-night/60">{pick(g.lede, locale)}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-ocean-deep transition group-hover:translate-x-1">
                  {t('cta.readGuide', locale)} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="container-rio py-16">
        <div className="relative overflow-hidden rounded-3xl bg-night px-8 py-14 text-center text-white sm:px-16 sm:py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-ocean-deep/40 via-transparent to-gold/20" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-semibold sm:text-4xl">
              {locale === 'pt' ? 'Pronto para viver o Rio?' : 'Ready to experience Rio?'}
            </h2>
            <p className="mt-4 text-white/70">
              {locale === 'pt'
                ? 'Comece pelos ícones, depois desça até as experiências VIP que poucos conhecem.'
                : 'Start with the icons, then go deeper into the VIP experiences few travelers find.'}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href={`/${locale}/sightseeing`} className="btn-gold">
                {t('cta.explore', locale)} →
              </Link>
              <Link href={`/${locale}/safety`} className="btn-ghost">
                {pick({ en: 'Is Rio safe?', pt: 'O Rio é seguro?' }, locale)}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
