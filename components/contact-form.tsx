"use client";
import { useState, useTransition } from "react";
import { SPHERE_META, SPHERE_SLUGS, REQUIRES_SEGMENT } from "@/lib/spheres";
import type { Segment, SphereSlug, ContactWithRelations } from "@/lib/types";

type SphereSelection = { sphere_slug: SphereSlug; segment_id: string | null };

export function ContactForm({
  segments,
  initial,
  action,
}: {
  segments: Segment[];
  initial?: ContactWithRelations;
  action: (formData: FormData) => Promise<void>;
}) {
  const [kind, setKind] = useState<"person" | "company">(initial?.kind ?? "person");
  const [selectedSpheres, setSelectedSpheres] = useState<SphereSelection[]>(
    initial?.spheres.map((s) => ({ sphere_slug: s.sphere_slug as SphereSlug, segment_id: s.segment_id })) ?? [],
  );
  const [tagsInput, setTagsInput] = useState((initial?.tags ?? []).map((t) => t.name).join(", "));
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggleSphere(slug: SphereSlug) {
    setSelectedSpheres((prev) => {
      const exists = prev.find((s) => s.sphere_slug === slug);
      if (exists) return prev.filter((s) => s.sphere_slug !== slug);
      return [...prev, { sphere_slug: slug, segment_id: null }];
    });
  }

  function setSegment(slug: SphereSlug, segmentId: string | null) {
    setSelectedSpheres((prev) => prev.map((s) => s.sphere_slug === slug ? { ...s, segment_id: segmentId } : s));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    setError(null);
    for (const s of selectedSpheres) {
      if (REQUIRES_SEGMENT.includes(s.sphere_slug) && !s.segment_id) {
        e.preventDefault();
        setError(`Segmento é obrigatório para ${SPHERE_META[s.sphere_slug].name}.`);
        return;
      }
    }
    const fd = new FormData(e.currentTarget);
    fd.set("spheres_json", JSON.stringify(selectedSpheres));
    e.preventDefault();
    start(() => action(fd));
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <input type="hidden" name="kind" value={kind} />

      <div className="card space-y-4">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setKind("person")}
            className={`btn ${kind === "person" ? "bg-neutral-900 text-white" : "border border-[var(--border)]"}`}>Pessoa</button>
          <button type="button" onClick={() => setKind("company")}
            className={`btn ${kind === "company" ? "bg-neutral-900 text-white" : "border border-[var(--border)]"}`}>Empresa</button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="label">Nome {kind === "company" ? "da empresa" : "completo"} *</label>
            <input name="name" required defaultValue={initial?.name} className="input" />
          </div>
          {kind === "person" && (
            <>
              <div>
                <label className="label">Empresa</label>
                <input name="company_name" defaultValue={initial?.company_name ?? ""} className="input" />
              </div>
              <div>
                <label className="label">Cargo / Função</label>
                <input name="role" defaultValue={initial?.role ?? ""} className="input" />
              </div>
            </>
          )}
          {kind === "company" && (
            <div>
              <label className="label">CNPJ</label>
              <input name="cnpj" defaultValue={initial?.cnpj ?? ""} className="input" placeholder="00.000.000/0000-00" />
            </div>
          )}
          <div>
            <label className="label">Email</label>
            <input name="email" type="email" defaultValue={initial?.email ?? ""} className="input" />
          </div>
          <div>
            <label className="label">Telefone</label>
            <input name="phone" defaultValue={initial?.phone ?? ""} className="input" />
          </div>
          <div>
            <label className="label">WhatsApp</label>
            <input name="whatsapp" defaultValue={initial?.whatsapp ?? ""} className="input" />
          </div>
          <div>
            <label className="label">LinkedIn</label>
            <input name="linkedin" defaultValue={initial?.linkedin ?? ""} className="input" />
          </div>
          <div>
            <label className="label">Instagram</label>
            <input name="instagram" defaultValue={initial?.instagram ?? ""} className="input" />
          </div>
          <div>
            <label className="label">Website</label>
            <input name="website" defaultValue={initial?.website ?? ""} className="input" />
          </div>
          <div>
            <label className="label">Cidade</label>
            <input name="city" defaultValue={initial?.city ?? ""} className="input" />
          </div>
          <div>
            <label className="label">UF</label>
            <input name="state" defaultValue={initial?.state ?? ""} maxLength={2} className="input uppercase" />
          </div>
          {kind === "person" && (
            <div>
              <label className="label">OAB</label>
              <input name="oab" defaultValue={initial?.oab ?? ""} className="input" />
            </div>
          )}
        </div>
      </div>

      <div className="card space-y-3">
        <h3 className="font-semibold">Esferas</h3>
        <div className="flex flex-wrap gap-2">
          {SPHERE_SLUGS.map((s) => {
            const selected = selectedSpheres.find((x) => x.sphere_slug === s);
            const meta = SPHERE_META[s];
            return (
              <button
                type="button"
                key={s}
                onClick={() => toggleSphere(s)}
                className="badge border"
                style={{
                  background: selected ? `${meta.color}26` : "transparent",
                  color: selected ? meta.color : undefined,
                  borderColor: meta.color,
                }}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: meta.color }} />
                {meta.name}
              </button>
            );
          })}
        </div>

        {selectedSpheres.map((s) => {
          const sphereSegments = segments.filter((seg) => seg.sphere_slug === s.sphere_slug);
          const required = REQUIRES_SEGMENT.includes(s.sphere_slug);
          if (sphereSegments.length === 0 && !required) return null;
          return (
            <div key={s.sphere_slug}>
              <label className="label">
                Segmento — {SPHERE_META[s.sphere_slug].name} {required && <span className="text-red-500">*</span>}
              </label>
              <select
                className="select"
                value={s.segment_id ?? ""}
                onChange={(e) => setSegment(s.sphere_slug, e.target.value || null)}
              >
                <option value="">{required ? "Selecione..." : "—"}</option>
                {sphereSegments.map((seg) => (
                  <option key={seg.id} value={seg.id}>{seg.name}</option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      <div className="card space-y-3">
        <div>
          <label className="label">Tags (separadas por vírgula)</label>
          <input name="tags" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="input" placeholder="cliente, networking, evento-x" />
        </div>
        <div>
          <label className="label">Notas (markdown)</label>
          <textarea name="notes" defaultValue={initial?.notes ?? ""} className="input min-h-[120px]" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_favorite" defaultChecked={initial?.is_favorite} /> Favorito
        </label>
      </div>

      {error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="flex justify-end gap-2">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
