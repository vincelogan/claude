import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { AlternarAtivoButton } from "../_components/alternar-ativo-button";
import { ClienteForm } from "../_components/cliente-form";
import { formatarCpfCnpj } from "../_lib/cpf-cnpj";

type Params = { id: string };

export default async function ClienteDetalhePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;

  const cliente = await prisma.cliente.findUnique({
    where: { id },
    include: {
      partes: {
        orderBy: { processo: { criadoEm: "desc" } },
        include: {
          processo: {
            select: {
              id: true,
              numeroCnj: true,
              classeProcessual: true,
              status: true,
              fase: true,
            },
          },
        },
      },
    },
  });

  if (!cliente) {
    notFound();
  }

  const formDefaults = {
    id: cliente.id,
    tipoPessoa: cliente.tipoPessoa,
    nome: cliente.nome,
    cpfCnpj: cliente.cpfCnpj,
    rg: cliente.rg ?? "",
    email: cliente.email ?? "",
    telefone: cliente.telefone ?? "",
    endereco: cliente.endereco ?? "",
    cep: cliente.cep ?? "",
    cidade: cliente.cidade ?? "",
    uf: cliente.uf ?? "",
    observacoes: cliente.observacoes ?? "",
  } as const;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {cliente.nome}
            </h1>
            <Badge
              variant={cliente.tipoPessoa === "PJ" ? "secondary" : "default"}
            >
              {cliente.tipoPessoa === "PJ"
                ? "Pessoa jurídica"
                : "Pessoa física"}
            </Badge>
            {!cliente.ativo ? (
              <Badge variant="outline">Inativo</Badge>
            ) : null}
          </div>
          <p className="font-mono text-sm text-muted-foreground">
            {formatarCpfCnpj(cliente.cpfCnpj, cliente.tipoPessoa)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/clientes">Voltar</Link>
          </Button>
          <AlternarAtivoButton
            id={cliente.id}
            ativo={cliente.ativo}
            variant="outline"
            size="default"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
          <CardDescription>
            Informações cadastradas para este cliente.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
          <Campo rotulo="Nome / Razão social" valor={cliente.nome} />
          <Campo
            rotulo={cliente.tipoPessoa === "PJ" ? "CNPJ" : "CPF"}
            valor={formatarCpfCnpj(cliente.cpfCnpj, cliente.tipoPessoa)}
          />
          <Campo
            rotulo={
              cliente.tipoPessoa === "PJ" ? "Inscrição estadual" : "RG"
            }
            valor={cliente.rg}
          />
          <Campo rotulo="E-mail" valor={cliente.email} />
          <Campo rotulo="Telefone" valor={cliente.telefone} />
          <Campo rotulo="CEP" valor={cliente.cep} />
          <Campo
            rotulo="Endereço"
            valor={cliente.endereco}
            className="sm:col-span-2"
          />
          <Campo
            rotulo="Cidade / UF"
            valor={
              cliente.cidade
                ? `${cliente.cidade}${cliente.uf ? ` / ${cliente.uf}` : ""}`
                : null
            }
          />
          <Campo rotulo="Cadastrado em" valor={formatarData(cliente.criadoEm)} />
          {cliente.observacoes ? (
            <div className="sm:col-span-2">
              <Separator className="my-2" />
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Observações
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm">
                {cliente.observacoes}
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Processos ({cliente.partes.length})
          </CardTitle>
          <CardDescription>
            Processos em que este cliente figura como parte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cliente.partes.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Nenhum processo vinculado a este cliente.
            </p>
          ) : (
            <ul className="divide-y">
              {cliente.partes.map((parte) => (
                <li
                  key={parte.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-3"
                >
                  <div>
                    <Link
                      href={`/processos/${parte.processo.id}`}
                      className="font-mono text-sm font-medium hover:underline"
                    >
                      {parte.processo.numeroCnj}
                    </Link>
                    {parte.processo.classeProcessual ? (
                      <p className="text-xs text-muted-foreground">
                        {parte.processo.classeProcessual}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      Polo {parte.polo.toLowerCase()}
                    </Badge>
                    <Badge variant="secondary">
                      {parte.processo.status.toLowerCase()}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold tracking-tight">
          Editar cadastro
        </h2>
        <p className="text-sm text-muted-foreground">
          Atualize os dados do cliente. As alterações são salvas
          imediatamente.
        </p>
      </div>
      <ClienteForm modo="editar" defaultValues={formDefaults} />
    </div>
  );
}

function Campo({
  rotulo,
  valor,
  className,
}: {
  rotulo: string;
  valor: string | null | undefined;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs font-medium uppercase text-muted-foreground">
        {rotulo}
      </p>
      <p className="mt-1 text-sm">{valor || "—"}</p>
    </div>
  );
}

function formatarData(data: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(data);
}
