import type { Metadata } from 'next';
import Link from 'next/link';
import { EAT_INTRO, EAT_SECTIONS, EAT_FAQS } from '@/content';
import { PageHero } from '@/components/PageHero';
import { Sections } from '@/components/Sections';
import { FAQAccordion } from '@/components/FAQAccordion';
import { JsonLd } from '@/components/JsonLd';
import { t, pick, type Localized } from '@/lib/i18n';
import { SITE, isLocale, type Locale } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';

const title: Localized = { pt: 'Onde comer no Rio', en: 'Where to eat in Rio' };
const lede: Localized = {
  pt: 'Do coco gelado na praia ao menu-degustação duas estrelas Michelin.',
  en: 'From an icy coconut on the beach to a two-Michelin-star tasting menu.',
};

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = (isLocale(params.locale) ? params.locale : SITE.defaultLocale) as Locale;
  return buildMetadata({
    locale,
    path: 'onde-comer',
    title: locale === 'pt' ? 'Onde comer no Rio: do boteco à Michelin | Rio.vip' : 'Where to Eat in Rio: Botecos to Michelin | Rio.vip',
    description:
      locale === 'pt'
        ? 'Onde comer no Rio: pratos cariocas, botecos e churrascarias clássicas e a alta gastronomia estrelada Michelin (Lasai, Oteque).'
        : 'Where to eat in Rio: carioca dishes, classic botecos and churrascarias, and Michelin-starred fine dining (Lasai, Oteque).',
    keywords: ['onde comer no rio', 'where to eat in rio', 'feijoada', 'rio michelin restaurants'],
  });
}

export default function OndeComer({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  const home = `/${locale}`;

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: EAT_FAQS.map((f) => ({
      '@type': 'Question',
      name: pick(f.q, locale),
      acceptedAnswer: { '@type': 'Answer', text: pick(f.a, locale) },
    })),
  };

  return (
    <article>
      <JsonLd data={faqLd} />
      <PageHero
        locale={locale}
        crumbs={[{ label: t('nav.eat', locale) }]}
        icon="🍽️"
        title={pick(title, locale)}
        lede={pick(lede, locale)}
        image="/img/eat.svg"
      />
      <div className="container-rio py-16">
        <p className="max-w-2xl text-lg text-ink/75">{pick(EAT_INTRO, locale)}</p>
        <div className="mt-14">
          <Sections sections={EAT_SECTIONS} locale={locale} />
        </div>
        <div className="mt-16">
          <h2 className="text-2xl font-semibold">{t('label.faq', locale)}</h2>
          <div className="mt-6">
            <FAQAccordion faqs={EAT_FAQS} locale={locale} />
          </div>
        </div>
        <div className="mt-12">
          <Link href={`${home}/vip`} className="btn-vip">{t('cta.concierge', locale)} →</Link>
        </div>
      </div>
    </article>
  );
}
