import Link from 'next/link';
import { Logo } from './Logo';
import { EXPERIENCE_NAV, PLAN_NAV } from '@/lib/nav';
import { t, pick } from '@/lib/i18n';
import { SITE, type Locale } from '@/lib/site';

export function Footer({ locale }: { locale: Locale }) {
  const year = 2026; // build-time constant (Date APIs unavailable in some build contexts)
  return (
    <footer className="mt-24 bg-night text-white">
      <div className="container-rio grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo locale={locale} variant="light" />
          <p className="mt-5 text-sm leading-relaxed text-white/60">{t('footer.tagline', locale)}</p>
          <div className="mt-6 flex gap-3">
            <Social href={SITE.social.instagram} label="Instagram">◎</Social>
            <Social href={SITE.social.youtube} label="YouTube">▷</Social>
            <Social href={SITE.social.tiktok} label="TikTok">♪</Social>
          </div>
        </div>

        <FooterCol title={t('footer.guides', locale)} links={EXPERIENCE_NAV} locale={locale} />
        <FooterCol title={t('footer.plan', locale)} links={PLAN_NAV} locale={locale} />
      </div>

      <div className="border-t border-white/10">
        <div className="container-rio flex flex-col gap-3 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {SITE.domain}. {t('footer.rights', locale)}</p>
          <p className="max-w-xl sm:text-right">{t('footer.disclaimer', locale)}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
  locale,
}: {
  title: string;
  links: typeof EXPERIENCE_NAV;
  locale: Locale;
}) {
  return (
    <div>
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold">{title}</p>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.slug}>
            <Link
              href={`/${locale}/${l.slug}`}
              className="text-sm text-white/70 transition hover:text-white"
            >
              {pick(l.label, locale)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Social({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition hover:border-gold hover:text-gold"
    >
      {children}
    </a>
  );
}
