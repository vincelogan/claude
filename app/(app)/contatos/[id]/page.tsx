import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, Star, Trash2, Building2, User, Mail, Phone, Globe, MapPin } from "lucide-react";
import { getContact } from "@/lib/db/contacts";
import { listInteractions } from "@/lib/db/interactions";
import { listProviders } from "@/lib/db/providers";
import { SphereBadge } from "@/components/sphere-badge";
import { SearchPanel } from "@/components/search-panel";
import { NewInteractionForm, InteractionsTimeline } from "@/components/interactions";
import { deleteContactAction, toggleFavoriteAction } from "@/app/actions/contacts";
import type { SphereSlug } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ContactPage({ params }: { params: { id: string } }) {
  const contact = await getContact(params.id);
  if (!contact) notFound();
  const [interactions, providers] = await Promise.all([
    listInteractions(params.id),
    listProviders(),
  ]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
            {contact.kind === "company" ? <Building2 size={20} /> : <User size={20} />}
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{contact.name}</h1>
            <div className="text-sm text-neutral-500">
              {contact.role && `${contact.role} · `}
              {contact.company_name ?? (contact.kind === "company" ? "Empresa" : "")}
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {contact.spheres.map((s) => (
                <SphereBadge key={s.sphere_slug} slug={s.sphere_slug as SphereSlug} segmentName={s.segment_name} />
              ))}
              {contact.tags.map((t) => (
                <span key={t.id} className="badge bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">#{t.name}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <form action={toggleFavoriteAction}>
            <input type="hidden" name="id" value={contact.id} />
            <input type="hidden" name="value" value={String(!contact.is_favorite)} />
            <button type="submit" className="btn-outline">
              <Star size={14} className={contact.is_favorite ? "text-amber-500" : ""} fill={contact.is_favorite ? "currentColor" : "none"} />
              {contact.is_favorite ? "Favorito" : "Favoritar"}
            </button>
          </form>
          <Link href={`/contatos/${contact.id}/editar`} className="btn-outline"><Pencil size={14} /> Editar</Link>
          <form action={deleteContactAction}>
            <input type="hidden" name="id" value={contact.id} />
            <button type="submit" className="btn-outline text-red-600"><Trash2 size={14} /> Excluir</button>
          </form>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="card grid gap-3 md:grid-cols-2">
            <Field icon={Mail} label="Email" value={contact.email} href={contact.email ? `mailto:${contact.email}` : undefined} />
            <Field icon={Phone} label="Telefone" value={contact.phone} href={contact.phone ? `tel:${contact.phone}` : undefined} />
            <Field icon={Phone} label="WhatsApp" value={contact.whatsapp} href={contact.whatsapp ? `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}` : undefined} external />
            <Field icon={Globe} label="LinkedIn" value={contact.linkedin} href={contact.linkedin ?? undefined} external />
            <Field icon={Globe} label="Instagram" value={contact.instagram} href={contact.instagram ?? undefined} external />
            <Field icon={Globe} label="Website" value={contact.website} href={contact.website ?? undefined} external />
            <Field icon={MapPin} label="Local" value={[contact.city, contact.state].filter(Boolean).join(" / ") || null} />
            {contact.kind === "company" && contact.cnpj && (
              <Field icon={Building2} label="CNPJ" value={contact.cnpj} />
            )}
            {contact.oab && <Field icon={User} label="OAB" value={contact.oab} />}
          </div>

          {contact.notes && (
            <div className="card">
              <h3 className="mb-2 font-semibold">Notas</h3>
              <div className="text-sm whitespace-pre-wrap text-neutral-700 dark:text-neutral-300">{contact.notes}</div>
            </div>
          )}

          <div className="card">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Timeline</h3>
              <NewInteractionForm contactId={contact.id} />
            </div>
            <InteractionsTimeline items={interactions} />
          </div>
        </div>

        <div className="space-y-4">
          <SearchPanel contact={contact} providers={providers} />
        </div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon, label, value, href, external,
}: { icon: any; label: string; value: string | null; href?: string; external?: boolean }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 text-sm">
      <Icon size={14} className="mt-0.5 shrink-0 text-neutral-400" />
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wide text-neutral-500">{label}</div>
        {href ? (
          <a href={href} target={external ? "_blank" : undefined} rel="noopener noreferrer" className="truncate hover:underline">{value}</a>
        ) : (
          <div className="truncate">{value}</div>
        )}
      </div>
    </div>
  );
}
