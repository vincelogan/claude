"use client";
import { useState } from "react";
import { ExternalLink, ClipboardPaste, CheckCircle2 } from "lucide-react";
import { applicableProviders, renderTemplate } from "@/lib/search-providers";
import type { Contact, SearchProvider } from "@/lib/types";
import { pasteLinkAction } from "@/app/actions/contacts";

export function SearchPanel({ contact, providers }: { contact: Contact; providers: SearchProvider[] }) {
  const list = applicableProviders(providers, contact.kind);
  const [paste, setPaste] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  async function savePaste() {
    if (!paste.trim()) return;
    const res = await pasteLinkAction(contact.id, paste.trim());
    if (res.ok) {
      setFeedback(`Salvo em "${res.field}".`);
      setPaste("");
    } else {
      setFeedback(res.message);
    }
  }

  return (
    <div className="card space-y-3">
      <div>
        <h3 className="font-semibold">Buscar na web</h3>
        <p className="text-xs text-neutral-500">
          Abrimos a busca em nova aba. Cole o link que encontrar abaixo — detectamos LinkedIn, Instagram ou website e salvamos na ficha.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {list.map((p) => {
          const url = renderTemplate(p.url_template, contact);
          return (
            <a
              key={p.id}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-xs"
            >
              <ExternalLink size={12} /> {p.label}
            </a>
          );
        })}
        {list.length === 0 && (
          <p className="text-sm text-neutral-500">Nenhum provedor configurado. Vá em /config para adicionar.</p>
        )}
      </div>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <label className="label">Colar link / handle</label>
          <input className="input" placeholder="https://linkedin.com/in/..." value={paste} onChange={(e) => setPaste(e.target.value)} />
        </div>
        <button type="button" onClick={savePaste} className="btn-primary">
          <ClipboardPaste size={14} /> Salvar
        </button>
      </div>
      {feedback && (
        <div className="flex items-center gap-2 text-xs text-emerald-700"><CheckCircle2 size={12} /> {feedback}</div>
      )}
    </div>
  );
}
