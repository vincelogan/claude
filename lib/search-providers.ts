import type { Contact, SearchProvider } from "./types";

export function renderTemplate(template: string, contact: Partial<Contact>): string {
  const map: Record<string, string> = {
    nome: contact.name ?? "",
    empresa: contact.company_name ?? (contact.kind === "company" ? contact.name ?? "" : ""),
    cidade: contact.city ?? "",
    uf: contact.state ?? "",
    cnpj: (contact.cnpj ?? "").replace(/\D/g, ""),
  };
  return template.replace(/\{(nome|empresa|cidade|uf|cnpj)\}/g, (_, k) =>
    encodeURIComponent(map[k] ?? "")
  );
}

export function applicableProviders(providers: SearchProvider[], kind: Contact["kind"]) {
  return providers
    .filter((p) => p.applies_to === "both" || p.applies_to === kind)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function detectFieldFromUrl(url: string): "linkedin" | "instagram" | "website" | null {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    if (host.includes("linkedin.com")) return "linkedin";
    if (host.includes("instagram.com")) return "instagram";
    if (host) return "website";
    return null;
  } catch {
    return null;
  }
}
