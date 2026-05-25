import Link from "next/link";
import { Star, UserPlus, Building2, User } from "lucide-react";
import { listContacts } from "@/lib/db/contacts";
import { listSegments } from "@/lib/db/segments";
import { listTags } from "@/lib/db/tags";
import { SphereBadge } from "@/components/sphere-badge";
import { ContactsFilters } from "@/components/contacts-filters";
import type { SphereSlug } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ContactsPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const filter = {
    q: searchParams.q,
    sphere: searchParams.sphere as SphereSlug | undefined,
    segment_id: searchParams.segment_id,
    tag: searchParams.tag,
    kind: searchParams.kind as "person" | "company" | undefined,
    state: searchParams.state,
    favorite: searchParams.favorite === "1",
  };
  const [contacts, segments, tags] = await Promise.all([
    listContacts(filter),
    listSegments(),
    listTags(),
  ]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Contatos</h1>
          <p className="text-sm text-neutral-500">{contacts.length} resultado(s)</p>
        </div>
        <Link href="/contatos/novo" className="btn-primary"><UserPlus size={16} /> Novo</Link>
      </div>

      <ContactsFilters segments={segments} tags={tags} />

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--border)] text-left text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Empresa / Cargo</th>
              <th className="px-4 py-3">Esferas</th>
              <th className="px-4 py-3">Local</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {contacts.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-neutral-500">Nenhum contato encontrado.</td></tr>
            )}
            {contacts.map((c) => (
              <tr key={c.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {c.kind === "company" ? <Building2 size={14} className="text-neutral-400" /> : <User size={14} className="text-neutral-400" />}
                    <Link href={`/contatos/${c.id}`} className="font-medium hover:underline">{c.name}</Link>
                    {c.is_favorite && <Star size={12} className="text-amber-500" fill="currentColor" />}
                  </div>
                  {c.email && <div className="text-xs text-neutral-500">{c.email}</div>}
                </td>
                <td className="px-4 py-3">
                  <div>{c.company_name ?? ""}</div>
                  {c.role && <div className="text-xs text-neutral-500">{c.role}</div>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {c.spheres.map((s) => <SphereBadge key={s.sphere_slug} slug={s.sphere_slug as SphereSlug} />)}
                  </div>
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {[c.city, c.state].filter(Boolean).join(" / ")}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/contatos/${c.id}`} className="text-sm text-neutral-600 hover:underline">Abrir →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
