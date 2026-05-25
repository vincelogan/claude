"use client";

import { useState, useTransition } from "react";
import { AlertTriangle, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

import {
  removerIntegracaoTribunal,
  salvarIntegracaoTribunal,
} from "../_actions-tribunais";

type SistemaUI = "PJE" | "ESAJ" | "PROJUDI" | "EPROC";

export interface IntegracaoTribunalItem {
  id: string;
  sistema: SistemaUI | string;
  tribunalSigla: string;
  ativa: boolean;
  ultimoSync: Date | string | null;
}

export interface SistemaSuportadoItem {
  sistema: SistemaUI | string;
  label: string;
  status: "stub" | "beta" | "producao";
}

interface Props {
  integracoes: IntegracaoTribunalItem[];
  sistemasSuportados: SistemaSuportadoItem[];
}

const STATUS_LABEL: Record<SistemaSuportadoItem["status"], string> = {
  stub: "Em desenvolvimento",
  beta: "Beta",
  producao: "Produção",
};

function formatarData(d: Date | string | null): string {
  if (!d) return "Nunca";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function TribunaisSection({ integracoes, sistemasSuportados }: Props) {
  const [dialogAberto, setDialogAberto] = useState(false);
  const [sistema, setSistema] = useState<SistemaUI>("PJE");
  const [tribunalSigla, setTribunalSigla] = useState("");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [certificadoBase64, setCertificadoBase64] = useState("");
  const [pinCertificado, setPinCertificado] = useState("");
  const [pendente, startTransition] = useTransition();

  function resetForm() {
    setSistema("PJE");
    setTribunalSigla("");
    setUsuario("");
    setSenha("");
    setCertificadoBase64("");
    setPinCertificado("");
  }

  function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    if (!tribunalSigla.trim()) {
      toast.error("Informe a sigla do tribunal (ex.: TJSP).");
      return;
    }

    const credenciais: Record<string, string> = {};
    if (sistema === "ESAJ") {
      if (certificadoBase64.trim()) {
        credenciais.certificadoBase64 = certificadoBase64.trim();
      }
      if (pinCertificado) credenciais.pinCertificado = pinCertificado;
    } else {
      if (usuario) credenciais.usuario = usuario;
      if (senha) credenciais.senha = senha;
    }

    startTransition(async () => {
      const res = await salvarIntegracaoTribunal({
        sistema,
        tribunalSigla,
        credenciais,
      });
      if (res.ok) {
        toast.success("Integração salva. Credenciais cifradas com sucesso.");
        setDialogAberto(false);
        resetForm();
      } else {
        toast.error(res.erro ?? "Falha ao salvar integração.");
      }
    });
  }

  function handleRemover(id: string) {
    startTransition(async () => {
      const res = await removerIntegracaoTribunal(id);
      if (res.ok) {
        toast.success("Integração removida.");
      } else {
        toast.error(res.erro ?? "Falha ao remover.");
      }
    });
  }

  return (
    <section className="space-y-4">
      <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-900 flex gap-2 items-start">
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
        <div>
          <strong>Conectores em desenvolvimento</strong> — usando dados
          simulados. Implementações reais virão por tribunal (CNJ DataJud
          para PJe, scraping headless para eSAJ/Projudi, SOAP MNI para
          eProc).
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Credenciais de tribunais</h3>
          <p className="text-sm text-muted-foreground">
            Cadastre uma credencial por (sistema, tribunal) para permitir
            sincronização automática de processos e movimentações.
          </p>
        </div>

        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              Adicionar credencial
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleSalvar}>
              <DialogHeader>
                <DialogTitle>Nova credencial de tribunal</DialogTitle>
                <DialogDescription>
                  As credenciais são cifradas em repouso. A implementação
                  real de cada conector está em desenvolvimento — use o
                  MockConnector para testes.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="sistema">Sistema</Label>
                  <Select
                    value={sistema}
                    onValueChange={(v) => setSistema(v as SistemaUI)}
                  >
                    <SelectTrigger id="sistema">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sistemasSuportados.map((s) => (
                        <SelectItem key={s.sistema} value={s.sistema}>
                          {s.label} — {STATUS_LABEL[s.status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tribunalSigla">Tribunal (sigla)</Label>
                  <Input
                    id="tribunalSigla"
                    placeholder="Ex.: TJSP, TRF3, TRT2"
                    value={tribunalSigla}
                    onChange={(e) =>
                      setTribunalSigla(e.target.value.toUpperCase())
                    }
                  />
                </div>

                {sistema === "ESAJ" ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="cert">
                        Certificado A1 (PKCS#12 em base64)
                      </Label>
                      <Textarea
                        id="cert"
                        rows={4}
                        placeholder="Conteúdo .pfx codificado em base64"
                        value={certificadoBase64}
                        onChange={(e) => setCertificadoBase64(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pin">PIN do certificado</Label>
                      <Input
                        id="pin"
                        type="password"
                        value={pinCertificado}
                        onChange={(e) => setPinCertificado(e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="usuario">Usuário</Label>
                      <Input
                        id="usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="senha">Senha</Label>
                      <Input
                        id="senha"
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogAberto(false)}
                  disabled={pendente}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={pendente}>
                  {pendente && (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  )}
                  Salvar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tribunal</TableHead>
              <TableHead>Sistema</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Último sync</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {integracoes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-sm text-muted-foreground py-6"
                >
                  Nenhuma credencial cadastrada.
                </TableCell>
              </TableRow>
            ) : (
              integracoes.map((it) => (
                <TableRow key={it.id}>
                  <TableCell className="font-medium">
                    {it.tribunalSigla}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{it.sistema}</Badge>
                  </TableCell>
                  <TableCell>
                    {it.ativa ? (
                      <Badge>Ativa</Badge>
                    ) : (
                      <Badge variant="outline">Inativa</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatarData(it.ultimoSync)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemover(it.id)}
                      disabled={pendente}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Desconectar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
