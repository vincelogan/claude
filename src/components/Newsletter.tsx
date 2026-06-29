'use client';

import { useState } from 'react';
import { t } from '@/lib/i18n';
import type { Locale } from '@/lib/site';

export function Newsletter({ locale, variant = 'dark' }: { locale: Locale; variant?: 'dark' | 'light' }) {
  const [done, setDone] = useState(false);
  const light = variant === 'light';

  if (done) {
    return <p className={`text-sm font-semibold ${light ? 'text-mata' : 'text-amber-soft'}`}>{t('form.subscribed', locale)}</p>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
      className="flex w-full max-w-sm gap-2"
    >
      <label className="sr-only" htmlFor="nl-email">
        {t('form.email', locale)}
      </label>
      <input
        id="nl-email"
        type="email"
        required
        placeholder={t('form.newsletterPlaceholder', locale)}
        className={`min-w-0 flex-1 rounded-full border px-4 py-2.5 text-sm outline-none transition ${
          light
            ? 'border-ink/15 bg-white text-ink placeholder:text-ink/40 focus:border-amber'
            : 'border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:border-amber-soft'
        }`}
      />
      <button type="submit" className="btn-vip shrink-0 !px-5 !py-2.5 text-sm">
        {t('form.subscribe', locale)}
      </button>
    </form>
  );
}
