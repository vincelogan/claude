/**
 * POST /api/integracoes/tribunais/sincronizar
 *
 * Body:
 *   { "processoId": "..." }  -> sincroniza um processo
 *   { "usuarioId":  "..." }  -> sincroniza todos os processos do usuário
 *
 * Requer sessão autenticada. Para `usuarioId`, só permite sincronizar
 * a si mesmo (a menos que o perfil seja ADMIN — TODO quando RBAC for
 * formalizado).
 */

import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import {
  sincronizarProcesso,
  sincronizarTodosProcessosDoUsuario,
} from "@/lib/tribunais/sync";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { ok: false, erro: "Não autenticado." },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, erro: "JSON inválido." },
      { status: 400 },
    );
  }

  const { processoId, usuarioId } = (body ?? {}) as {
    processoId?: string;
    usuarioId?: string;
  };

  if (processoId && typeof processoId === "string") {
    const r = await sincronizarProcesso(processoId);
    return NextResponse.json(r, { status: r.ok ? 200 : 422 });
  }

  if (usuarioId && typeof usuarioId === "string") {
    if (usuarioId !== session.user.id && session.user.perfil !== "ADMIN") {
      return NextResponse.json(
        { ok: false, erro: "Sem permissão para sincronizar outro usuário." },
        { status: 403 },
      );
    }
    const r = await sincronizarTodosProcessosDoUsuario(usuarioId);
    return NextResponse.json({ ok: true, ...r });
  }

  return NextResponse.json(
    { ok: false, erro: "Informe processoId ou usuarioId." },
    { status: 400 },
  );
}
