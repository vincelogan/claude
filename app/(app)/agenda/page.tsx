import Link from "next/link";
import { format, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarClock, CheckCircle2 } from "lucide-react";
import { listUpcomingFollowUps } from "@/lib/db/interactions";
import { markFollowUpDoneAction } from "@/app/actions/interactions";

export const dynamic = "force-dynamic";

export default async function AgendaPage() {
  const items = await listUpcomingFollowUps();
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Agenda</h1>
        <p className="text-sm text-neutral-500">Follow-ups pendentes ordenados por data.</p>
      </div>

      <div className="card divide-y divide-[var(--border)] p-0">
        {items.length === 0 && (
          <div className="p-6 text-center text-sm text-neutral-500">Nada pendente.</div>
        )}
        {items.map((it) => {
          const late = it.follow_up_at && isPast(new Date(it.follow_up_at));
          return (
            <div key={it.id} className="flex flex-wrap items-center gap-3 p-4">
              <CalendarClock size={16} className={late ? "text-red-600" : "text-neutral-400"} />
              <div className="flex-1 min-w-0">
                <Link href={`/contatos/${it.contacts?.id}`} className="font-medium hover:underline">
                  {it.contacts?.name}
                </Link>
                <div className="text-sm text-neutral-600 whitespace-pre-wrap">{it.summary}</div>
              </div>
              <div className={`text-sm ${late ? "text-red-600 font-medium" : "text-neutral-600"}`}>
                {format(new Date(it.follow_up_at!), "dd MMM yyyy, HH:mm", { locale: ptBR })}
                {late && " · atrasado"}
              </div>
              <form action={markFollowUpDoneAction}>
                <input type="hidden" name="id" value={it.id} />
                <input type="hidden" name="contact_id" value={it.contacts?.id ?? ""} />
                <button type="submit" className="btn-outline text-emerald-700">
                  <CheckCircle2 size={14} /> Concluir
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
