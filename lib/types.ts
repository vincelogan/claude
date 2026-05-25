export type SphereSlug = "juridico" | "investimentos" | "criativa" | "geral";

export type Sphere = {
  slug: SphereSlug;
  name: string;
  color: string;
  sort_order: number;
};

export type Segment = {
  id: string;
  sphere_slug: SphereSlug;
  name: string;
  sort_order: number;
};

export type ContactKind = "person" | "company";

export type Contact = {
  id: string;
  kind: ContactKind;
  name: string;
  company_name: string | null;
  role: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  linkedin: string | null;
  instagram: string | null;
  website: string | null;
  city: string | null;
  state: string | null;
  oab: string | null;
  cnpj: string | null;
  notes: string | null;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
};

export type ContactSphere = {
  id: string;
  contact_id: string;
  sphere_slug: SphereSlug;
  segment_id: string | null;
};

export type Tag = { id: string; name: string };

export type InteractionChannel =
  | "meeting" | "call" | "message" | "email" | "event" | "other";

export type Interaction = {
  id: string;
  contact_id: string;
  occurred_at: string;
  channel: InteractionChannel;
  summary: string;
  follow_up_at: string | null;
  follow_up_done: boolean;
};

export type SearchProvider = {
  id: string;
  label: string;
  url_template: string;
  applies_to: "person" | "company" | "both";
  sort_order: number;
};

export type ContactWithRelations = Contact & {
  spheres: { sphere_slug: SphereSlug; segment_id: string | null; segment_name?: string | null }[];
  tags: Tag[];
};
