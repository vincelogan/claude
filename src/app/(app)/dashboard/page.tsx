import { addDays, startOfDay } from "date-fns";
import { Calendar, Clock, FileText, Users, AlertTriangle } from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

async function getDashboardData(usuarioId: string) {
  const hoje = startOfDay(new Date());
  const em7dias = addDays(hoje, 7);
  const em30dias = addDays(hoje, 30);

  const [
    processosAtivos,
    totalClientes,
    prazosNaSemana,
    prazosVencidos,
    audienciasProximas,
    prazosUrgentes,
  ] = await Promise.all([
    prisma.processo.count({ where: { status: "ATIVO" } }),
    prisma.cliente.count({ where: { ativo: true } }),
    prisma.prazo.count({
      where: {
        status: "PENDENTE",
        dataVencimento: { gte: hoje, lte: em7dias },
      },
    }),
    prisma.prazo.count({
      where: {
        status: "PENDENTE",
        dataVencimento: { lt: hoje },
      },
    }),
    prisma.audiencia.findMany({
      where: {
        status: "AGENDADA",
        dataHora: { gte: hoje, lte: em30dias },
      },
      include: { processo: { select: { numeroCnj: true, classeProcessual: true } } },
      orderBy: { dataHora: "asc" },
      take: 5,
    }),
    prisma.prazo.findMany({
      where: {
        status: "PENDENTE",
        dataVencimento: { gte: hoje, lte: em7dias },
        responsavelId: usuarioId,
      },
      include: { processo: { select: { numeroCnj: true } } },
      orderBy: { dataVencimento: "asc" },
      take: 5,
    }),
  ]);

  return {
    processosAtivos,
    totalClientes,
    prazosNaSemana,
    prazosVencidos,
    audienciasProximas,
    prazosUrgentes,
  };
}

export default async function DashboardPage() {
  const session = await auth();
  const usuarioId = session?.user?.id ?? "";
  const dados = await getDashboardData(usuarioId);

  const cards = [
    {
      label: "Processos ativos",
      valor: dados.processosAtivos,
      descricao: "Em andamento no escritório",
      icon: FileText,
      href: "/processos",
      destaque: false,
    },
    {
      label: "Clientes ativos",
      valor: dados.totalClientes,
      descricao: "Cadastrados no sistema",
      icon: Users,
      href: "/clientes",
      destaque: false,
    },
    {
      label: "Prazos esta semana",
      valor: dados.prazosNaSemana,
      descricao: "A vencer nos próximos 7 dias",
      icon: Clock,
      href: "/prazos",
      destaque: dados.prazosNaSemana > 0,
    },
    {
      label: "Prazos vencidos",
      valor: dados.prazosVencidos,
      descricao: "Pendentes e já vencidos",
      icon: AlertTriangle,
      href: "/prazos?status=PENDENTE",
      destaque: dados.prazosVencidos > 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Painel</h1>
        <p className="text-sm text-muted-foreground">
          Visão geral do escritório.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href}>
              <Card className={`transition-colors hover:bg-muted/50 ${card.destaque ? "border-orange-400" : ""}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.label}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${card.destaque ? "text-orange-500" : "text-muted-foreground"}`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-semibold ${card.destaque && card.valor > 0 ? "text-orange-600" : ""}`}>
                    {card.valor}
                  </div>
                  <CardDescription className="mt-1">{card.descricao}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Próximas audiências */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4" />
              Próximas audiências
            </CardTitle>
            <CardDescription>Próximos 30 dias</CardDescription>
          </CardHeader>
          <CardContent>
            {dados.audienciasProximas.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma audiência agendada.</p>
            ) : (
              <ul className="space-y-3">
                {dados.audienciasProximas.map((a) => (
                  <li key={a.id} className="flex items-start justify-between gap-2 text-sm">
                    <div className="min-w-0">
                      <p className="font-medium truncate">
                        {a.processo.classeProcessual ?? a.processo.numeroCnj}
                      </p>
                      <p className="text-muted-foreground">
                        {format(a.dataHora, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0">{a.tipo}</Badge>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/audiencias" className="mt-4 block text-xs text-muted-foreground underline-offset-2 hover:underline">
              Ver todas →
            </Link>
          </CardContent>
        </Card>

        {/* Meus prazos urgentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4" />
              Meus prazos desta semana
            </CardTitle>
            <CardDescription>Prazos pendentes com você nos próximos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            {dados.prazosUrgentes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum prazo esta semana.</p>
            ) : (
              <ul className="space-y-3">
                {dados.prazosUrgentes.map((p) => {
                  const dias = Math.ceil(
                    (p.dataVencimento.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  );
                  return (
                    <li key={p.id} className="flex items-start justify-between gap-2 text-sm">
                      <div className="min-w-0">
                        <p className="font-medium truncate">{p.titulo}</p>
                        {p.processo && (
                          <p className="text-xs text-muted-foreground truncate">{p.processo.numeroCnj}</p>
                        )}
                      </div>
                      <Badge
                        variant={dias <= 1 ? "destructive" : dias <= 3 ? "outline" : "secondary"}
                        className="shrink-0"
                      >
                        {dias === 0 ? "hoje" : dias === 1 ? "amanhã" : `${dias}d`}
                        {p.fatal ? " ⚠" : ""}
                      </Badge>
                    </li>
                  );
                })}
              </ul>
            )}
            <Link href="/prazos" className="mt-4 block text-xs text-muted-foreground underline-offset-2 hover:underline">
              Ver todos →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
