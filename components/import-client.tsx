"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { parseCsv } from "@/lib/csv";
import { parseVCard } from "@/lib/vcard";
import { SPHERE_META, SPHERE_SLUGS, REQUIRES_SEGMENT } from "@/lib/spheres";
import type { Segment, SphereSlug } from "@/lib/types";

export function ImportClient({ segments }: { segments: Segment[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [raw, setRaw] = useState("");
  const [format, setFormat] = useState<"csv" | "vcf">("csv");
  const [preview, setPreview] = useState<Record<string, string>[]>([]);
  const [sphere, setSphere] = useState<SphereSlug | "">("geral");
  const [segmentId, setSegmentId] = useState<string>("");
  const [feedback, setFeedback] = useState<string | null>(null);

  function doParse() {
    setFeedback(null);
    if (!raw.trim()) { setPreview([]); return; }
    const rows = format === "csv" ? parseCsv(raw) : parseVCard(raw);
    setPreview(rows.filter((r) => r.name));
  }

  async function doImport() {
    setFeedback(null);
    const requiresSeg = sphere && REQUIRES_SEGMENT.includes(sphere as SphereSlug);
    if (requiresSeg && !segmentId) {
      setFeedback("Selecione um segmento para Investimentos.");
      return;
    }
    start(async () => {
      const res = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: preview, sphere: sphere || null, segment_id: segmentId || null }),
      });
      const data = await res.json();
      if (data.ok) {
        setFeedback(`Importados ${data.inserted}, ignorados (duplicados) ${data.skipped}.`);
        setPreview([]); setRaw("");
        router.refresh();
      } else {
        setFeedback(data.message ?? "Erro ao importar.");
      }
    });
  }

  const filteredSegments = segments.filter((s) => s.sphere_slug === sphere);

  return (
    <div className="space-y-4">
      <div className="card space-y-3">
        <div className="flex gap-2">
          <button type="button" onClick={() => setFormat("csv")} className={`btn ${format === "csv" ? "bg-neutral-900 text-white" : "border border-[var(--border)]"}`}>CSV</button>
          <button type="button" onClick={() => setFormat("vcf")} className={`btn ${format === "vcf" ? "bg-neutral-900 text-white" : "border border-[var(--border)]"}`}>vCard</button>
        </div>
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder={format === "csv" ? "name,email,phone,company_name\nFulano,a@b.com,..." : "BEGIN:VCARD\nVERSION:3.0\nFN:Fulano\nEMAIL:a@b.com\nEND:VCARD"}
          className="input min-h-[200px] font-mono text-xs"
        />
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="label">Esfera-alvo</label>
            <select className="select" value={sphere} onChange={(e) => { setSphere(e.target.value as any); setSegmentId(""); }}>
              <option value="">(nenhuma)</option>
              {SPHERE_SLUGS.map((s) => <option key={s} value={s}>{SPHERE_META[s].name}</option>)}
            </select>
          </div>
          {sphere && (
            <div>
              <label className="label">Segmento {REQUIRES_SEGMENT.includes(sphere as SphereSlug) && <span className="text-red-500">*</span>}</label>
              <select className="select" value={segmentId} onChange={(e) => setSegmentId(e.target.value)}>
                <option value="">{REQUIRES_SEGMENT.includes(sphere as SphereSlug) ? "Selecione..." : "—"}</option>
                {filteredSegments.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={doParse} className="btn-outline">Gerar prévia</button>
          {preview.length > 0 && (
            <button type="button" onClick={doImport} disabled={pending} className="btn-primary">
              {pending ? "Importando..." : `Importar ${preview.length} contato(s)`}
            </button>
          )}
        </div>
        {feedback && <div className="text-sm text-neutral-700">{feedback}</div>}
      </div>

      {preview.length > 0 && (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--border)] text-left text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-3 py-2">Nome</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Telefone</th>
                <th className="px-3 py-2">Empresa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {preview.slice(0, 50).map((r, i) => (
                <tr key={i}>
                  <td className="px-3 py-2">{r.name}</td>
                  <td className="px-3 py-2">{r.email}</td>
                  <td className="px-3 py-2">{r.phone}</td>
                  <td className="px-3 py-2">{r.company_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {preview.length > 50 && (
            <div className="p-3 text-center text-xs text-neutral-500">...e mais {preview.length - 50} linhas</div>
          )}
        </div>
      )}
    </div>
  );
}
