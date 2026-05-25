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
import { Label } from "@/components/ui/label";

import { adicionarResponsavel } from "../_actions";

type Usuario = {
  id: string;
  nome: string;
  oab: string | null;
  perfil: string;
};

type Props = {
  processoId: string;
  usuarios: Usuario[];
  trigger: React.ReactNode;
};

export function ResponsavelFormDialog({
  processoId,
  usuarios,
  trigger,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [usuarioId, setUsuarioId] = useState("");
  const [principal, setPrincipal] = useState(false);

  function resetar() {
    setUsuarioId("");
    setPrincipal(false);
  }

  function onSubmit() {
    if (!usuarioId) {
      toast.error("Selecione um advogado.");
      return;
    }
    startTransition(async () => {
      const res = await adicionarResponsavel(processoId, usuarioId, principal);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Responsável adicionado.");
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
          <DialogTitle>Adicionar responsável</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label>Advogado</Label>
            <select
              value={usuarioId}
              onChange={(e) => setUsuarioId(e.target.value)}
              className="mt-1 block h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Selecione…</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome} {u.oab ? `(OAB ${u.oab})` : ""} — {u.perfil}
                </option>
              ))}
            </select>
            {usuarios.length === 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Não há advogados disponíveis para adicionar.
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="principal"
              checked={principal}
              onCheckedChange={(v) => setPrincipal(v === true)}
            />
            <Label htmlFor="principal" className="cursor-pointer">
              Responsável principal (substitui o atual)
            </Label>
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
          <Button
            onClick={onSubmit}
            disabled={pending || usuarios.length === 0}
          >
            {pending ? "Salvando…" : "Adicionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
