"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  audienciaSchema,
  type SalvarAudienciaInput,
  type SalvarAudienciaResult,
} from "./_lib/schema";

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

export async function salvarAudiencia(
  input: SalvarAudienciaInput,
): Promise<SalvarAudienciaResult> {
  await exigirSessao();

  const parsed = audienciaSchema.safeParse(input);
  if (!parsed.success) {
    const primeiro = parsed.error.issues[0]?.message ?? "Dados inválidos.";
    return { ok: false, erro: primeiro };
  }

  const dados = parsed.data;
  const payload = {
    processoId: dados.processoId,
    tipo: dados.tipo,
    dataHora: dados.dataHora,
    virtual: dados.virtual,
    local: dados.virtual ? null : normalizarOpcional(dados.local),
    linkVirtual: dados.virtual ? normalizarOpcional(dados.linkVirtual) : null,
    responsavelId: normalizarOpcional(dados.responsavelId),
    observacoes: normalizarOpcional(dados.observacoes),
  };

  let audienciaId: string;
  try {
    if (dados.id) {
      const atualizada = await prisma.audiencia.update({
        where: { id: dados.id },
        data: payload,
      });
      audienciaId = atualizada.id;
    } else {
      const criada = await prisma.audiencia.create({ data: payload });
      audienciaId = criada.id;
    }
  } catch (error) {
    console.error("[audiencias.salvarAudiencia]", error);
    return { ok: false, erro: "Não foi possível salvar a audiência." };
  }

  // TODO: sync Google Calendar (outro agente cuida desta integração).

  revalidatePath("/audiencias");
  revalidatePath(`/audiencias/${audienciaId}`);
  return { ok: true, id: audienciaId };
}

export async function salvarAudienciaERedirecionar(
  input: SalvarAudienciaInput,
) {
  const resultado = await salvarAudiencia(input);
  if (resultado.ok) {
    redirect(`/audiencias/${resultado.id}`);
  }
  return resultado;
}

export async function marcarRealizada(
  id: string,
  resultado?: string | null,
): Promise<SalvarAudienciaResult> {
  await exigirSessao();
  try {
    const atualizada = await prisma.audiencia.update({
      where: { id },
      data: {
        status: "REALIZADA",
        resultado: normalizarOpcional(resultado),
      },
    });
    // TODO: sync Google Calendar
    revalidatePath("/audiencias");
    revalidatePath(`/audiencias/${id}`);
    return { ok: true, id: atualizada.id };
  } catch (error) {
    console.error("[audiencias.marcarRealizada]", error);
    return {
      ok: false,
      erro: "Não foi possível marcar a audiência como realizada.",
    };
  }
}

const adiarSchema = z.object({
  id: z.string().min(1),
  novaDataHora: z.coerce.date({ message: "Nova data/hora inválida." }),
  duplicar: z.boolean().optional().default(true),
});

export async function adiarAudiencia(
  id: string,
  novaDataHora: Date | string,
  duplicar = true,
): Promise<SalvarAudienciaResult> {
  await exigirSessao();

  const parsed = adiarSchema.safeParse({ id, novaDataHora, duplicar });
  if (!parsed.success) {
    return {
      ok: false,
      erro: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  try {
    const atual = await prisma.audiencia.findUnique({
      where: { id: parsed.data.id },
    });
    if (!atual) {
      return { ok: false, erro: "Audiência não encontrada." };
    }

    await prisma.audiencia.update({
      where: { id: parsed.data.id },
      data: { status: "ADIADA" },
    });

    let novoId = parsed.data.id;
    if (parsed.data.duplicar) {
      const nova = await prisma.audiencia.create({
        data: {
          processoId: atual.processoId,
          tipo: atual.tipo,
          dataHora: parsed.data.novaDataHora,
          local: atual.local,
          virtual: atual.virtual,
          linkVirtual: atual.linkVirtual,
          responsavelId: atual.responsavelId,
          observacoes: atual.observacoes,
          status: "AGENDADA",
        },
      });
      novoId = nova.id;
    }

    // TODO: sync Google Calendar
    revalidatePath("/audiencias");
    revalidatePath(`/audiencias/${parsed.data.id}`);
    revalidatePath(`/audiencias/${novoId}`);
    return { ok: true, id: novoId };
  } catch (error) {
    console.error("[audiencias.adiarAudiencia]", error);
    return { ok: false, erro: "Não foi possível adiar a audiência." };
  }
}

export async function cancelarAudiencia(
  id: string,
): Promise<SalvarAudienciaResult> {
  await exigirSessao();
  try {
    const atualizada = await prisma.audiencia.update({
      where: { id },
      data: { status: "CANCELADA" },
    });
    // TODO: sync Google Calendar
    revalidatePath("/audiencias");
    revalidatePath(`/audiencias/${id}`);
    return { ok: true, id: atualizada.id };
  } catch (error) {
    console.error("[audiencias.cancelarAudiencia]", error);
    return { ok: false, erro: "Não foi possível cancelar a audiência." };
  }
}
