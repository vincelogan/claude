"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { salvarAudiencia } from "../_actions";

const TIPOS = [
  { value: "CONCILIACAO", label: "Conciliação" },
  { value: "INSTRUCAO", label: "Instrução" },
  { value: "JULGAMENTO", label: "Julgamento" },
  { value: "UNA", label: "Una" },
  { value: "CUSTODIA", label: "Custódia" },
  { value: "ARBITRAL", label: "Arbitral" },
  { value: "OUTRA", label: "Outra" },
] as const;

const audienciaFormSchema = z
  .object({
    id: z.string().optional(),
    processoId: z.string().min(1, "Selecione um processo."),
    tipo: z.enum([
      "CONCILIACAO",
      "INSTRUCAO",
      "JULGAMENTO",
      "UNA",
      "CUSTODIA",
      "ARBITRAL",
      "OUTRA",
    ]),
    dataHora: z.string().min(1, "Informe a data e a hora."),
    virtual: z.boolean().optional().default(false),
    local: z.string().trim().optional().or(z.literal("")),
    linkVirtual: z.string().trim().optional().or(z.literal("")),
    responsavelId: z.string().optional().or(z.literal("")),
    observacoes: z.string().trim().max(2000).optional().or(z.literal("")),
  })
  .superRefine((dados, ctx) => {
    if (dados.virtual) {
      if (!dados.linkVirtual || dados.linkVirtual.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["linkVirtual"],
          message: "Informe o link da audiência virtual.",
        });
      } else {
        try {
          new URL(dados.linkVirtual);
        } catch {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["linkVirtual"],
            message: "Link inválido. Use uma URL completa (https://...).",
          });
        }
      }
    } else if (!dados.local || dados.local.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["local"],
        message: "Informe o local da audiência.",
      });
    }
  });

export type AudienciaFormValues = z.infer<typeof audienciaFormSchema>;

type ProcessoOpcao = {
  id: string;
  numeroCnj: string;
  classeProcessual: string | null;
};

type UsuarioOpcao = {
  id: string;
  nome: string;
  email: string;
};

type AudienciaFormProps = {
  modo: "criar" | "editar";
  processos: ProcessoOpcao[];
  usuarios: UsuarioOpcao[];
  defaultValues?: Partial<AudienciaFormValues>;
};

const SEM_RESPONSAVEL = "__sem__";

export function AudienciaForm({
  modo,
  processos,
  usuarios,
  defaultValues,
}: AudienciaFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<AudienciaFormValues>({
    resolver: zodResolver(audienciaFormSchema),
    defaultValues: {
      id: defaultValues?.id,
      processoId: defaultValues?.processoId ?? "",
      tipo: (defaultValues?.tipo as AudienciaFormValues["tipo"]) ?? "CONCILIACAO",
      dataHora: defaultValues?.dataHora ?? "",
      virtual: defaultValues?.virtual ?? false,
      local: defaultValues?.local ?? "",
      linkVirtual: defaultValues?.linkVirtual ?? "",
      responsavelId: defaultValues?.responsavelId ?? "",
      observacoes: defaultValues?.observacoes ?? "",
    },
  });

  const virtual = form.watch("virtual");

  function onSubmit(values: AudienciaFormValues) {
    startTransition(async () => {
      const resultado = await salvarAudiencia({
        id: values.id,
        processoId: values.processoId,
        tipo: values.tipo,
        dataHora: new Date(values.dataHora),
        virtual: values.virtual ?? false,
        local: values.local || null,
        linkVirtual: values.linkVirtual || null,
        responsavelId:
          values.responsavelId && values.responsavelId !== SEM_RESPONSAVEL
            ? values.responsavelId
            : null,
        observacoes: values.observacoes || null,
      });

      if (!resultado.ok) {
        toast.error(resultado.erro);
        return;
      }

      toast.success(
        modo === "criar"
          ? "Audiência cadastrada com sucesso."
          : "Audiência atualizada com sucesso.",
      );
      router.push(`/audiencias/${resultado.id}`);
      router.refresh();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados da audiência</CardTitle>
            <CardDescription>
              Informações principais da audiência.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="processoId"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Processo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um processo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {processos.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.numeroCnj}
                          {p.classeProcessual ? ` — ${p.classeProcessual}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TIPOS.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dataHora"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data e hora</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="responsavelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsável</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || SEM_RESPONSAVEL}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione (opcional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={SEM_RESPONSAVEL}>
                        — Sem responsável definido —
                      </SelectItem>
                      {usuarios.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="virtual"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0 sm:col-span-2 sm:pt-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(v) => field.onChange(v === true)}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    Audiência virtual
                  </FormLabel>
                </FormItem>
              )}
            />

            {virtual ? (
              <FormField
                control={form.control}
                name="linkVirtual"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Link da audiência</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://meet.google.com/..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      URL completa (Google Meet, Zoom, Teams, etc.).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="local"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Local</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Fórum / Endereço da audiência"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
            <CardDescription>
              Notas internas sobre a audiência (opcional).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notas, preparação, partes envolvidas..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={pending}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={pending}>
            {pending
              ? "Salvando..."
              : modo === "criar"
                ? "Cadastrar audiência"
                : "Salvar alterações"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
