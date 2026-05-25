import type { ContactWithRelations } from "./types";

export function contactToVCard(c: ContactWithRelations): string {
  const lines = ["BEGIN:VCARD", "VERSION:3.0", `FN:${c.name}`];
  if (c.kind === "company") lines.push(`ORG:${c.name}`);
  else if (c.company_name) lines.push(`ORG:${c.company_name}`);
  if (c.role) lines.push(`TITLE:${c.role}`);
  if (c.email) lines.push(`EMAIL:${c.email}`);
  if (c.phone) lines.push(`TEL;TYPE=CELL:${c.phone}`);
  if (c.whatsapp) lines.push(`TEL;TYPE=WORK:${c.whatsapp}`);
  if (c.linkedin) lines.push(`URL:${c.linkedin}`);
  if (c.instagram) lines.push(`URL:${c.instagram}`);
  if (c.website) lines.push(`URL:${c.website}`);
  if (c.city || c.state) lines.push(`ADR:;;;${c.city ?? ""};${c.state ?? ""};;`);
  if (c.notes) lines.push(`NOTE:${c.notes.replace(/\n/g, "\\n")}`);
  lines.push("END:VCARD");
  return lines.join("\r\n");
}

export function contactsToVCards(rows: ContactWithRelations[]): string {
  return rows.map(contactToVCard).join("\r\n");
}

export function parseVCard(text: string): Record<string, string>[] {
  const cards = text.split(/END:VCARD/i).map((c) => c.replace(/BEGIN:VCARD/i, "").trim()).filter(Boolean);
  return cards.map((card) => {
    const out: Record<string, string> = {};
    const lines = card.split(/\r?\n/);
    for (const raw of lines) {
      const line = raw.trim();
      const idx = line.indexOf(":");
      if (idx === -1) continue;
      const left = line.slice(0, idx).toUpperCase();
      const value = line.slice(idx + 1);
      if (left === "FN") out.name = value;
      else if (left === "ORG") out.company_name = value.replace(/;.*$/, "");
      else if (left === "TITLE") out.role = value;
      else if (left === "EMAIL" || left.startsWith("EMAIL;")) out.email ||= value;
      else if (left.startsWith("TEL")) out.phone ||= value;
      else if (left === "URL") out.website ||= value;
      else if (left.startsWith("ADR")) {
        const parts = value.split(";");
        out.city ||= parts[3] ?? "";
        out.state ||= parts[4] ?? "";
      }
      else if (left === "NOTE") out.notes = value.replace(/\\n/g, "\n");
    }
    return out;
  });
}
