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
import { Checkbox } from "@/components/ui/checkbox";

import { salvarPrazo } from "../_actions";

/**
 * Schema usado apenas no client para validação do formulário (espelha
 * o schema do server action, mas com tipos vindos do <input type="date" />).
 */
const prazoFormSchema = z
  .object({
    id: z.string().optional(),
    titulo: z
      .string()
      .trim()
      .min(3, "Informe um título com pelo menos 3 caracteres."),
    descricao: z.string().trim().max(2000).optional().or(z.literal("")),
    processoId: z.string().optional().or(z.literal("")),
    dataInicio: z.string().min(1, "Informe a data de início."),
    dataVencimento: z.string().min(1, "Informe a data de vencimento."),
    fatal: z.boolean().optional().default(false),
    diasCorridos: z.boolean().optional().default(false),
    responsavelId: z.string().min(1, "Selecione um responsável."),
    observacoes: z.string().trim().max(2000).optional().or(z.literal("")),
  })
  .refine(
    (dados) => {
      const ini = new Date(dados.dataInicio);
      const venc = new Date(dados.dataVencimento);
      return venc.getTime() >= ini.getTime();
    },
    {
      message: "A data de vencimento deve ser igual ou posterior à data de início.",
      path: ["dataVencimento"],
    },
  );

export type PrazoFormValues = z.infer<typeof prazoFormSchema>;

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

type PrazoFormProps = {
  modo: "criar" | "editar";
  processos: ProcessoOpcao[];
  usuarios: UsuarioOpcao[];
  defaultValues?: Partial<PrazoFormValues>;
  responsavelPadraoId?: string;
};

const NENHUM_PROCESSO = "__nenhum__";

function hojeISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function PrazoForm({
  modo,
  processos,
  usuarios,
  defaultValues,
  responsavelPadraoId,
}: PrazoFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<PrazoFormValues>({
    resolver: zodResolver(prazoFormSchema),
    defaultValues: {
      id: defaultValues?.id,
      titulo: defaultValues?.titulo ?? "",
      descricao: defaultValues?.descricao ?? "",
      processoId: defaultValues?.processoId ?? "",
      dataInicio: defaultValues?.dataInicio ?? hojeISO(),
      dataVencimento: defaultValues?.dataVencimento ?? hojeISO(),
      fatal: defaultValues?.fatal ?? false,
      diasCorridos: defaultValues?.diasCorridos ?? false,
      responsavelId:
        defaultValues?.responsavelId ?? responsavelPadraoId ?? "",
      observacoes: defaultValues?.observacoes ?? "",
    },
  });

  function onSubmit(values: PrazoFormValues) {
    startTransition(async () => {
      const resultado = await salvarPrazo({
        id: values.id,
        titulo: values.titulo,
        descricao: values.descricao || null,
        processoId:
          values.processoId && values.processoId !== NENHUM_PROCESSO
            ? values.processoId
            : null,
        dataInicio: new Date(values.dataInicio),
        dataVencimento: new Date(values.dataVencimento),
        fatal: values.fatal ?? false,
        diasCorridos: values.diasCorridos ?? false,
        responsavelId: values.responsavelId,
        observacoes: values.observacoes || null,
      });

      if (!resultado.ok) {
        toast.error(resultado.erro);
        return;
      }

      toast.success(
        modo === "criar"
          ? "Prazo cadastrado com sucesso."
          : "Prazo atualizado com sucesso.",
      );
      router.push(`/prazos/${resultado.id}`);
      router.refresh();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados do prazo</CardTitle>
            <CardDescription>
              Informações principais do prazo processual ou administrativo.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex.: Contestação — Ação de Cobrança"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="processoId"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Processo (opcional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || NENHUM_PROCESSO}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um processo (opcional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={NENHUM_PROCESSO}>
                        — Nenhum (prazo administrativo) —
                      </SelectItem>
                      {processos.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.numeroCnj}
                          {p.classeProcessual ? ` — ${p.classeProcessual}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Vincule a um processo ou deixe em branco para prazo
                    administrativo.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dataInicio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de início</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dataVencimento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de vencimento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um responsável" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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

            <div className="flex flex-col gap-3 pt-2 sm:pt-7">
              <FormField
                control={form.control}
                name="fatal"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(v) => field.onChange(v === true)}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Prazo fatal (preclusivo)
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="diasCorridos"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start gap-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(v) => field.onChange(v === true)}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-normal">
                        Contar em dias corridos
                      </FormLabel>
                      <FormDescription>
                        Desmarque para dias úteis (regra CPC, art. 219).
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalhes</CardTitle>
            <CardDescription>
              Descrição e observações internas (opcional).
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="O que precisa ser feito até o vencimento."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notas internas (opcional)."
                      rows={3}
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
                ? "Cadastrar prazo"
                : "Salvar alterações"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
