import type { Metadata } from 'next';
import { NEIGHBORHOODS } from '@/content';
import { PageHero } from '@/components/PageHero';
import { NeighborhoodCard } from '@/components/Cards';
import { t, type Localized, pick } from '@/lib/i18n';
import { SITE, isLocale, type Locale } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';

const title: Localized = { pt: 'Onde se hospedar no Rio', en: 'Where to stay in Rio' };
const lede: Localized = {
  pt: 'O bairro define sua viagem. Veja o melhor de cada um — com o trade-off honesto.',
  en: 'Your neighborhood shapes the whole trip. The best of each — with the honest trade-off.',
};

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = (isLocale(params.locale) ? params.locale : SITE.defaultLocale) as Locale;
  return buildMetadata({
    locale,
    path: 'onde-ficar',
    title: locale === 'pt' ? 'Onde ficar no Rio: melhores bairros | Rio.vip' : 'Where to Stay in Rio: Best Neighborhoods | Rio.vip',
    description:
      locale === 'pt'
        ? 'Ipanema, Leblon, Copacabana, Botafogo, Santa Teresa e Barra comparados — com o trade-off honesto de cada bairro para escolher onde ficar no Rio.'
        : 'Ipanema, Leblon, Copacabana, Botafogo, Santa Teresa and Barra compared — with each neighborhood’s honest trade-off to choose where to stay in Rio.',
    keywords: ['onde ficar no rio', 'where to stay in rio', 'melhores bairros rio', 'best neighborhoods rio'],
  });
}

export default function OndeFicarHub({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: t('nav.stay', locale) }]}
        icon="🏨"
        title={pick(title, locale)}
        lede={pick(lede, locale)}
        image="/img/stay.svg"
      />
      <div className="container-rio py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {NEIGHBORHOODS.map((n) => (
            <NeighborhoodCard key={n.slug} n={n} locale={locale} />
          ))}
        </div>
      </div>
    </>
  );
}
