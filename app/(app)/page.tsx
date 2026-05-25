import Link from "next/link";
import { format, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarClock, Star, UserPlus } from "lucide-react";
import { listContacts, countBySphere } from "@/lib/db/contacts";
import { listUpcomingFollowUps } from "@/lib/db/interactions";
import { SPHERE_META, SPHERE_SLUGS } from "@/lib/spheres";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [counts, favorites, followUps] = await Promise.all([
    countBySphere(),
    listContacts({ favorite: true }),
    listUpcomingFollowUps(5),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Link href="/contatos/novo" className="btn-primary"><UserPlus size={16} /> Novo contato</Link>
      </div>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {SPHERE_SLUGS.map((s) => (
          <Link
            key={s}
            href={`/contatos?sphere=${s}`}
            className="card transition hover:shadow-md"
            style={{ borderTop: `3px solid ${SPHERE_META[s].color}` }}
          >
            <div className="text-xs uppercase tracking-wide text-neutral-500">{SPHERE_META[s].name}</div>
            <div className="mt-1 text-3xl font-semibold">{counts[s] ?? 0}</div>
            <div className="mt-1 text-xs text-neutral-500">contatos vinculados</div>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <CalendarClock size={16} /> Próximos follow-ups
          </div>
          {followUps.length === 0 && (
            <p className="text-sm text-neutral-500">Nada agendado.</p>
          )}
          <ul className="divide-y divide-[var(--border)]">
            {followUps.map((f) => {
              const late = f.follow_up_at && isPast(new Date(f.follow_up_at));
              return (
                <li key={f.id} className="flex items-center justify-between py-2 text-sm">
                  <Link href={`/contatos/${f.contacts?.id}`} className="font-medium hover:underline">
                    {f.contacts?.name}
                  </Link>
                  <span className={late ? "text-red-600" : "text-neutral-500"}>
                    {format(new Date(f.follow_up_at!), "dd MMM, HH:mm", { locale: ptBR })}
                  </span>
                </li>
              );
            })}
          </ul>
          <Link href="/agenda" className="mt-3 inline-block text-sm text-neutral-600 hover:underline">
            Ver agenda completa →
          </Link>
        </div>

        <div className="card">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Star size={16} className="text-amber-500" /> Favoritos
          </div>
          {favorites.length === 0 && <p className="text-sm text-neutral-500">Nenhum favorito ainda.</p>}
          <ul className="divide-y divide-[var(--border)]">
            {favorites.slice(0, 8).map((c) => (
              <li key={c.id} className="flex items-center justify-between py-2 text-sm">
                <Link href={`/contatos/${c.id}`} className="font-medium hover:underline">{c.name}</Link>
                <span className="text-neutral-500">{c.company_name ?? (c.kind === "company" ? "Empresa" : "")}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
