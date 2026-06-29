import Link from 'next/link';
import { Logo } from './Logo';
import { Newsletter } from './Newsletter';
import { WaveDivider } from './WaveDivider';
import { t, pick, type Localized } from '@/lib/i18n';
import { SITE, type Locale } from '@/lib/site';

const cols: { title: { pt: string; en: string }; links: { href: string; label: Localized }[] }[] = [
  {
    title: { pt: 'Explorar', en: 'Explore' },
    links: [
      { href: 'carnaval', label: { pt: 'Carnaval 2027', en: 'Carnival 2027' } },
      { href: 'reveillon', label: { pt: 'Réveillon', en: 'New Year’s Eve' } },
      { href: 'o-que-fazer', label: { pt: 'O que fazer', en: 'Things to do' } },
      { href: 'onde-comer', label: { pt: 'Onde comer', en: 'Where to eat' } },
    ],
  },
  {
    title: { pt: 'Viagem', en: 'Travel' },
    links: [
      { href: 'onde-ficar', label: { pt: 'Onde ficar', en: 'Where to stay' } },
      { href: 'planejar#seguranca', label: { pt: 'É seguro?', en: 'Is it safe?' } },
      { href: 'planejar#como-chegar', label: { pt: 'Como chegar', en: 'How to get here' } },
      { href: 'planejar#dinheiro-epoca', label: { pt: 'Melhor época', en: 'Best time' } },
    ],
  },
  {
    title: { pt: 'Premium', en: 'Premium' },
    links: [
      { href: 'vip', label: { pt: 'Concierge VIP', en: 'VIP Concierge' } },
      { href: 'vip#atracoes-vip', label: { pt: 'Atrações VIP', en: 'VIP attractions' } },
      { href: 'vip#transporte-vip', label: { pt: 'Transporte VIP', en: 'VIP transport' } },
    ],
  },
  {
    title: { pt: 'Sobre', en: 'About' },
    links: [
      { href: 'sobre', label: { pt: 'Sobre o projeto', en: 'About the project' } },
      { href: 'planejar', label: { pt: 'Planejar a viagem', en: 'Plan your trip' } },
    ],
  },
];

export function Footer({ locale }: { locale: Locale }) {
  const home = `/${locale}`;
  return (
    <footer className="mt-24 bg-mata text-white">
      <WaveDivider className="h-8 w-full text-amber-soft" />
      <div className="container-rio grid gap-12 py-16 lg:grid-cols-[1.3fr_2fr]">
        <div className="max-w-sm">
          <Logo locale={locale} variant="light" />
          <p className="mt-5 text-sm leading-relaxed text-white/60">{pick(SITE.tagline, locale)}</p>
          <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-amber-soft">
            {t('home.newsletterTitle', locale)}
          </p>
          <p className="mb-3 mt-1 text-sm text-white/55">{t('home.newsletterLead', locale)}</p>
          <Newsletter locale={locale} />
          <div className="mt-6 flex gap-3">
            <Social href={SITE.social.instagram} label="Instagram">◎</Social>
            <Social href={SITE.social.youtube} label="YouTube">▷</Social>
            <Social href={SITE.social.tiktok} label="TikTok">♪</Social>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {cols.map((col) => (
            <div key={col.title.en}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-amber-soft">
                {pick(col.title, locale)}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={`${home}/${link.href}`} className="text-sm text-white/70 transition hover:text-white">
                      {pick(link.label, locale)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-rio flex flex-col gap-3 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {SITE.updatedYear} {SITE.domain}. {t('footer.curated', locale)}</p>
          <p className="max-w-xl sm:text-right">{t('footer.disclaimer', locale)}</p>
        </div>
      </div>
    </footer>
  );
}

function Social({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition hover:border-amber-soft hover:text-amber-soft"
    >
      {children}
    </a>
  );
}
