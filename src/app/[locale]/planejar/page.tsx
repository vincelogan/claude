import type { Metadata } from 'next';
import Link from 'next/link';
import { ESSENTIALS, PLAN_SECTIONS, FAQS } from '@/content';
import { PageHero } from '@/components/PageHero';
import { Sections } from '@/components/Sections';
import { FAQAccordion } from '@/components/FAQAccordion';
import { JsonLd } from '@/components/JsonLd';
import { t, pick, type Localized } from '@/lib/i18n';
import { SITE, isLocale, type Locale } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';

const title: Localized = { pt: 'Planejar a viagem ao Rio', en: 'Plan your trip to Rio' };
const lede: Localized = {
  pt: 'Respostas honestas e práticas: é seguro, como chegar, como circular, dinheiro e melhor época.',
  en: 'Honest, practical answers: is it safe, how to get here, getting around, money and the best time.',
};

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = (isLocale(params.locale) ? params.locale : SITE.defaultLocale) as Locale;
  return buildMetadata({
    locale,
    path: 'planejar',
    title: locale === 'pt' ? 'Planejar a viagem ao Rio: é seguro, como chegar | Rio.vip' : 'Plan Your Trip to Rio: Is It Safe, How to Get Here | Rio.vip',
    description:
      locale === 'pt'
        ? 'O Rio é seguro? Como chegar e circular? Vistos, dinheiro e melhor época. Tudo o que você precisa saber antes de viajar ao Rio de Janeiro.'
        : 'Is Rio safe? How to get here and around? Visas, money and the best time. Everything to know before you travel to Rio de Janeiro.',
    keywords: ['is rio de janeiro safe', 'o rio é seguro', 'how to get to rio', 'como chegar ao rio', 'brazil visa'],
  });
}

export default function Planejar({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  const home = `/${locale}`;

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
    <article>
      <JsonLd data={faqLd} />
      <PageHero
        locale={locale}
        crumbs={[{ label: t('nav.plan', locale) }]}
        icon="🧭"
        title={pick(title, locale)}
        lede={pick(lede, locale)}
        image="/img/getting-here.svg"
      />
      <div className="container-rio py-16">
        {/* quick jump */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ESSENTIALS.map((e) => (
            <a
              key={e.id}
              href={`#${e.id}`}
              className="flex items-center gap-3 rounded-xl border border-ink/10 bg-cloud px-4 py-3 text-sm font-semibold text-ink transition hover:border-amber"
            >
              <span aria-hidden>{e.icon}</span> {pick(e.title, locale)}
            </a>
          ))}
        </div>

        <div className="mt-14">
          <Sections sections={PLAN_SECTIONS} locale={locale} />
        </div>

        <div id="faq" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-semibold sm:text-3xl">{t('label.faq', locale)}</h2>
          <div className="mt-6">
            <FAQAccordion faqs={FAQS} locale={locale} />
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href={`${home}/onde-ficar`} className="btn-dark">{t('nav.stay', locale)} →</Link>
          <Link href={`${home}/o-que-fazer`} className="btn-outline">{t('nav.do', locale)} →</Link>
        </div>
      </div>
    </article>
  );
}
