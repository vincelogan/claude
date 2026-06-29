'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { EXPERIENCE_NAV, PLAN_NAV } from '@/lib/nav';
import { t, pick } from '@/lib/i18n';
import type { Locale } from '@/lib/site';

export function Header({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || `/${locale}`;
  const other: Locale = locale === 'en' ? 'pt' : 'en';

  // Swap the leading locale segment to switch languages, preserving the page.
  const otherHref = pathname.replace(/^\/(en|pt)(?=\/|$)/, `/${other}`);
  const home = `/${locale}`;

  return (
    <header className="sticky top-0 z-50 border-b border-night/10 bg-sand/85 backdrop-blur-md">
      <div className="container-rio flex h-16 items-center justify-between gap-4">
        <Link href={home} className="shrink-0" onClick={() => setOpen(false)}>
          <Logo locale={locale} />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          <DropNav label={t('nav.guides', locale)} links={EXPERIENCE_NAV} locale={locale} />
          <DropNav label={t('nav.plan', locale)} links={PLAN_NAV} locale={locale} />
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={otherHref}
            className="rounded-full border border-night/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-night transition hover:border-night/40"
            hrefLang={other}
          >
            {other === 'pt' ? '🇧🇷 PT' : '🇺🇸 EN'}
          </Link>
          <Link href={`${home}/vip`} className="hidden btn-gold !px-5 !py-2 sm:inline-flex">
            💎 VIP
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-night/15 lg:hidden"
            aria-label={open ? t('nav.close', locale) : t('nav.menu', locale)}
            aria-expanded={open}
          >
            <span className="text-lg">{open ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-night/10 bg-sand lg:hidden">
          <div className="container-rio grid gap-6 py-6">
            <MobileGroup title={t('nav.guides', locale)} links={EXPERIENCE_NAV} locale={locale} onNav={() => setOpen(false)} />
            <MobileGroup title={t('nav.plan', locale)} links={PLAN_NAV} locale={locale} onNav={() => setOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
}

function DropNav({ label, links, locale }: { label: string; links: typeof EXPERIENCE_NAV; locale: Locale }) {
  return (
    <div className="group relative">
      <button className="rounded-full px-4 py-2 text-sm font-semibold text-night/80 transition hover:bg-night/5 hover:text-night">
        {label} <span className="text-xs text-night/40">▾</span>
      </button>
      <div className="invisible absolute left-0 top-full z-50 w-64 translate-y-1 rounded-2xl border border-night/10 bg-white p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        {links.map((l) => (
          <Link
            key={l.slug}
            href={`/${locale}/${l.slug}`}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-night/80 transition hover:bg-sand hover:text-night"
          >
            <span aria-hidden className="text-base">{l.icon}</span>
            {pick(l.label, locale)}
          </Link>
        ))}
      </div>
    </div>
  );
}

function MobileGroup({
  title,
  links,
  locale,
  onNav,
}: {
  title: string;
  links: typeof EXPERIENCE_NAV;
  locale: Locale;
  onNav: () => void;
}) {
  return (
    <div>
      <p className="kicker mb-3">{title}</p>
      <div className="grid grid-cols-2 gap-1">
        {links.map((l) => (
          <Link
            key={l.slug}
            href={`/${locale}/${l.slug}`}
            onClick={onNav}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-night/80 transition hover:bg-white"
          >
            <span aria-hidden className="text-base">{l.icon}</span>
            {pick(l.label, locale)}
          </Link>
        ))}
      </div>
    </div>
  );
}
