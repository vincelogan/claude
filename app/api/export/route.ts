import { NextRequest, NextResponse } from "next/server";
import { listContacts } from "@/lib/db/contacts";
import { contactsToCsv } from "@/lib/csv";
import { contactsToVCards } from "@/lib/vcard";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const format = req.nextUrl.searchParams.get("format") ?? "json";
  const rows = await listContacts({});

  if (format === "csv") {
    const csv = contactsToCsv(rows);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="contatos-${Date.now()}.csv"`,
      },
    });
  }
  if (format === "vcf") {
    const vcf = contactsToVCards(rows);
    return new NextResponse(vcf, {
      headers: {
        "Content-Type": "text/vcard; charset=utf-8",
        "Content-Disposition": `attachment; filename="contatos-${Date.now()}.vcf"`,
      },
    });
  }
  // JSON full backup
  return new NextResponse(JSON.stringify({ contacts: rows, exported_at: new Date().toISOString() }, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="crm-backup-${Date.now()}.json"`,
    },
  });
}
