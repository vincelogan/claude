"use client";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function GlobalSearch() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const sp = new URLSearchParams();
        if (q) sp.set("q", q);
        router.push(`/contatos?${sp.toString()}`);
      }}
      className="relative flex w-full max-w-xl items-center"
    >
      <Search className="pointer-events-none absolute left-3 text-neutral-400" size={16} />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar por nome, empresa, email, cidade ou notas..."
        className="input pl-9"
      />
    </form>
  );
}
