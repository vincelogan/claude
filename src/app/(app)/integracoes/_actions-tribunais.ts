"use server";

/**
 * Server Actions para integrações com tribunais.
 *
 * Convenção: este arquivo é separado de `_actions.ts` (Google) para
 * evitar conflito entre agentes/áreas.
 */

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/crypto";

import type { Credenciais, SistemaTribunal } from "@/lib/tribunais/types";
import { sincronizarProcesso } from "@/lib/tribunais/sync";

import type { SistemaTribunal as SistemaTribunalPrisma } from "@prisma/client";

const SISTEMAS_VALIDOS = new Set<SistemaTribunal>([
  "PJE",
  "ESAJ",
  "PROJUDI",
  "EPROC",
]);

export interface SalvarIntegracaoInput {
  sistema: SistemaTribunal;
  tribunalSigla: string;
  credenciais: Credenciais;
}

/**
 * Cria ou atualiza uma integração com tribunal para o usuário logado.
 * As credenciais são serializadas em JSON e cifradas em repouso.
 */
export async function salvarIntegracaoTribunal(
  input: SalvarIntegracaoInput,
): Promise<{ ok: boolean; id?: string; erro?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, erro: "Não autenticado." };
  }

  if (!SISTEMAS_VALIDOS.has(input.sistema)) {
    return { ok: false, erro: "Sistema inválido." };
  }
  const sigla = input.tribunalSigla.trim().toUpperCase();
  if (!sigla) {
    return { ok: false, erro: "Sigla do tribunal obrigatória." };
  }

  const credencialCifrada = encrypt(JSON.stringify(input.credenciais ?? {}));

  const registro = await prisma.integracaoTribunal.upsert({
    where: {
      usuarioId_sistema_tribunalSigla: {
        usuarioId: session.user.id,
        sistema: input.sistema as SistemaTribunalPrisma,
        tribunalSigla: sigla,
      },
    },
    create: {
      usuarioId: session.user.id,
      sistema: input.sistema as SistemaTribunalPrisma,
      tribunalSigla: sigla,
      credencialCifrada,
      ativa: true,
    },
    update: {
      credencialCifrada,
      ativa: true,
    },
    select: { id: true },
  });

  revalidatePath("/integracoes");
  return { ok: true, id: registro.id };
}

/**
 * Remove uma integração do usuário logado.
 */
export async function removerIntegracaoTribunal(
  id: string,
): Promise<{ ok: boolean; erro?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, erro: "Não autenticado." };
  }

  // Garante que o usuário só apaga o que é dele.
  const existente = await prisma.integracaoTribunal.findUnique({
    where: { id },
    select: { usuarioId: true },
  });
  if (!existente || existente.usuarioId !== session.user.id) {
    return { ok: false, erro: "Integração não encontrada." };
  }

  await prisma.integracaoTribunal.delete({ where: { id } });
  revalidatePath("/integracoes");
  return { ok: true };
}

/**
 * Dispara sincronização sob demanda de um processo específico.
 */
export async function sincronizarProcessoAgora(
  processoId: string,
): Promise<{ ok: boolean; novasMovimentacoes: number; erro?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, novasMovimentacoes: 0, erro: "Não autenticado." };
  }

  const resultado = await sincronizarProcesso(processoId);
  revalidatePath(`/processos/${processoId}`);
  revalidatePath("/integracoes");
  return resultado;
}
