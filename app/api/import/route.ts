import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { REQUIRES_SEGMENT } from "@/lib/spheres";
import type { SphereSlug } from "@/lib/types";

export const dynamic = "force-dynamic";

type ImportRow = {
  name?: string; email?: string; phone?: string; whatsapp?: string;
  company_name?: string; role?: string; linkedin?: string; instagram?: string;
  website?: string; city?: string; state?: string; oab?: string; cnpj?: string;
  notes?: string; kind?: string;
};

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    rows: ImportRow[];
    sphere?: SphereSlug | null;
    segment_id?: string | null;
  };
  const supabase = createClient();

  if (body.sphere && REQUIRES_SEGMENT.includes(body.sphere) && !body.segment_id) {
    return NextResponse.json({ ok: false, message: "Segmento obrigatório para Investimentos" }, { status: 400 });
  }

  // Existing emails/phones for dedup
  const { data: existing } = await supabase.from("contacts").select("email, phone");
  const emails = new Set((existing ?? []).map((r: any) => r.email).filter(Boolean));
  const phones = new Set((existing ?? []).map((r: any) => r.phone).filter(Boolean));

  let inserted = 0, skipped = 0;
  for (const r of body.rows) {
    if (!r.name) { skipped++; continue; }
    if (r.email && emails.has(r.email)) { skipped++; continue; }
    if (r.phone && phones.has(r.phone)) { skipped++; continue; }
    const payload: any = {
      kind: r.kind === "company" ? "company" : "person",
      name: r.name,
      email: r.email || null,
      phone: r.phone || null,
      whatsapp: r.whatsapp || null,
      company_name: r.company_name || null,
      role: r.role || null,
      linkedin: r.linkedin || null,
      instagram: r.instagram || null,
      website: r.website || null,
      city: r.city || null,
      state: r.state ? r.state.toUpperCase() : null,
      oab: r.oab || null,
      cnpj: r.cnpj || null,
      notes: r.notes || null,
    };
    const { data, error } = await supabase.from("contacts").insert(payload).select("id").single();
    if (error || !data) { skipped++; continue; }
    if (body.sphere) {
      await supabase.from("contact_spheres").insert({
        contact_id: data.id,
        sphere_slug: body.sphere,
        segment_id: body.segment_id || null,
      });
    }
    if (r.email) emails.add(r.email);
    if (r.phone) phones.add(r.phone);
    inserted++;
  }

  return NextResponse.json({ ok: true, inserted, skipped });
}
