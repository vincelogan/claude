import type { Metadata } from 'next';
import { ATTRACTIONS, ATTRACTION_CATEGORIES } from '@/content';
import { PageHero } from '@/components/PageHero';
import { AttractionCard } from '@/components/Cards';
import { t, pick, type Localized } from '@/lib/i18n';
import { SITE, isLocale, type Locale } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';

const title: Localized = { pt: 'O que fazer no Rio de Janeiro', en: 'Things to do in Rio de Janeiro' };
const lede: Localized = {
  pt: 'Dos ícones imperdíveis às experiências que poucos conhecem — organizado por categoria.',
  en: 'From the must-see icons to the experiences few people find — organised by category.',
};

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = (isLocale(params.locale) ? params.locale : SITE.defaultLocale) as Locale;
  return buildMetadata({
    locale,
    path: 'o-que-fazer',
    title: locale === 'pt' ? 'O que fazer no Rio de Janeiro | Rio.vip' : 'Things to Do in Rio de Janeiro | Rio.vip',
    description:
      locale === 'pt'
        ? 'O que fazer no Rio: Cristo Redentor, Pão de Açúcar, praias, Floresta da Tijuca, Selarón, Maracanã, samba na Pedra do Sal e mais.'
        : 'Things to do in Rio: Christ the Redeemer, Sugarloaf, beaches, Tijuca Forest, Selarón, Maracanã, samba at Pedra do Sal and more.',
    keywords: ['o que fazer no rio de janeiro', 'things to do in rio de janeiro', 'cristo redentor', 'pão de açúcar'],
  });
}

export default function OQueFazerHub({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: t('nav.do', locale) }]}
        icon="🏄"
        title={pick(title, locale)}
        lede={pick(lede, locale)}
        image="/img/things-to-do.svg"
      />
      <div className="container-rio py-16">
        {ATTRACTION_CATEGORIES.map((cat) => {
          const items = ATTRACTIONS.filter((a) => a.category === cat.key);
          if (items.length === 0) return null;
          return (
            <section key={cat.key} className="mb-14">
              <h2 className="flex items-center gap-2 text-2xl font-semibold">
                <span aria-hidden>{cat.icon}</span> {pick(cat.label, locale)}
              </h2>
              <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {items.map((a) => (
                  <AttractionCard key={a.slug} a={a} locale={locale} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
