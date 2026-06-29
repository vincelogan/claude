'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { NAV, type NavGroup } from '@/lib/nav';
import { t, pick } from '@/lib/i18n';
import type { Locale } from '@/lib/site';

export function Header({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || `/${locale}`;
  const other: Locale = locale === 'pt' ? 'en' : 'pt';
  const otherHref = pathname.replace(/^\/(pt|en)(?=\/|$)/, `/${other}`);
  const home = `/${locale}`;
  const l = (href: string) => `${home}/${href}`;

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-bone/85 backdrop-blur-md">
      <div className="container-rio flex h-16 items-center justify-between gap-4">
        <Link href={home} onClick={() => setOpen(false)} className="shrink-0">
          <Logo locale={locale} />
        </Link>

        {/* Desktop mega-menu */}
        <nav className="hidden items-center lg:flex" aria-label="Primary">
          {NAV.map((group) => (
            <MegaItem key={group.id} group={group} locale={locale} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={otherHref}
            hrefLang={other}
            className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink transition hover:border-ink/40"
          >
            {other === 'pt' ? '🇧🇷 PT' : '🇺🇸 EN'}
          </Link>
          <Link href={l('vip')} className="btn-primary hidden !px-5 !py-2 text-xs sm:inline-flex">
            {t('cta.concierge', locale)}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 lg:hidden"
            aria-label={open ? t('nav.close', locale) : t('nav.menu', locale)}
            aria-expanded={open}
          >
            <span className="text-lg">{open ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-ink/10 bg-bone lg:hidden">
          <div className="container-rio grid gap-2 py-5">
            {NAV.map((group) => (
              <details key={group.id} className="group border-b border-ink/10 pb-2">
                <summary className="flex cursor-pointer list-none items-center justify-between py-2.5 font-display text-lg font-medium">
                  {pick(group.label, locale)}
                  <span className="text-mata transition group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <div className="grid gap-1 pb-2 pl-1">
                  {group.columns.flatMap((c) => c.items).map((item) => (
                    <Link
                      key={item.href}
                      href={l(item.href)}
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-2 py-2 text-sm text-ink/75 transition hover:bg-cloud hover:text-ink"
                    >
                      {pick(item.label, locale)}
                    </Link>
                  ))}
                </div>
              </details>
            ))}
            <Link href={l('vip')} onClick={() => setOpen(false)} className="btn-primary mt-3 w-full">
              {t('cta.concierge', locale)}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function MegaItem({ group, locale }: { group: NavGroup; locale: Locale }) {
  const home = `/${locale}`;
  const multi = group.columns.length > 1;
  return (
    <div className="group relative">
      <Link
        href={`${home}/${group.href}`}
        className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-ink/80 transition hover:bg-ink/5 hover:text-ink"
      >
        {pick(group.label, locale)}
        <span className="text-[10px] text-ink/40">▾</span>
      </Link>
      <div
        className={`invisible absolute left-1/2 top-full z-50 -translate-x-1/2 translate-y-1 rounded-2xl border border-ink/10 bg-cloud p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 ${multi ? 'w-[460px]' : 'w-64'}`}
      >
        <div className={multi ? 'grid grid-cols-2 gap-1' : ''}>
          {group.columns.map((col, ci) => (
            <div key={ci}>
              {col.heading && (
                <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-amber">
                  {pick(col.heading, locale)}
                </p>
              )}
              {col.items.map((item) => (
                <Link
                  key={item.href}
                  href={`${home}/${item.href}`}
                  className="block rounded-xl px-3 py-2 text-sm font-medium text-ink/75 transition hover:bg-sand hover:text-ink"
                >
                  {pick(item.label, locale)}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
