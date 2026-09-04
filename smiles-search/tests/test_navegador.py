#!/usr/bin/env python3
"""Testa o modo navegador contra um SMILES falso servido localmente.

Nao toca no site real: sobe um servidor HTTP que devolve uma pagina que faz
exatamente o que a pagina do SMILES faz — um fetch para .../airlines/search —
e verifica que a sessao do Chromium captura o JSON dessa resposta.

E o unico jeito honesto de testar este caminho aqui: o ambiente de
desenvolvimento nao alcanca smiles.com.br.
"""

from __future__ import annotations

import json
import sys
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from smiles import navegador
from smiles.urls import date_to_epoch_ms, mfe_url

FALHAS: list[str] = []


def ok(cond, msg):
    print(("  ok     " if cond else "  FALHOU ") + msg)
    if not cond:
        FALHAS.append(msg)


RESPOSTA = {
    "requestedFlightSegmentList": [
        {"flightList": [{
            "departure": {"airport": {"code": "GIG"}, "date": "2027-05-07T08:00:00"},
            "arrival": {"airport": {"code": "JFK"}, "date": "2027-05-07T17:30:00"},
            "airline": {"code": "G3", "name": "GOL"}, "flightNumber": "7654",
            "stops": 0, "duration": {"hours": 9, "minutes": 30}, "cabin": "ECONOMIC",
            "fareList": [{"type": "SMILES", "miles": 95000, "money": 310.40}],
        }]},
        {"flightList": [{
            "departure": {"airport": {"code": "JFK"}, "date": "2027-05-17T21:00:00"},
            "arrival": {"airport": {"code": "GIG"}, "date": "2027-05-18T08:10:00"},
            "airline": {"code": "G3", "name": "GOL"}, "flightNumber": "7655",
            "stops": 0, "duration": {"hours": 11, "minutes": 10}, "cabin": "ECONOMIC",
            "fareList": [{"type": "SMILES", "miles": 88000, "money": 210.00}],
        }]},
    ]
}

PAGINA = b"""<!doctype html><meta charset=utf-8><title>fake smiles</title>
<body><p>carregando</p>
<script>
// Imita a pagina do SMILES: a propria pagina chama a API de busca.
setTimeout(function(){
  fetch('/v1/airlines/search?originAirportCode=RIO')
    .then(r => r.json())
    .then(d => { document.body.innerHTML = 'pronto'; });
}, 150);
</script>
"""


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if "airlines/search" in self.path:
            corpo = json.dumps(RESPOSTA).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
        else:
            corpo = PAGINA
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(corpo)))
        self.end_headers()
        self.wfile.write(corpo)

    def log_message(self, *a):
        pass


def main() -> int:
    print("1) URL da busca e a mesma do link 'emitir no SMILES'")
    u = mfe_url("RIO", "NYC", "2027-05-07", "2027-05-17", adults=2)
    ok("originAirport=RIO" in u and "destinationAirport=NYC" in u, "origem/destino na URL")
    ok("originAirportIsAny=true" in u, "metropole marca IsAny=true")
    ok("tripType=1" in u, "ida e volta -> tripType=1")
    ok(f"returnDate={date_to_epoch_ms('2027-05-17')}" in u, "returnDate em epoch ms")
    ok("returnDate=1810566000000" in u,
       "bate com a URL real do site (1810566000000)")

    u1 = mfe_url("GRU", "SSA", "2027-05-07")
    ok("tripType=2" in u1 and "returnDate" not in u1, "so ida -> tripType=2, sem volta")
    ok("originAirportIsAny=false" in u1, "aeroporto unico marca IsAny=false")

    print("\n2) Navegador captura a resposta da busca")
    try:
        from playwright.sync_api import sync_playwright  # noqa: F401
    except ImportError:
        print("  PULADO Playwright nao instalado (pip install playwright)")
        return 0 if not FALHAS else 1

    srv = HTTPServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{srv.server_address[1]}/pagina"

    sessao = navegador.SessaoNavegador(headless=True)
    try:
        dados = sessao._buscar_via_url(base, timeout_ms=20000)
    except navegador.NavegadorError as exc:
        print(f"  PULADO navegador indisponivel aqui: {exc}")
        srv.shutdown()
        return 0 if not FALHAS else 1
    finally:
        pass

    ok(isinstance(dados, dict), "devolveu JSON")
    segs = dados.get("requestedFlightSegmentList") or []
    ok(len(segs) == 2, "os DOIS trechos vieram (ida e volta nao viram um so)")

    from smiles.parser import parse_flights, resumo
    voos = parse_flights(dados)
    ok(len(voos) == 2, "dois voos lidos")
    ok({v.trecho for v in voos} == {0, 1}, "cada voo com seu trecho")
    r = resumo(voos, clube=False)
    ok(r["total_milhas"] == 95000 + 88000, "total da viagem = ida + volta")

    print("\n3) Reaproveita a mesma instancia do navegador")
    dados2 = sessao._buscar_via_url(base, timeout_ms=20000)
    ok(dados2 == dados, "segunda busca na mesma sessao devolve o mesmo JSON")

    print("\n4) Buscas de THREADS DIFERENTES (e o que o Flask faz)")
    # O Playwright sincrono so aceita chamadas da thread que o criou. Como o
    # servidor atende cada requisicao numa thread nova, sem uma thread dona
    # dedicada a segunda busca quebraria aqui.
    import threading as _th
    saidas, problemas = [], []

    def buscar():
        try:
            saidas.append(sessao._buscar_via_url(base, timeout_ms=20000))
        except Exception as exc:
            problemas.append(f"{type(exc).__name__}: {exc}")

    ts = [_th.Thread(target=buscar) for _ in range(3)]
    for t in ts:
        t.start()
    for t in ts:
        t.join(timeout=60)
    ok(not problemas, "tres threads buscaram sem erro" +
       (" | " + "; ".join(problemas) if problemas else ""))
    ok(len(saidas) == 3 and all(x == dados for x in saidas),
       "as tres devolveram o mesmo JSON")

    sessao.close()
    srv.shutdown()

    print("\n" + ("TODOS OS TESTES PASSARAM" if not FALHAS
                  else f"{len(FALHAS)} FALHA(S): " + "; ".join(FALHAS)))
    return 1 if FALHAS else 0


if __name__ == "__main__":
    raise SystemExit(main())
