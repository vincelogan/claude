'use client';

import { useEffect, useState } from 'react';
import { t } from '@/lib/i18n';
import type { Locale } from '@/lib/site';

function diff(target: number) {
  const ms = target - Date.now();
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

export function Countdown({ to, locale, light = false }: { to: string; locale: Locale; light?: boolean }) {
  const target = new Date(to).getTime();
  const [time, setTime] = useState<ReturnType<typeof diff>>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(diff(target));
    const id = setInterval(() => setTime(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  // Stable placeholder before hydration to avoid mismatch.
  if (!mounted) return <div className="h-[60px]" aria-hidden />;

  if (!time) {
    return (
      <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${light ? 'bg-white/15 text-white' : 'bg-coral/10 text-coral'}`}>
        🔴 {t('countdown.live', locale)}
      </span>
    );
  }

  const units: [number, string][] = [
    [time.days, t('countdown.days', locale)],
    [time.hours, t('countdown.hours', locale)],
    [time.minutes, t('countdown.minutes', locale)],
    [time.seconds, t('countdown.seconds', locale)],
  ];

  return (
    <div className="flex gap-2.5" role="timer" aria-live="off">
      {units.map(([value, label], i) => (
        <div
          key={i}
          className={`flex min-w-[58px] flex-col items-center rounded-xl px-3 py-2 ${light ? 'bg-white/10 text-white' : 'bg-mata text-white'}`}
        >
          <span className="font-display text-2xl font-semibold tabular-nums leading-none">
            {String(value).padStart(2, '0')}
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-wider opacity-70">{label}</span>
        </div>
      ))}
    </div>
  );
}
