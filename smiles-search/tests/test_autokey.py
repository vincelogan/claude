#!/usr/bin/env python3
"""Testa a descoberta automatica da x-api-key contra bundles simulados.

Nao da para bater no site real daqui (a rede bloqueia smiles.com.br), entao
servimos localmente paginas com a MESMA forma do site: um HTML com varios
<script src>, bundles com chaves-isca (analytics, etc.) e a chave verdadeira
perto de 'airlines/search'. Isso exercita fetch, parsing e ranqueamento.
"""

import sys
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from smiles import autokey

falhas = []


def check(nome, cond, detalhe=""):
    print(("  ok   " if cond else "  FALHA") + f"  {nome}" + (f"  [{detalhe}]" if detalhe and not cond else ""))
    if not cond:
        falhas.append(nome)


CHAVE_REAL = "aRealLookingKey123456789abcdef"
CHAVE_ISCA = "analyticsKey000111222333444555"

ARQUIVOS = {}


class H(BaseHTTPRequestHandler):
    def do_GET(self):
        corpo = ARQUIVOS.get(self.path)
        if corpo is None:
            self.send_response(404); self.end_headers(); return
        b = corpo.encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/javascript" if self.path.endswith(".js") else "text/html")
        self.send_header("Content-Length", str(len(b)))
        self.end_headers()
        self.wfile.write(b)

    def log_message(self, *a):
        pass


srv = HTTPServer(("127.0.0.1", 0), H)
base = f"http://127.0.0.1:{srv.server_address[1]}"
threading.Thread(target=srv.serve_forever, daemon=True).start()

ARQUIVOS["/pagina"] = f"""<!doctype html><html><head>
<link rel="preload" href="/static/vendor.js" as="script">
<script src="/static/analytics.js"></script>
<script src="/static/main.js"></script>
</head><body></body></html>"""

# isca: chave de analytics, longe de qualquer coisa de voo
ARQUIVOS["/static/analytics.js"] = (
    'var tracker={apiKey:"' + CHAVE_ISCA + '",endpoint:"https://metrics.example.com/t"};'
    + "x" * 2000)

ARQUIVOS["/static/vendor.js"] = "/* vendor bundle sem chave */" + "y" * 5000

# a de verdade: perto de airlines/search e num header x-api-key
ARQUIVOS["/static/main.js"] = (
    "z" * 500
    + 'const SEARCH="https://api-air-flightsearch-prd.smiles.com.br/v1/airlines/search";'
    + 'const h={"Content-Type":"application/json","x-api-key":"' + CHAVE_REAL + '"};'
    + "z" * 500)

autokey.PAGINAS = [f"{base}/pagina"]

print("\n1) Acha a chave certa entre as iscas")
r = autokey.discover(timeout=10)
check("escolheu a chave perto de airlines/search", r["api_key"] == CHAVE_REAL,
      f"achou {r['api_key']!r}")
check("nao caiu na isca de analytics", r["api_key"] != CHAVE_ISCA)
check("viu mais de um candidato", r["candidates"] >= 2, str(r["candidates"]))

print("\n2) Extrai tambem o endpoint de busca")
check("search_url descoberto",
      r["search_url"] == "https://api-air-flightsearch-prd.smiles.com.br/v1/airlines/search",
      str(r["search_url"]))

print("\n3) Diz de qual arquivo veio")
check("source aponta o bundle", r["source"].endswith("/static/main.js"), str(r["source"]))

print("\n4) Chave inline na propria pagina tambem serve")
ARQUIVOS["/inline"] = ('<!doctype html><script>window.__ENV__={'
                       '"apiKey":"' + CHAVE_REAL + '"};</script>')
autokey.PAGINAS = [f"{base}/inline"]
check("achou inline", autokey.discover(timeout=10)["api_key"] == CHAVE_REAL)

print("\n5) Sem chave -> erro explicativo (nao inventa nada)")
ARQUIVOS["/vazio"] = "<!doctype html><html><body>nada aqui</body></html>"
autokey.PAGINAS = [f"{base}/vazio"]
try:
    autokey.discover(timeout=10)
    check("levanta DiscoveryError", False, "nao levantou")
except autokey.DiscoveryError as e:
    check("levanta DiscoveryError", True)
    check("mensagem ensina a alternativa manual", "SMILES_API_KEY" in str(e))
    check("mensagem traz diagnostico", "bundles JS" in str(e))

print("\n6) Site fora do ar -> erro claro, sem travar")
autokey.PAGINAS = ["http://127.0.0.1:1/nada"]
try:
    autokey.discover(timeout=3)
    check("erro em site inacessivel", False, "nao levantou")
except autokey.DiscoveryError as e:
    check("erro em site inacessivel", True)
    check("diagnostico cita a falha de conexao", "Error" in str(e), str(e)[:80])

srv.shutdown()
print("\n" + ("FALHOU: " + ", ".join(falhas) if falhas else "TODOS OS TESTES PASSARAM"))
sys.exit(1 if falhas else 0)
