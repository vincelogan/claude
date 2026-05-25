import Link from "next/link";
import { Download, Upload, Trash2, Plus } from "lucide-react";
import { listSegments } from "@/lib/db/segments";
import { listTags } from "@/lib/db/tags";
import { listProviders } from "@/lib/db/providers";
import { SPHERE_META, SPHERE_SLUGS } from "@/lib/spheres";
import {
  addSegmentAction, removeSegmentAction,
  addProviderAction, removeProviderAction,
  removeTagAction, seedDefaultsAction,
} from "@/app/actions/config";

export const dynamic = "force-dynamic";

export default async function ConfigPage() {
  const [segments, tags, providers] = await Promise.all([listSegments(), listTags(), listProviders()]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Configurações</h1>
        <form action={seedDefaultsAction}>
          <button type="submit" className="btn-outline">Carregar seeds padrão</button>
        </form>
      </div>

      {/* Segmentos */}
      <section className="card space-y-3">
        <h2 className="font-semibold">Segmentos por esfera</h2>
        {SPHERE_SLUGS.map((slug) => {
          const list = segments.filter((s) => s.sphere_slug === slug);
          return (
            <div key={slug} className="rounded-md border border-[var(--border)] p-3">
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: SPHERE_META[slug].color }} />
                <strong>{SPHERE_META[slug].name}</strong>
              </div>
              <div className="flex flex-wrap gap-2">
                {list.map((s) => (
                  <form key={s.id} action={removeSegmentAction} className="flex">
                    <input type="hidden" name="id" value={s.id} />
                    <span className="badge border border-[var(--border)] bg-neutral-50 dark:bg-neutral-900">
                      {s.name}
                      <button type="submit" className="ml-1 text-neutral-400 hover:text-red-600">×</button>
                    </span>
                  </form>
                ))}
                <form action={addSegmentAction} className="flex items-center gap-1">
                  <input type="hidden" name="sphere" value={slug} />
                  <input name="name" placeholder="novo segmento" className="input h-8 w-40 text-xs" />
                  <button type="submit" className="btn-ghost px-2"><Plus size={14} /></button>
                </form>
              </div>
            </div>
          );
        })}
      </section>

      {/* Tags */}
      <section className="card space-y-3">
        <h2 className="font-semibold">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {tags.length === 0 && <p className="text-sm text-neutral-500">Nenhuma tag ainda.</p>}
          {tags.map((t) => (
            <form key={t.id} action={removeTagAction}>
              <input type="hidden" name="id" value={t.id} />
              <span className="badge border border-[var(--border)] bg-neutral-50 dark:bg-neutral-900">
                #{t.name}
                <button type="submit" className="ml-1 text-neutral-400 hover:text-red-600">×</button>
              </span>
            </form>
          ))}
        </div>
      </section>

      {/* Provedores de busca */}
      <section className="card space-y-3">
        <h2 className="font-semibold">Provedores de busca</h2>
        <p className="text-xs text-neutral-500">
          Placeholders disponíveis: <code>{"{nome}"}</code> <code>{"{empresa}"}</code> <code>{"{cidade}"}</code> <code>{"{uf}"}</code> <code>{"{cnpj}"}</code>
        </p>
        <div className="space-y-2">
          {providers.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center gap-2 rounded-md border border-[var(--border)] p-2 text-sm">
              <strong className="min-w-[140px]">{p.label}</strong>
              <code className="flex-1 truncate text-xs text-neutral-500">{p.url_template}</code>
              <span className="badge bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">{p.applies_to}</span>
              <form action={removeProviderAction}>
                <input type="hidden" name="id" value={p.id} />
                <button type="submit" className="btn-ghost text-red-600"><Trash2 size={14} /></button>
              </form>
            </div>
          ))}
        </div>
        <form action={addProviderAction} className="grid items-end gap-2 md:grid-cols-[1fr_2fr_140px_auto]">
          <div>
            <label className="label">Rótulo</label>
            <input name="label" className="input" required />
          </div>
          <div>
            <label className="label">URL Template</label>
            <input name="url_template" className="input" required placeholder="https://exemplo.com?q={nome}" />
          </div>
          <div>
            <label className="label">Aplica-se a</label>
            <select name="applies_to" className="select" defaultValue="both">
              <option value="person">Pessoa</option>
              <option value="company">Empresa</option>
              <option value="both">Ambos</option>
            </select>
          </div>
          <button type="submit" className="btn-primary"><Plus size={14} /> Adicionar</button>
        </form>
      </section>

      {/* Import / Export */}
      <section className="card space-y-3">
        <h2 className="font-semibold">Backup e importação</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/api/export?format=csv" className="btn-outline"><Download size={14} /> CSV</Link>
          <Link href="/api/export?format=json" className="btn-outline"><Download size={14} /> JSON</Link>
          <Link href="/api/export?format=vcf" className="btn-outline"><Download size={14} /> vCard</Link>
          <Link href="/config/importar" className="btn-outline"><Upload size={14} /> Importar CSV / vCard</Link>
        </div>
      </section>
    </div>
  );
}
