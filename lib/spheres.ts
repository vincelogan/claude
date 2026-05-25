import type { SphereSlug } from "./types";

export const SPHERE_META: Record<SphereSlug, { name: string; color: string; short: string }> = {
  juridico:      { name: "Jurídico",              color: "#1B2A4A", short: "Jur" },
  investimentos: { name: "Investimentos",         color: "#1F7A4D", short: "Inv" },
  criativa:      { name: "CriaAtva (Cenografia)", color: "#C4612F", short: "Cri" },
  geral:         { name: "Geral",                 color: "#5B6470", short: "Gen" },
};

export const SPHERE_SLUGS: SphereSlug[] = ["juridico", "investimentos", "criativa", "geral"];

export const REQUIRES_SEGMENT: SphereSlug[] = ["investimentos"];
