'use client';

import { useState } from 'react';
import { t } from '@/lib/i18n';
import { SITE, type Locale } from '@/lib/site';

export function ConciergeForm({ locale }: { locale: Locale }) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-2xl border border-mata/20 bg-mata/5 p-8 text-center">
        <p className="text-3xl" aria-hidden>✅</p>
        <p className="mt-3 font-display text-xl font-semibold text-mata">{t('form.sent', locale)}</p>
      </div>
    );
  }

  const field = 'mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-amber';
  const label = 'text-sm font-semibold text-ink';

  return (
    <form
      // No backend in the MVP: hand off to email. Swap for a Server Action / Resend later.
      action={`mailto:${SITE.email}`}
      method="post"
      encType="text/plain"
      onSubmit={() => setSent(true)}
      className="grid gap-4 rounded-2xl border border-ink/10 bg-cloud p-6 sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={label}>{t('form.name', locale)}</span>
          <input name="name" required className={field} />
        </label>
        <label className="block">
          <span className={label}>{t('form.email', locale)}</span>
          <input name="email" type="email" required className={field} />
        </label>
      </div>
      <label className="block">
        <span className={label}>{t('form.dates', locale)}</span>
        <input name="dates" className={field} placeholder={locale === 'pt' ? 'ex.: 5–13 fev 2027' : 'e.g. Feb 5–13, 2027'} />
      </label>
      <label className="block">
        <span className={label}>{t('form.message', locale)}</span>
        <textarea name="message" rows={4} required className={field} />
      </label>
      <button type="submit" className="btn-vip w-full sm:w-auto sm:justify-self-start">
        {t('form.send', locale)}
      </button>
    </form>
  );
}
