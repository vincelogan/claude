import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ClienteForm } from "../_components/cliente-form";

export const metadata = {
  title: "Novo cliente — Donnici Advogados",
};

export default function NovoClientePage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Novo cliente
          </h1>
          <p className="text-sm text-muted-foreground">
            Cadastre uma nova pessoa física ou jurídica para vincular a
            processos.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/clientes">Voltar</Link>
        </Button>
      </div>
      <ClienteForm modo="criar" />
    </div>
  );
}
