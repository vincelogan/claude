"use client";

import { signOut } from "next-auth/react";
import { LogOut, UserCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const perfilLabels: Record<string, string> = {
  ADMIN: "Administrador(a)",
  ADVOGADO: "Advogado(a)",
  ESTAGIARIO: "Estagiário(a)",
  SECRETARIA: "Secretaria",
};

export function UserMenu({
  nome,
  email,
  perfil,
}: {
  nome: string;
  email: string;
  perfil?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <UserCircle2 className="h-5 w-5" />
          <span className="hidden text-sm font-medium sm:inline">{nome}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{nome}</span>
            <span className="text-xs font-normal text-muted-foreground">
              {email}
            </span>
            {perfil && (
              <span className="mt-1 text-xs font-normal text-muted-foreground">
                {perfilLabels[perfil] ?? perfil}
              </span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            void signOut({ callbackUrl: "/login" });
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
