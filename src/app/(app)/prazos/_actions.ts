"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const prazoSchema = z
  .object({
    id: z.string().optional(),
    titulo: z.string().trim().min(3, "Informe um título com pelo menos 3 caracteres."),
    descricao: z.string().trim().optional().nullable(),
    processoId: z.string().trim().optional().nullable(),
    dataInicio: z.coerce.date({ message: "Data de início inválida." }),
    dataVencimento: z.coerce.date({ message: "Data de vencimento inválida." }),
    fatal: z.coerce.boolean().optional().default(false),
    diasCorridos: z.coerce.boolean().optional().default(false),
    responsavelId: z.string().trim().min(1, "Selecione um responsável."),
    observacoes: z.string().trim().optional().nullable(),
  })
  .refine((dados) => dados.dataVencimento.getTime() >= dados.dataInicio.getTime(), {
    message: "A data de vencimento deve ser igual ou posterior à data de início.",
    path: ["dataVencimento"],
  });

export type SalvarPrazoInput = z.input<typeof prazoSchema>;

export type SalvarPrazoResult =
  | { ok: true; id: string }
  | { ok: false; erro: string };

async function exigirSessao() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autenticado.");
  }
  return session;
}

function normalizarOpcional(valor: string | null | undefined): string | null {
  if (!valor) return null;
  const t = valor.trim();
  return t.length === 0 ? null : t;
}

export async function salvarPrazo(
  input: SalvarPrazoInput,
): Promise<SalvarPrazoResult> {
  await exigirSessao();

  const parsed = prazoSchema.safeParse(input);
  if (!parsed.success) {
    const primeiro = parsed.error.issues[0]?.message ?? "Dados inválidos.";
    return { ok: false, erro: primeiro };
  }

  const dados = parsed.data;
  const payload = {
    titulo: dados.titulo,
    descricao: normalizarOpcional(dados.descricao),
    processoId: normalizarOpcional(dados.processoId),
    dataInicio: dados.dataInicio,
    dataVencimento: dados.dataVencimento,
    fatal: dados.fatal,
    diasCorridos: dados.diasCorridos,
    responsavelId: dados.responsavelId,
    observacoes: normalizarOpcional(dados.observacoes),
  };

  let prazoId: string;
  try {
    if (dados.id) {
      const atualizado = await prisma.prazo.update({
        where: { id: dados.id },
        data: payload,
      });
      prazoId = atualizado.id;
    } else {
      const criado = await prisma.prazo.create({ data: payload });
      prazoId = criado.id;
    }
  } catch (error) {
    console.error("[prazos.salvarPrazo]", error);
    return { ok: false, erro: "Não foi possível salvar o prazo." };
  }

  // TODO: sync Google Calendar (outro agente cuida desta integração).

  revalidatePath("/prazos");
  revalidatePath(`/prazos/${prazoId}`);
  return { ok: true, id: prazoId };
}

export async function salvarPrazoERedirecionar(input: SalvarPrazoInput) {
  const resultado = await salvarPrazo(input);
  if (resultado.ok) {
    redirect(`/prazos/${resultado.id}`);
  }
  return resultado;
}

export async function cumprirPrazo(id: string): Promise<SalvarPrazoResult> {
  await exigirSessao();
  try {
    const atualizado = await prisma.prazo.update({
      where: { id },
      data: { status: "CUMPRIDO", cumpridoEm: new Date() },
    });
    // TODO: sync Google Calendar
    revalidatePath("/prazos");
    revalidatePath(`/prazos/${id}`);
    return { ok: true, id: atualizado.id };
  } catch (error) {
    console.error("[prazos.cumprirPrazo]", error);
    return { ok: false, erro: "Não foi possível marcar o prazo como cumprido." };
  }
}

export async function cancelarPrazo(id: string): Promise<SalvarPrazoResult> {
  await exigirSessao();
  try {
    const atualizado = await prisma.prazo.update({
      where: { id },
      data: { status: "CANCELADO" },
    });
    // TODO: sync Google Calendar
    revalidatePath("/prazos");
    revalidatePath(`/prazos/${id}`);
    return { ok: true, id: atualizado.id };
  } catch (error) {
    console.error("[prazos.cancelarPrazo]", error);
    return { ok: false, erro: "Não foi possível cancelar o prazo." };
  }
}

const prorrogarSchema = z.object({
  id: z.string().min(1),
  novaData: z.coerce.date({ message: "Nova data inválida." }),
});

export async function prorrogarPrazo(
  id: string,
  novaData: Date | string,
): Promise<SalvarPrazoResult> {
  await exigirSessao();

  const parsed = prorrogarSchema.safeParse({ id, novaData });
  if (!parsed.success) {
    return { ok: false, erro: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    const atualizado = await prisma.prazo.update({
      where: { id: parsed.data.id },
      data: {
        status: "PRORROGADO",
        dataVencimento: parsed.data.novaData,
      },
    });
    // TODO: sync Google Calendar
    revalidatePath("/prazos");
    revalidatePath(`/prazos/${id}`);
    return { ok: true, id: atualizado.id };
  } catch (error) {
    console.error("[prazos.prorrogarPrazo]", error);
    return { ok: false, erro: "Não foi possível prorrogar o prazo." };
  }
}
