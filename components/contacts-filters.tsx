"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { SPHERE_META, SPHERE_SLUGS } from "@/lib/spheres";
import type { Segment, Tag } from "@/lib/types";

export function ContactsFilters({ segments, tags }: { segments: Segment[]; tags: Tag[] }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [, start] = useTransition();

  function update(key: string, value: string | null) {
    const next = new URLSearchParams(sp.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    if (key === "sphere") next.delete("segment_id");
    start(() => router.push(`/contatos?${next.toString()}`));
  }

  const sphere = sp.get("sphere") ?? "";
  const segmentId = sp.get("segment_id") ?? "";
  const kind = sp.get("kind") ?? "";
  const tag = sp.get("tag") ?? "";
  const state = sp.get("state") ?? "";
  const favorite = sp.get("favorite") === "1";
  const filteredSegments = segments.filter((s) => !sphere || s.sphere_slug === sphere);

  return (
    <div className="card flex flex-wrap items-end gap-3">
      <div className="min-w-[140px]">
        <label className="label">Esfera</label>
        <select className="select" value={sphere} onChange={(e) => update("sphere", e.target.value || null)}>
          <option value="">Todas</option>
          {SPHERE_SLUGS.map((s) => (
            <option key={s} value={s}>{SPHERE_META[s].name}</option>
          ))}
        </select>
      </div>
      <div className="min-w-[160px]">
        <label className="label">Segmento</label>
        <select className="select" value={segmentId} onChange={(e) => update("segment_id", e.target.value || null)} disabled={!sphere}>
          <option value="">Todos</option>
          {filteredSegments.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>
      <div className="min-w-[140px]">
        <label className="label">Tipo</label>
        <select className="select" value={kind} onChange={(e) => update("kind", e.target.value || null)}>
          <option value="">Todos</option>
          <option value="person">Pessoa</option>
          <option value="company">Empresa</option>
        </select>
      </div>
      <div className="min-w-[140px]">
        <label className="label">Tag</label>
        <select className="select" value={tag} onChange={(e) => update("tag", e.target.value || null)}>
          <option value="">Todas</option>
          {tags.map((t) => (
            <option key={t.id} value={t.name}>{t.name}</option>
          ))}
        </select>
      </div>
      <div className="w-20">
        <label className="label">UF</label>
        <input className="input uppercase" maxLength={2} value={state} onChange={(e) => update("state", e.target.value.toUpperCase() || null)} />
      </div>
      <label className="flex items-center gap-2 pb-2 text-sm">
        <input type="checkbox" checked={favorite} onChange={(e) => update("favorite", e.target.checked ? "1" : null)} />
        Favoritos
      </label>
      <button type="button" onClick={() => router.push("/contatos")} className="btn-ghost ml-auto pb-2 text-xs">
        Limpar filtros
      </button>
    </div>
  );
}
