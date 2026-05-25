"use client";

import { useEffect, useState, useTransition } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { atualizarCalendarioPadrao } from "../_actions";

export type CalendarioOpcao = {
  id: string;
  summary: string;
  primary: boolean;
};

type Props = {
  conectado: boolean;
  calendarioAtual: string | null;
  calendarios: CalendarioOpcao[];
  erroListagem: string | null;
};

export function GoogleSection({
  conectado,
  calendarioAtual,
  calendarios,
  erroListagem,
}: Props) {
  const [valor, setValor] = useState<string>(calendarioAtual ?? "primary");
  const [pendente, startTransition] = useTransition();

  useEffect(() => {
    setValor(calendarioAtual ?? "primary");
  }, [calendarioAtual]);

  function handleChange(novo: string) {
    if (novo === valor) return;
    const anterior = valor;
    setValor(novo);
    startTransition(async () => {
      const res = await atualizarCalendarioPadrao(novo);
      if (res.ok) {
        toast.success("Calendário padrão atualizado.");
      } else {
        setValor(anterior);
        toast.error(res.mensagem);
      }
    });
  }

  if (!conectado) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Conecte sua conta Google para sincronizar prazos e audiências
          automaticamente com o seu Google Calendar.
        </p>
        <Button asChild>
          <a href="/api/integracoes/google/conectar">Conectar com Google</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-emerald-600">
        <CheckCircle2 className="h-4 w-4" />
        <span>Google Calendar conectado.</span>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="calendario">
          Calendário padrão
        </label>
        {erroListagem ? (
          <p className="text-sm text-destructive">{erroListagem}</p>
        ) : (
          <div className="flex items-center gap-2">
            <Select
              value={valor}
              onValueChange={handleChange}
              disabled={pendente || calendarios.length === 0}
            >
              <SelectTrigger id="calendario" className="max-w-md">
                <SelectValue placeholder="Selecione um calendário" />
              </SelectTrigger>
              <SelectContent>
                {calendarios.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.summary}
                    {c.primary ? " (principal)" : ""}
                  </SelectItem>
                ))}
                {/* Garante "primary" como opção mesmo se a API não listar. */}
                {!calendarios.some((c) => c.id === "primary") ? (
                  <SelectItem value="primary">primary</SelectItem>
                ) : null}
              </SelectContent>
            </Select>
            {pendente ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : null}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Os eventos de prazos e audiências serão criados neste calendário.
        </p>
      </div>

      <form action="/api/integracoes/google/desconectar" method="post">
        <Button type="submit" variant="destructive">
          Desconectar
        </Button>
      </form>
    </div>
  );
}
