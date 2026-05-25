"use client";

import { useRouter } from "next/navigation";
import { useMemo, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { salvarProcesso } from "../_actions";

const CNJ_REGEX = /^\d{7}-\d{2}\.\d{4}\.\d{1}\.\d{2}\.\d{4}$/;

const schema = z.object({
  numeroCnj: z
    .string()
    .min(1, "Informe o número CNJ")
    .refine((v) => CNJ_REGEX.test(v) || v.replace(/\D+/g, "").length === 20, {
      message: "Número CNJ inválido (20 dígitos ou formato canônico).",
    }),
  numeroAntigo: z.string().optional().nullable(),
  classeProcessual: z.string().min(1, "Classe processual é obrigatória."),
  tipo: z.enum(["JUDICIAL", "ADMINISTRATIVO", "EXTRAJUDICIAL"]),
  fase: z.enum([
    "PRE_PROCESSUAL",
    "CONHECIMENTO",
    "RECURSAL",
    "EXECUCAO",
    "CUMPRIMENTO_SENTENCA",
    "ARQUIVADO",
  ]),
  status: z.enum([
    "ATIVO",
    "SUSPENSO",
    "ARQUIVADO",
    "BAIXADO",
    "ENCERRADO",
  ]),
  sigiloso: z.boolean(),
  valorCausa: z.string().optional().nullable(),
  tribunalId: z.string().optional().nullable(),
  varaId: z.string().optional().nullable(),
  assuntoId: z.string().optional().nullable(),
  observacoes: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof schema>;

type Tribunal = { id: string; sigla: string; nome: string };
type Vara = { id: string; nome: string; tribunalId: string };
type Assunto = { id: string; nome: string };

type Props = {
  processo?: {
    id: string;
    numeroCnj: string;
    numeroAntigo: string | null;
    classeProcessual: string;
    tipo: FormValues["tipo"];
    fase: FormValues["fase"];
    status: FormValues["status"];
    sigiloso: boolean;
    valorCausa: string;
    tribunalId: string | null;
    varaId: string | null;
    assuntoId: string | null;
    observacoes: string | null;
  };
  tribunais: Tribunal[];
  varas: Vara[];
  assuntos: Assunto[];
};

export function ProcessoForm({ processo, tribunais, varas, assuntos }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      numeroCnj: processo?.numeroCnj ?? "",
      numeroAntigo: processo?.numeroAntigo ?? "",
      classeProcessual: processo?.classeProcessual ?? "",
      tipo: processo?.tipo ?? "JUDICIAL",
      fase: processo?.fase ?? "CONHECIMENTO",
      status: processo?.status ?? "ATIVO",
      sigiloso: processo?.sigiloso ?? false,
      valorCausa: processo?.valorCausa ?? "",
      tribunalId: processo?.tribunalId ?? "",
      varaId: processo?.varaId ?? "",
      assuntoId: processo?.assuntoId ?? "",
      observacoes: processo?.observacoes ?? "",
    },
  });

  const tribunalId = form.watch("tribunalId");
  const varasFiltradas = useMemo(
    () => (tribunalId ? varas.filter((v) => v.tribunalId === tribunalId) : []),
    [tribunalId, varas],
  );

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const res = await salvarProcesso({
        id: processo?.id,
        numeroCnj: values.numeroCnj,
        numeroAntigo: values.numeroAntigo || null,
        classeProcessual: values.classeProcessual,
        tipo: values.tipo,
        fase: values.fase,
        status: values.status,
        sigiloso: values.sigiloso,
        valorCausa: values.valorCausa || null,
        tribunalId: values.tribunalId || null,
        varaId: values.varaId || null,
        assuntoId: values.assuntoId || null,
        observacoes: values.observacoes || null,
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(processo ? "Processo atualizado." : "Processo cadastrado.");
      const newId = (res.data as { id: string } | undefined)?.id;
      router.push(`/processos/${newId ?? processo?.id}`);
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl"
    >
      <Field label="Nº CNJ *" error={form.formState.errors.numeroCnj?.message}>
        <Input
          {...form.register("numeroCnj")}
          placeholder="0000000-00.0000.0.00.0000"
        />
      </Field>

      <Field label="Nº antigo">
        <Input {...form.register("numeroAntigo")} />
      </Field>

      <Field
        label="Classe processual *"
        error={form.formState.errors.classeProcessual?.message}
        className="md:col-span-2"
      >
        <Input {...form.register("classeProcessual")} />
      </Field>

      <Field label="Tipo">
        <select
          {...form.register("tipo")}
          className="block h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="JUDICIAL">Judicial</option>
          <option value="ADMINISTRATIVO">Administrativo</option>
          <option value="EXTRAJUDICIAL">Extrajudicial</option>
        </select>
      </Field>

      <Field label="Fase">
        <select
          {...form.register("fase")}
          className="block h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="PRE_PROCESSUAL">Pré-processual</option>
          <option value="CONHECIMENTO">Conhecimento</option>
          <option value="RECURSAL">Recursal</option>
          <option value="EXECUCAO">Execução</option>
          <option value="CUMPRIMENTO_SENTENCA">Cumprimento de sentença</option>
          <option value="ARQUIVADO">Arquivado</option>
        </select>
      </Field>

      <Field label="Status">
        <select
          {...form.register("status")}
          className="block h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="ATIVO">Ativo</option>
          <option value="SUSPENSO">Suspenso</option>
          <option value="ARQUIVADO">Arquivado</option>
          <option value="BAIXADO">Baixado</option>
          <option value="ENCERRADO">Encerrado</option>
        </select>
      </Field>

      <Field label="Valor da causa (R$)">
        <Input
          {...form.register("valorCausa")}
          placeholder="0,00"
          inputMode="decimal"
        />
      </Field>

      <Field label="Tribunal">
        <select
          {...form.register("tribunalId", {
            onChange: () => form.setValue("varaId", ""),
          })}
          className="block h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">Selecione…</option>
          {tribunais.map((t) => (
            <option key={t.id} value={t.id}>
              {t.sigla} — {t.nome}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Vara">
        <select
          {...form.register("varaId")}
          disabled={!tribunalId}
          className="block h-10 w-full rounded-md border border-input bg-background px-3 text-sm disabled:opacity-50"
        >
          <option value="">Selecione…</option>
          {varasFiltradas.map((v) => (
            <option key={v.id} value={v.id}>
              {v.nome}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Assunto" className="md:col-span-2">
        <select
          {...form.register("assuntoId")}
          className="block h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">Selecione…</option>
          {assuntos.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nome}
            </option>
          ))}
        </select>
      </Field>

      <div className="md:col-span-2 flex items-center gap-2">
        <Checkbox
          id="sigiloso"
          checked={form.watch("sigiloso")}
          onCheckedChange={(v) => form.setValue("sigiloso", v === true)}
        />
        <Label htmlFor="sigiloso" className="cursor-pointer">
          Processo sigiloso
        </Label>
      </div>

      <Field label="Observações" className="md:col-span-2">
        <Textarea rows={4} {...form.register("observacoes")} />
      </Field>

      <div className="md:col-span-2 flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={pending}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando…" : "Salvar"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      <div className="mt-1">{children}</div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
