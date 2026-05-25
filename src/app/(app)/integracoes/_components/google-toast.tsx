"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

/**
 * Mostra um toast baseado em `?google=conectado|desconectado|erro`
 * e remove o parâmetro da URL após exibir.
 */
export function GoogleToast() {
  const params = useSearchParams();
  const router = useRouter();
  const jaExibido = useRef<string | null>(null);

  useEffect(() => {
    const valor = params.get("google");
    if (!valor) return;
    if (jaExibido.current === valor) return;
    jaExibido.current = valor;

    if (valor === "conectado") {
      toast.success("Google Calendar conectado com sucesso.");
    } else if (valor === "desconectado") {
      toast.success("Integração com Google Calendar removida.");
    } else if (valor === "erro") {
      toast.error("Não foi possível concluir a integração com o Google.");
    }

    // Remove o parâmetro da URL para evitar reexibição em refresh.
    const novo = new URLSearchParams(params.toString());
    novo.delete("google");
    const qs = novo.toString();
    router.replace(qs ? `/integracoes?${qs}` : "/integracoes", {
      scroll: false,
    });
  }, [params, router]);

  return null;
}
