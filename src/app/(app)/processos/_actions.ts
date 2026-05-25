"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import type {
  FaseProcesso,
  PoloParte,
  StatusProcesso,
  TipoMovimentacao,
  TipoParte,
  TipoProcesso,
} from "@prisma/client";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { limparCnj, validarCnj } from "./_lib/cnj";

// ---------------------------------------------------------------------------
// Tipos de entrada
// ---------------------------------------------------------------------------

export type SalvarProcessoInput = {
  id?: string;
  numeroCnj: string;
  numeroAntigo?: string | null;
  classeProcessual: string;
  tipo: TipoProcesso;
  fase: FaseProcesso;
  status: StatusProcesso;
  sigiloso: boolean;
  valorCausa?: string | null;
  tribunalId?: string | null;
  varaId?: string | null;
  assuntoId?: string | null;
  observacoes?: string | null;
};

export type SalvarParteInput = {
  id?: string;
  processoId: string;
  clienteId?: string | null;
  nome: string;
  cpfCnpj?: string | null;
  polo: PoloParte;
  tipoParte: TipoParte;
};

export type CriarMovimentacaoInput = {
  processoId: string;
  data: string; // ISO
  descricao: string;
  tipo: TipoMovimentacao;
};

export type ActionResult<T = unknown> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autenticado.");
  }
  return session;
}

// ---------------------------------------------------------------------------
// Processo
// ---------------------------------------------------------------------------

export async function salvarProcesso(
  input: SalvarProcessoInput,
): Promise<ActionResult<{ id: string }>> {
  await requireSession();

  if (!validarCnj(input.numeroCnj)) {
    return { ok: false, error: "Número CNJ inválido." };
  }
  if (!input.classeProcessual?.trim()) {
    return { ok: false, error: "Classe processual é obrigatória." };
  }

  const numeroCnj = limparCnj(input.numeroCnj);

  const data = {
    numeroCnj,
    numeroAntigo: input.numeroAntigo?.trim() || null,
    classeProcessual: input.classeProcessual.trim(),
    tipo: input.tipo,
    fase: input.fase,
    status: input.status,
    sigiloso: input.sigiloso,
    valorCausa:
      input.valorCausa && input.valorCausa.trim() !== ""
        ? new Prisma.Decimal(input.valorCausa.replace(",", "."))
        : null,
    tribunalId: input.tribunalId || null,
    varaId: input.varaId || null,
    assuntoId: input.assuntoId || null,
    observacoes: input.observacoes?.trim() || null,
  };

  try {
    const processo = input.id
      ? await prisma.processo.update({ where: { id: input.id }, data })
      : await prisma.processo.create({ data });

    revalidatePath("/processos");
    revalidatePath(`/processos/${processo.id}`);

    return { ok: true, data: { id: processo.id } };
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return {
        ok: false,
        error: "Já existe um processo com este número CNJ.",
      };
    }
    console.error("salvarProcesso", err);
    return { ok: false, error: "Erro ao salvar processo." };
  }
}

// ---------------------------------------------------------------------------
// Parte
// ---------------------------------------------------------------------------

export async function salvarParte(
  input: SalvarParteInput,
): Promise<ActionResult> {
  await requireSession();

  if (!input.processoId) return { ok: false, error: "Processo inválido." };

  // Se for cliente cadastrado, busca nome/cpf do cliente.
  let nome = input.nome?.trim();
  let cpfCnpj = input.cpfCnpj?.trim() || null;

  if (input.clienteId) {
    const cliente = await prisma.cliente.findUnique({
      where: { id: input.clienteId },
      select: { nome: true, cpfCnpj: true },
    });
    if (!cliente) return { ok: false, error: "Cliente não encontrado." };
    nome = cliente.nome;
    cpfCnpj = cliente.cpfCnpj;
  }

  if (!nome) return { ok: false, error: "Nome da parte é obrigatório." };

  const data = {
    processoId: input.processoId,
    clienteId: input.clienteId || null,
    nome,
    cpfCnpj,
    polo: input.polo,
    tipoParte: input.tipoParte,
  };

  try {
    if (input.id) {
      await prisma.parte.update({ where: { id: input.id }, data });
    } else {
      await prisma.parte.create({ data });
    }
    revalidatePath(`/processos/${input.processoId}`);
    return { ok: true };
  } catch (err) {
    console.error("salvarParte", err);
    return { ok: false, error: "Erro ao salvar parte." };
  }
}

export async function removerParte(parteId: string): Promise<ActionResult> {
  await requireSession();
  try {
    const parte = await prisma.parte.delete({ where: { id: parteId } });
    revalidatePath(`/processos/${parte.processoId}`);
    return { ok: true };
  } catch (err) {
    console.error("removerParte", err);
    return { ok: false, error: "Erro ao remover parte." };
  }
}

// ---------------------------------------------------------------------------
// Movimentação
// ---------------------------------------------------------------------------

export async function criarMovimentacao(
  input: CriarMovimentacaoInput,
): Promise<ActionResult> {
  const session = await requireSession();

  if (!input.descricao?.trim()) {
    return { ok: false, error: "Descrição é obrigatória." };
  }

  try {
    await prisma.movimentacao.create({
      data: {
        processoId: input.processoId,
        data: new Date(input.data),
        descricao: input.descricao.trim(),
        tipo: input.tipo,
        origemTribunal: false,
        criadaPorId: session.user.id,
      },
    });
    revalidatePath(`/processos/${input.processoId}`);
    return { ok: true };
  } catch (err) {
    console.error("criarMovimentacao", err);
    return { ok: false, error: "Erro ao criar movimentação." };
  }
}

// ---------------------------------------------------------------------------
// Responsáveis
// ---------------------------------------------------------------------------

export async function adicionarResponsavel(
  processoId: string,
  usuarioId: string,
  principal: boolean,
): Promise<ActionResult> {
  await requireSession();

  if (!processoId || !usuarioId) {
    return { ok: false, error: "Dados inválidos." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      if (principal) {
        await tx.processoResponsavel.updateMany({
          where: { processoId, principal: true },
          data: { principal: false },
        });
      }
      await tx.processoResponsavel.upsert({
        where: { processoId_usuarioId: { processoId, usuarioId } },
        create: { processoId, usuarioId, principal },
        update: { principal },
      });
    });

    revalidatePath(`/processos/${processoId}`);
    return { ok: true };
  } catch (err) {
    console.error("adicionarResponsavel", err);
    return { ok: false, error: "Erro ao adicionar responsável." };
  }
}

export async function removerResponsavel(
  processoId: string,
  usuarioId: string,
): Promise<ActionResult> {
  await requireSession();
  try {
    await prisma.processoResponsavel.delete({
      where: { processoId_usuarioId: { processoId, usuarioId } },
    });
    revalidatePath(`/processos/${processoId}`);
    return { ok: true };
  } catch (err) {
    console.error("removerResponsavel", err);
    return { ok: false, error: "Erro ao remover responsável." };
  }
}

// ---------------------------------------------------------------------------
// Auxiliares
// ---------------------------------------------------------------------------

export async function listarVarasPorTribunal(tribunalId: string) {
  await requireSession();
  if (!tribunalId) return [];
  return prisma.vara.findMany({
    where: { tribunalId },
    orderBy: { nome: "asc" },
    select: { id: true, nome: true, comarca: true },
  });
}
