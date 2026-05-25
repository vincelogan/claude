"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { salvarParte } from "../_actions";

type Cliente = { id: string; nome: string; cpfCnpj: string };

type Props = {
  processoId: string;
  clientes: Cliente[];
  trigger: React.ReactNode;
};

export function ParteFormDialog({ processoId, clientes, trigger }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const [ehCliente, setEhCliente] = useState(true);
  const [clienteId, setClienteId] = useState("");
  const [nome, setNome] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [polo, setPolo] = useState<"ATIVO" | "PASSIVO" | "TERCEIRO" | "OUTRO">(
    "ATIVO",
  );
  const [tipoParte, setTipoParte] = useState<
    | "PARTE_PRINCIPAL"
    | "ADVOGADO_CONTRARIO"
    | "TERCEIRO_INTERESSADO"
    | "TESTEMUNHA"
    | "PERITO"
  >("PARTE_PRINCIPAL");

  function resetar() {
    setEhCliente(true);
    setClienteId("");
    setNome("");
    setCpfCnpj("");
    setPolo("ATIVO");
    setTipoParte("PARTE_PRINCIPAL");
  }

  function onSubmit() {
    if (ehCliente && !clienteId) {
      toast.error("Selecione um cliente.");
      return;
    }
    if (!ehCliente && !nome.trim()) {
      toast.error("Informe o nome da parte.");
      return;
    }
    startTransition(async () => {
      const res = await salvarParte({
        processoId,
        clienteId: ehCliente ? clienteId : null,
        nome: ehCliente ? "" : nome,
        cpfCnpj: ehCliente ? null : cpfCnpj,
        polo,
        tipoParte,
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Parte adicionada.");
      setOpen(false);
      resetar();
      router.refresh();
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) resetar();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar parte</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="ehCliente"
              checked={ehCliente}
              onCheckedChange={(v) => setEhCliente(v === true)}
            />
            <Label htmlFor="ehCliente" className="cursor-pointer">
              É um cliente cadastrado?
            </Label>
          </div>

          {ehCliente ? (
            <div>
              <Label>Cliente</Label>
              <select
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
                className="mt-1 block h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Selecione…</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome} — {c.cpfCnpj}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <Label>Nome</Label>
                <Input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Label>CPF / CNPJ</Label>
                <Input
                  value={cpfCnpj}
                  onChange={(e) => setCpfCnpj(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Polo</Label>
              <select
                value={polo}
                onChange={(e) =>
                  setPolo(e.target.value as typeof polo)
                }
                className="mt-1 block h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="ATIVO">Ativo</option>
                <option value="PASSIVO">Passivo</option>
                <option value="TERCEIRO">Terceiro</option>
                <option value="OUTRO">Outro</option>
              </select>
            </div>
            <div>
              <Label>Tipo</Label>
              <select
                value={tipoParte}
                onChange={(e) =>
                  setTipoParte(e.target.value as typeof tipoParte)
                }
                className="mt-1 block h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="PARTE_PRINCIPAL">Parte principal</option>
                <option value="ADVOGADO_CONTRARIO">Advogado contrário</option>
                <option value="TERCEIRO_INTERESSADO">
                  Terceiro interessado
                </option>
                <option value="TESTEMUNHA">Testemunha</option>
                <option value="PERITO">Perito</option>
              </select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={pending}
          >
            Cancelar
          </Button>
          <Button onClick={onSubmit} disabled={pending}>
            {pending ? "Salvando…" : "Adicionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
