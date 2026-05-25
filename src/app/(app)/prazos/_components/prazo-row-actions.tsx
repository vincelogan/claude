"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Check, MoreHorizontal, Pencil, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cancelarPrazo, cumprirPrazo } from "../_actions";

type Props = {
  id: string;
  cumprivel: boolean;
};

export function PrazoRowActions({ id, cumprivel }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleCumprir() {
    startTransition(async () => {
      const r = await cumprirPrazo(id);
      if (!r.ok) {
        toast.error(r.erro);
        return;
      }
      toast.success("Prazo marcado como cumprido.");
      router.refresh();
    });
  }

  function handleCancelar() {
    startTransition(async () => {
      const r = await cancelarPrazo(id);
      if (!r.ok) {
        toast.error(r.erro);
        return;
      }
      toast.success("Prazo cancelado.");
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
        {cumprivel ? (
          <DropdownMenuItem onSelect={handleCumprir}>
            <Check className="mr-2 h-4 w-4" />
            Cumprir
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem asChild>
          <Link href={`/prazos/${id}`}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Link>
        </DropdownMenuItem>
        {cumprivel ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleCancelar} className="text-destructive">
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
