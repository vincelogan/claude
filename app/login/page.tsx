"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const supabase = createClient();
    try {
      if (mode === "magic") {
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) throw error;
        setMsg("Link enviado para o seu email.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = "/";
      }
    } catch (err: any) {
      setMsg(err.message ?? "Erro ao entrar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <form onSubmit={submit} className="card w-full max-w-sm space-y-4">
        <div>
          <h1 className="text-xl font-semibold">CRM Pessoal</h1>
          <p className="text-sm text-neutral-500">Acesso restrito ao dono.</p>
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        {mode === "password" && (
          <div>
            <label className="label">Senha</label>
            <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        )}
        <button type="submit" disabled={busy} className="btn-primary w-full justify-center">
          {busy ? "Aguarde..." : mode === "magic" ? "Enviar link mágico" : "Entrar"}
        </button>
        <button
          type="button"
          className="btn-ghost w-full justify-center text-xs"
          onClick={() => setMode(mode === "password" ? "magic" : "password")}
        >
          {mode === "password" ? "Usar link mágico" : "Usar senha"}
        </button>
        {msg && <p className="text-center text-sm text-neutral-600">{msg}</p>}
      </form>
    </main>
  );
}
