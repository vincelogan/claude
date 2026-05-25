import type { Contact, ContactWithRelations } from "./types";

const CONTACT_FIELDS: (keyof Contact)[] = [
  "id","kind","name","company_name","role","email","phone","whatsapp",
  "linkedin","instagram","website","city","state","oab","cnpj","notes","is_favorite",
];

export function contactsToCsv(rows: ContactWithRelations[]): string {
  const headers = [...CONTACT_FIELDS, "spheres", "tags"];
  const esc = (v: any) => {
    if (v === null || v === undefined) return "";
    const s = String(v).replace(/"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };
  const lines = [headers.join(",")];
  for (const r of rows) {
    const sphereStr = r.spheres.map((s) => s.sphere_slug).join("|");
    const tagStr = r.tags.map((t) => t.name).join("|");
    const cells = CONTACT_FIELDS.map((f) => esc(r[f])).concat([esc(sphereStr), esc(tagStr)]);
    lines.push(cells.join(","));
  }
  return lines.join("\n");
}

export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') { inQuotes = false; }
      else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { cur.push(field); field = ""; }
      else if (c === "\n") { cur.push(field); rows.push(cur); cur = []; field = ""; }
      else if (c === "\r") { /* skip */ }
      else field += c;
    }
  }
  if (field.length || cur.length) { cur.push(field); rows.push(cur); }
  const [headRow, ...dataRows] = rows.filter((r) => r.length && !(r.length === 1 && r[0] === ""));
  if (!headRow) return [];
  const headers = headRow.map((h) => h.trim());
  return dataRows.map((r) => Object.fromEntries(headers.map((h, i) => [h, (r[i] ?? "").trim()])));
}
