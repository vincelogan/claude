import { assetPath } from '@/lib/asset';
import type { Locale } from '@/lib/site';

// Renders official-site / ticket / booking buttons for an entity.
// - ticketUrl/officialUrl are official (rel="noopener"), opened in a new tab.
// - bookingSlug routes through the /go affiliate layer (rel="sponsored nofollow").
export function EntityLinks({
  locale,
  officialUrl,
  ticketUrl,
  bookingSlug,
  className = '',
}: {
  locale: Locale;
  officialUrl?: string;
  ticketUrl?: string;
  bookingSlug?: string;
  className?: string;
}) {
  const t = {
    ticket: locale === 'pt' ? 'Comprar ingresso' : 'Buy tickets',
    book: locale === 'pt' ? 'Reservar' : 'Book',
    official: locale === 'pt' ? 'Site oficial' : 'Official site',
  };
  if (!officialUrl && !ticketUrl && !bookingSlug) return null;
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {ticketUrl && (
        <a href={ticketUrl} target="_blank" rel="noopener noreferrer" className="btn-vip">
          🎟️ {t.ticket} →
        </a>
      )}
      {bookingSlug && (
        <a href={assetPath(`/go/${bookingSlug}`)} rel="sponsored nofollow" className="btn-vip">
          {t.book} →
        </a>
      )}
      {officialUrl && (
        <a href={officialUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
          {t.official} ↗
        </a>
      )}
    </div>
  );
}
