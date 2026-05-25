import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Calendar, Landmark } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  IntegracaoGoogleRevogadaError,
  marcarIntegracaoInvalida,
} from "@/lib/google/oauth";
import { listarCalendarios } from "@/lib/google/calendar";

import {
  GoogleSection,
  type CalendarioOpcao,
} from "./_components/google-section";
import { GoogleToast } from "./_components/google-toast";

// TODO: descomentar quando o componente de tribunais estiver disponível
// (outro agente está criando `./_components/tribunais-section`).
// import { TribunaisSection } from "./_components/tribunais-section";

export const dynamic = "force-dynamic";

export default async function IntegracoesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const usuarioId = session.user.id;

  const integracao = await prisma.integracaoGoogle.findUnique({
    where: { usuarioId },
    select: { ativa: true, calendarId: true },
  });
  const conectado = Boolean(integracao?.ativa);

  let calendarios: CalendarioOpcao[] = [];
  let erroListagem: string | null = null;

  if (conectado) {
    try {
      calendarios = await listarCalendarios(usuarioId);
    } catch (err) {
      if (err instanceof IntegracaoGoogleRevogadaError) {
        await marcarIntegracaoInvalida(usuarioId);
        erroListagem =
          "Sua sessão com o Google expirou. Reconecte para continuar.";
      } else {
        console.error(
          "[integracoes] falha ao listar calendários:",
          err instanceof Error ? err.message : "erro desconhecido",
        );
        erroListagem = "Não foi possível carregar seus calendários.";
      }
    }
  }

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <GoogleToast />
      </Suspense>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Integrações</h1>
        <p className="text-sm text-muted-foreground">
          Conecte sua conta a serviços externos para automatizar tarefas do
          escritório.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Google Calendar</CardTitle>
            </div>
            <CardDescription>
              Sincronize prazos e audiências com o seu Google Calendar
              automaticamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GoogleSection
              conectado={conectado}
              calendarioAtual={integracao?.calendarId ?? null}
              calendarios={calendarios}
              erroListagem={erroListagem}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Landmark className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Tribunais</CardTitle>
            </div>
            <CardDescription>
              Integrações com sistemas dos tribunais (PJe, eSAJ, Projudi,
              eProc).
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* TODO: substituir por <TribunaisSection /> assim que o
                componente do outro agente estiver disponível. */}
            <p className="text-sm text-muted-foreground">
              Integrações com tribunais — em desenvolvimento.
            </p>
            <ul className="mt-2 text-sm text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
