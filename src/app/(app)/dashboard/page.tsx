import { Calendar, Clock, FileText } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const cards = [
  {
    label: "Processos ativos",
    valor: 0,
    descricao: "Em andamento no escritório",
    icon: FileText,
  },
  {
    label: "Prazos esta semana",
    valor: 0,
    descricao: "A vencer nos próximos 7 dias",
    icon: Clock,
  },
  {
    label: "Próximas audiências",
    valor: 0,
    descricao: "Agendadas para os próximos dias",
    icon: Calendar,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Painel</h1>
        <p className="text-sm text-muted-foreground">
          Visão geral do escritório.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{card.valor}</div>
                <CardDescription className="mt-1">
                  {card.descricao}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
