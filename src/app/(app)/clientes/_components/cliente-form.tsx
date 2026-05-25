"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

import { salvarCliente } from "../_actions";
import { clienteSchema, type ClienteInput } from "../_lib/schema";

type ClienteFormProps = {
  defaultValues?: Partial<ClienteInput>;
  modo: "criar" | "editar";
};

const VALORES_PADRAO: ClienteInput = {
  tipoPessoa: "PF",
  nome: "",
  cpfCnpj: "",
  rg: "",
  email: "",
  telefone: "",
  endereco: "",
  cep: "",
  cidade: "",
  uf: "",
  observacoes: "",
};

export function ClienteForm({ defaultValues, modo }: ClienteFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<ClienteInput>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      ...VALORES_PADRAO,
      ...defaultValues,
    },
  });

  const tipoPessoa = form.watch("tipoPessoa");

  function onSubmit(values: ClienteInput) {
    startTransition(async () => {
      const resultado = await salvarCliente(values);
      if (!resultado.ok) {
        toast.error(resultado.error);
        return;
      }
      toast.success(
        modo === "criar"
          ? "Cliente cadastrado com sucesso."
          : "Cliente atualizado com sucesso.",
      );
      router.push(`/clientes/${resultado.id}`);
      router.refresh();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados principais</CardTitle>
            <CardDescription>
              Identificação do cliente (pessoa física ou jurídica).
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="tipoPessoa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de pessoa</FormLabel>
                  <Select
                    onValueChange={(valor) => {
                      field.onChange(valor);
                      // Limpa o CPF/CNPJ ao trocar de tipo para evitar valor inválido residual.
                      form.setValue("cpfCnpj", "");
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PF">Pessoa física</SelectItem>
                      <SelectItem value="PJ">Pessoa jurídica</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpfCnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {tipoPessoa === "PJ" ? "CNPJ" : "CPF"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        tipoPessoa === "PJ"
                          ? "00.000.000/0000-00"
                          : "000.000.000-00"
                      }
                      inputMode="numeric"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>
                    {tipoPessoa === "PJ" ? "Razão social" : "Nome completo"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        tipoPessoa === "PJ"
                          ? "Empresa LTDA"
                          : "Maria da Silva"
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {tipoPessoa === "PJ" ? "Inscrição estadual" : "RG"}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Opcional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contato e endereço</CardTitle>
            <CardDescription>
              Informações de contato e localização do cliente.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="contato@exemplo.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="(00) 00000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endereco"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Rua, número, complemento, bairro"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input placeholder="00000-000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input placeholder="São Paulo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="uf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UF</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="SP"
                      maxLength={2}
                      className="uppercase"
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
                <FormItem className="sm:col-span-2">
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notas internas sobre o cliente"
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
                ? "Cadastrar cliente"
                : "Salvar alterações"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
