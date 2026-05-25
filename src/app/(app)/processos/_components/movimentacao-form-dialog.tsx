"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { TipoMovimentacao } from "@prisma/client";

import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";

import { criarMovimentacao } from "../_actions";

type Props = {
  processoId: string;
  trigger: React.ReactNode;
};

function hojeISO() {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60 * 1000).toISOString().slice(0, 10);
}

export function MovimentacaoFormDialog({ processoId, trigger }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const [data, setData] = useState(hojeISO());
  const [tipo, setTipo] = useState<TipoMovimentacao>("MANUAL");
  const [descricao, setDescricao] = useState("");

  function resetar() {
    setData(hojeISO());
    setTipo("MANUAL");
    setDescricao("");
  }

  function onSubmit() {
    if (!descricao.trim()) {
      toast.error("Descrição é obrigatória.");
      return;
    }
    startTransition(async () => {
      const res = await criarMovimentacao({
        processoId,
        data,
        descricao,
        tipo,
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Movimentação registrada.");
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
          <DialogTitle>Nova movimentação manual</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Data</Label>
              <Input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>
            <div>
              <Label>Tipo</Label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoMovimentacao)}
                className="mt-1 block h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="MANUAL">Manual</option>
                <option value="PUBLICACAO">Publicação</option>
                <option value="DESPACHO">Despacho</option>
                <option value="DECISAO">Decisão</option>
                <option value="SENTENCA">Sentença</option>
                <option value="ACORDAO">Acórdão</option>
                <option value="PETICAO">Petição</option>
                <option value="JUNTADA">Juntada</option>
                <option value="OUTRO">Outro</option>
              </select>
            </div>
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea
              rows={5}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
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
