#!/usr/bin/env python3
"""Servidor local da plataforma pessoal de busca SMILES.

Roda so na sua maquina (127.0.0.1). Serve o frontend (web/index.html) e expoe:

  GET  /api/airports?q=rio      -> autocomplete de cidades/aeroportos
  GET  /api/status              -> config capturada? (tem x-api-key?)
  POST /api/capture             -> roda a captura da x-api-key (Playwright)
  POST /api/search              -> faz a busca e devolve voos normalizados

Uso:  python server.py   e abra http://127.0.0.1:8777
"""

from __future__ import annotations

from dataclasses import asdict
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory

from smiles.airports import resolve, suggest
from smiles.client import SmilesClient, SmilesError
from smiles.config import load_config
from smiles.parser import parse_flights

WEB_DIR = Path(__file__).resolve().parent / "web"

app = Flask(__name__)


@app.get("/")
def index():
    return send_from_directory(WEB_DIR, "index.html")


@app.get("/api/airports")
def api_airports():
    q = request.args.get("q", "")
    return jsonify(suggest(q))


@app.get("/api/status")
def api_status():
    cfg = load_config()
    return jsonify(
        {
            "configured": cfg.is_usable,
            "endpoint": cfg.search_url if cfg.is_usable else None,
        }
    )


@app.post("/api/capture")
def api_capture():
    try:
        from smiles.capture import capture

        cfg = capture(headless=True)
    except (RuntimeError, ImportError) as exc:
        return jsonify({"ok": False, "error": str(exc)}), 502
    return jsonify({"ok": True, "endpoint": cfg.search_url})


@app.post("/api/search")
def api_search():
    body = request.get_json(silent=True) or {}
    origin = (body.get("origin") or "").upper().strip()
    dest = (body.get("dest") or "").upper().strip()
    out_date = body.get("out")
    ret_date = body.get("ret") or None
    if not origin or not dest or not out_date:
        return jsonify({"ok": False, "error": "Informe origem, destino e data de ida."}), 400
    if resolve(origin) is None or resolve(dest) is None:
        return jsonify({"ok": False, "error": "Origem/destino desconhecidos. Use o autocomplete."}), 400

    cfg = load_config()
    if not cfg.is_usable:
        return (
            jsonify({"ok": False, "error": "Sem x-api-key. Clique em 'Capturar chave' primeiro.", "needs_capture": True}),
            409,
        )
    try:
        client = SmilesClient(cfg)
        raw = client.search(
            origin=origin,
            dest=dest,
            departure_date=out_date,
            return_date=ret_date,
            adults=int(body.get("adults") or 1),
            children=int(body.get("children") or 0),
            infants=int(body.get("infants") or 0),
            cabin=(body.get("cabin") or "ALL"),
        )
    except SmilesError as exc:
        needs = "rotacionou" in str(exc) or "401" in str(exc) or "403" in str(exc)
        return jsonify({"ok": False, "error": str(exc), "needs_capture": needs}), 502
    except ValueError as exc:
        return jsonify({"ok": False, "error": f"Parametro invalido: {exc}"}), 400

    voos = [asdict(v) | {"duracao_str": v.duracao_str()} for v in parse_flights(raw)]
    return jsonify({"ok": True, "count": len(voos), "flights": voos})


if __name__ == "__main__":
    print("Plataforma SMILES pessoal: http://127.0.0.1:8777")
    app.run(host="127.0.0.1", port=8777, debug=False)
