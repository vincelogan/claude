"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Check, Clock, MoreHorizontal, Pencil, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  adiarAudiencia,
  cancelarAudiencia,
  marcarRealizada,
} from "../_actions";

type Props = {
  id: string;
  acionavel: boolean;
};

export function AudienciaRowActions({ id, acionavel }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleRealizada() {
    startTransition(async () => {
      const r = await marcarRealizada(id);
      if (!r.ok) {
        toast.error(r.erro);
        return;
      }
      toast.success("Audiência marcada como realizada.");
      router.refresh();
    });
  }

  function handleAdiar() {
    const entrada = window.prompt(
      "Nova data/hora (AAAA-MM-DD HH:mm):",
      "",
    );
    if (!entrada) return;
    const nova = new Date(entrada.replace(" ", "T"));
    if (Number.isNaN(nova.getTime())) {
      toast.error("Data/hora inválida.");
      return;
    }
    startTransition(async () => {
      const r = await adiarAudiencia(id, nova, true);
      if (!r.ok) {
        toast.error(r.erro);
        return;
      }
      toast.success("Audiência adiada e reagendada.");
      router.refresh();
    });
  }

  function handleCancelar() {
    startTransition(async () => {
      const r = await cancelarAudiencia(id);
      if (!r.ok) {
        toast.error(r.erro);
        return;
      }
      toast.success("Audiência cancelada.");
      router.refresh();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={pending}>
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Ações</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {acionavel ? (
          <>
            <DropdownMenuItem onSelect={handleRealizada}>
              <Check className="mr-2 h-4 w-4" /> Marcar realizada
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleAdiar}>
              <Clock className="mr-2 h-4 w-4" /> Adiar
            </DropdownMenuItem>
          </>
        ) : null}
        <DropdownMenuItem asChild>
          <Link href={`/audiencias/${id}`}>
            <Pencil className="mr-2 h-4 w-4" /> Editar
          </Link>
        </DropdownMenuItem>
        {acionavel ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={handleCancelar}
              className="text-destructive"
            >
              <X className="mr-2 h-4 w-4" /> Cancelar
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
