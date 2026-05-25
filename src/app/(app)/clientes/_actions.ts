"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { limpar } from "./_lib/cpf-cnpj";
import { clienteSchema, type ClienteInput } from "./_lib/schema";

type SalvarResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

async function exigirSessao() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

/**
 * Cria ou atualiza um cliente. Decide pela presença de `id`.
 */
export async function salvarCliente(input: ClienteInput): Promise<SalvarResult> {
  await exigirSessao();

  const parsed = clienteSchema.safeParse(input);
  if (!parsed.success) {
    const primeiro = parsed.error.issues[0];
    return {
      ok: false,
      error: primeiro?.message ?? "Dados inválidos.",
    };
  }

  const dados = parsed.data;
  const cpfCnpjDigitos = limpar(dados.cpfCnpj);

  const valores = {
    tipoPessoa: dados.tipoPessoa,
    nome: dados.nome,
    cpfCnpj: cpfCnpjDigitos,
    rg: dados.rg?.trim() || null,
    email: dados.email?.trim().toLowerCase() || null,
    telefone: dados.telefone?.trim() || null,
    endereco: dados.endereco?.trim() || null,
    cep: dados.cep ? limpar(dados.cep) : null,
    cidade: dados.cidade?.trim() || null,
    uf: dados.uf?.trim().toUpperCase() || null,
    observacoes: dados.observacoes?.trim() || null,
  };

  try {
    let id: string;
    if (dados.id) {
      const atualizado = await prisma.cliente.update({
        where: { id: dados.id },
        data: valores,
        select: { id: true },
      });
      id = atualizado.id;
    } else {
      const criado = await prisma.cliente.create({
        data: valores,
        select: { id: true },
      });
      id = criado.id;
    }

    revalidatePath("/clientes");
    revalidatePath(`/clientes/${id}`);

    return { ok: true, id };
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return {
        ok: false,
        error: "Já existe um cliente cadastrado com este CPF/CNPJ.",
      };
    }
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return { ok: false, error: "Cliente não encontrado." };
    }
    console.error("salvarCliente", err);
    return {
      ok: false,
      error: "Não foi possível salvar o cliente. Tente novamente.",
    };
  }
}

/**
 * Inverte o flag `ativo` de um cliente (inativar/reativar).
 */
export async function alternarAtivoCliente(id: string): Promise<SalvarResult> {
  await exigirSessao();

  try {
    const atual = await prisma.cliente.findUnique({
      where: { id },
      select: { id: true, ativo: true },
    });
    if (!atual) {
      return { ok: false, error: "Cliente não encontrado." };
    }

    await prisma.cliente.update({
      where: { id },
      data: { ativo: !atual.ativo },
    });

    revalidatePath("/clientes");
    revalidatePath(`/clientes/${id}`);

    return { ok: true, id };
  } catch (err) {
    console.error("alternarAtivoCliente", err);
    return {
      ok: false,
      error: "Não foi possível alterar o status do cliente.",
    };
  }
}
