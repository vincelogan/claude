import { z } from "zod";
import { REQUIRES_SEGMENT, SPHERE_SLUGS } from "./spheres";

export const sphereSlugSchema = z.enum(SPHERE_SLUGS as [string, ...string[]]);

export const contactSphereInputSchema = z.object({
  sphere_slug: sphereSlugSchema,
  segment_id: z.string().uuid().nullable().optional(),
});

export const contactInputSchema = z.object({
  kind: z.enum(["person", "company"]),
  name: z.string().min(1, "Nome obrigatório"),
  company_name: z.string().optional().nullable(),
  role: z.string().optional().nullable(),
  email: z.string().email("Email inválido").optional().or(z.literal("")).nullable(),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().max(2).optional().nullable(),
  oab: z.string().optional().nullable(),
  cnpj: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  is_favorite: z.boolean().default(false),
  spheres: z.array(contactSphereInputSchema).default([]),
  tags: z.array(z.string()).default([]),
}).refine((v) => {
  for (const s of v.spheres) {
    if (REQUIRES_SEGMENT.includes(s.sphere_slug as any) && !s.segment_id) return false;
  }
  return true;
}, { message: "Segmento é obrigatório para Investimentos", path: ["spheres"] });

export type ContactInput = z.infer<typeof contactInputSchema>;

export const interactionInputSchema = z.object({
  contact_id: z.string().uuid(),
  occurred_at: z.string(),
  channel: z.enum(["meeting","call","message","email","event","other"]),
  summary: z.string().min(1),
  follow_up_at: z.string().nullable().optional(),
});
export type InteractionInput = z.infer<typeof interactionInputSchema>;
