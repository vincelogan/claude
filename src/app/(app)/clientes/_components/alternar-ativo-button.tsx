"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { alternarAtivoCliente } from "../_actions";

type Props = {
  id: string;
  ativo: boolean;
  variant?: "ghost" | "outline" | "default" | "secondary";
  size?: "sm" | "default";
  className?: string;
};

export function AlternarAtivoButton({
  id,
  ativo,
  variant = "ghost",
  size = "sm",
  className,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const resultado = await alternarAtivoCliente(id);
      if (!resultado.ok) {
        toast.error(resultado.error);
        return;
      }
      toast.success(ativo ? "Cliente inativado." : "Cliente reativado.");
      router.refresh();
    });
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={pending}
      className={className}
    >
      {pending ? "..." : ativo ? "Inativar" : "Reativar"}
    </Button>
  );
}
