"use client";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarPlus, CheckCircle2, MessageSquare, Phone, Mail, Users, Calendar, MoreHorizontal } from "lucide-react";
import type { Interaction, InteractionChannel } from "@/lib/types";
import { createInteractionAction, markFollowUpDoneAction } from "@/app/actions/interactions";

const CHANNEL_LABEL: Record<InteractionChannel, { label: string; icon: any }> = {
  meeting: { label: "Reunião", icon: Users },
  call:    { label: "Ligação", icon: Phone },
  message: { label: "Mensagem", icon: MessageSquare },
  email:   { label: "Email", icon: Mail },
  event:   { label: "Evento", icon: Calendar },
  other:   { label: "Outro", icon: MoreHorizontal },
};

export function NewInteractionForm({ contactId }: { contactId: string }) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn-outline">
        <CalendarPlus size={14} /> Registrar interação
      </button>
    );
  }
  return (
    <form action={createInteractionAction} className="card space-y-3">
      <input type="hidden" name="contact_id" value={contactId} />
      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <label className="label">Quando</label>
          <input type="datetime-local" name="occurred_at" defaultValue={format(new Date(), "yyyy-MM-dd'T'HH:mm")} className="input" required />
        </div>
        <div>
          <label className="label">Canal</label>
          <select name="channel" className="select" defaultValue="meeting">
            {Object.entries(CHANNEL_LABEL).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Follow-up em (opcional)</label>
          <input type="datetime-local" name="follow_up_at" className="input" />
        </div>
      </div>
      <div>
        <label className="label">Resumo</label>
        <textarea name="summary" required className="input min-h-[80px]" placeholder="O que rolou, próximos passos..." />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => setOpen(false)} className="btn-ghost">Cancelar</button>
        <button type="submit" className="btn-primary">Salvar</button>
      </div>
    </form>
  );
}

export function InteractionsTimeline({ items }: { items: Interaction[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-neutral-500">Nenhuma interação registrada ainda.</p>;
  }
  return (
    <ol className="relative space-y-4 border-l border-[var(--border)] pl-4">
      {items.map((it) => {
        const Channel = CHANNEL_LABEL[it.channel];
        const Icon = Channel.icon;
        return (
          <li key={it.id} className="relative">
            <span className="absolute -left-[22px] grid h-4 w-4 place-items-center rounded-full border border-[var(--border)] bg-[var(--card)]">
              <Icon size={10} />
            </span>
            <div className="text-xs text-neutral-500">
              {format(new Date(it.occurred_at), "dd MMM yyyy, HH:mm", { locale: ptBR })} · {Channel.label}
            </div>
            <div className="text-sm whitespace-pre-wrap">{it.summary}</div>
            {it.follow_up_at && (
              <div className={`mt-1 flex items-center gap-1 text-xs ${it.follow_up_done ? "text-emerald-600" : "text-amber-600"}`}>
                <CheckCircle2 size={12} />
                {it.follow_up_done ? "Follow-up concluído" :
                  `Follow-up em ${format(new Date(it.follow_up_at), "dd MMM yyyy, HH:mm", { locale: ptBR })}`}
                {!it.follow_up_done && (
                  <form action={markFollowUpDoneAction}>
                    <input type="hidden" name="id" value={it.id} />
                    <input type="hidden" name="contact_id" value={it.contact_id} />
                    <button type="submit" className="ml-2 underline">marcar como feito</button>
                  </form>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
