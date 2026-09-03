#!/usr/bin/env python3
"""Servidor local da plataforma pessoal de busca SMILES.

Roda so na sua maquina (127.0.0.1). Serve o frontend (web/index.html) e expoe:

  GET  /api/airports?q=rio      -> autocomplete de cidades/aeroportos
  GET  /api/status              -> config capturada? modo demo?
  POST /api/capture             -> roda a captura da x-api-key (Playwright)
  POST /api/search              -> busca; voos por trecho + resumo fiel
  POST /api/day                 -> resumo leve de um dia (varredura do calendario)

FIDELIDADE: ida e volta sao trechos separados (nunca misturados), a tarifa
padrao Smiles nunca e substituida pela do Clube, e o modo demo e sempre
sinalizado na resposta (`demo: true`) para a interface avisar.

Uso:  python server.py   e abra http://127.0.0.1:8777
"""

from __future__ import annotations

import os
from pathlib import Path
from urllib.parse import urlencode

from flask import Flask, jsonify, request, send_from_directory

from smiles.airports import resolve, suggest
from smiles.cache import SearchCache
from smiles.client import SmilesClient, SmilesError, date_to_epoch_ms
from smiles.config import SmilesConfig, load_config
from smiles import autokey
from smiles.demo import demo_search
from smiles.parser import parse_flights, resumo

WEB_DIR = Path(__file__).resolve().parent / "web"

app = Flask(__name__)
cache = SearchCache()


def _demo_on(cfg) -> bool:
    return cfg.api_key == "demo" or os.environ.get("SMILES_DEMO") == "1"


def _resolver_chave(force: bool = False) -> dict:
    """Chave em uso: config.json capturado > SMILES_API_KEY > descoberta automatica."""
    cfg = load_config()
    preferida = cfg.api_key or os.environ.get("SMILES_API_KEY", "")
    r = autokey.get_key(preferida=preferida, force=force)
    if r["key"] and r["source"] == "manual":
        r["url"] = cfg.search_url if cfg.is_usable else None
    return r


def _cliente(force: bool = False):
    """Monta o cliente com a chave resolvida. Levanta SmilesError se nao houver."""
    r = _resolver_chave(force=force)
    if not r["key"]:
        raise SmilesError(r["error"] or "Nao foi possivel obter a x-api-key.")
    cfg = load_config()
    url = r["url"] or (cfg.search_url if cfg.search_url else None)
    return SmilesClient(SmilesConfig(api_key=r["key"], search_url=url) if url
                        else SmilesConfig(api_key=r["key"])), r["source"]


def _params(body: dict) -> dict:
    return {
        "origin": (body.get("origin") or "").upper().strip(),
        "dest": (body.get("dest") or "").upper().strip(),
        "out": body.get("out") or "",
        "ret": body.get("ret") or None,
        "adults": int(body.get("adults") or 1),
        "children": int(body.get("children") or 0),
        "infants": int(body.get("infants") or 0),
        "cabin": (body.get("cabin") or "ALL").upper(),
    }


def _validate(p: dict):
    if not p["origin"] or not p["dest"] or not p["out"]:
        return "Informe origem, destino e data de ida."
    if resolve(p["origin"]) is None or resolve(p["dest"]) is None:
        return "Origem/destino desconhecidos. Use o autocomplete."
    if p["origin"] == p["dest"]:
        return "Origem e destino são iguais."
    if p["ret"] and p["ret"] < p["out"]:
        return "A volta não pode ser antes da ida."
    return None


def _raw_search(p: dict, force: bool = False):
    """Busca (cache -> demo/rede) e devolve (raw_json, from_cache, demo)."""
    cfg = load_config()
    demo = _demo_on(cfg)
    key = cache.key(v=3, demo=int(demo), **{k: p[k] for k in
                    ("origin", "dest", "out", "ret", "adults", "children", "infants", "cabin")})
    if not force:
        hit = cache.get(key)
        if hit is not None:
            return hit, True, demo

    if demo:
        raw = demo_search(p["origin"], p["dest"], p["out"],
                          cabin=p["cabin"], return_date=p["ret"])
    else:
        def _buscar(force):
            cli, _ = _cliente(force=force)
            return cli.search(
                origin=p["origin"], dest=p["dest"], departure_date=p["out"],
                return_date=p["ret"], adults=p["adults"], children=p["children"],
                infants=p["infants"], cabin=p["cabin"],
            )
        try:
            raw = _buscar(False)
        except SmilesError as exc:
            # 401/403 = a Gol rotacionou a chave: descobre de novo e tenta 1 vez
            if any(t in str(exc) for t in ("401", "403", "rotacionou")):
                autokey.invalidate()
                raw = _buscar(True)
            else:
                raise
    cache.put(key, raw)
    return raw, False, demo


def _voo_json(v, clube: bool) -> dict:
    """Serializa um voo SEM esconder a diferenca entre tarifa padrao e Clube."""
    return {
        "origem": v.origem, "destino": v.destino,
        "partida": v.partida, "chegada": v.chegada,
        "companhia": v.companhia, "numero": v.numero,
        "paradas": v.paradas, "direto": v.paradas == 0,
        "duracao_min": v.duracao_min, "duracao_str": v.duracao_str(),
        "cabine": v.cabine, "trecho": v.trecho,
        "milhas_padrao": v.milhas_padrao,   # o que qualquer pessoa paga
        "milhas_clube": v.milhas_clube,     # so assinantes do Clube Smiles
        "preco": v.preco(clube),            # referencia conforme o perfil
        "taxas": v.taxas,
        "fares": [{"tipo": f.tipo, "rotulo": f.rotulo(), "milhas": f.milhas,
                   "dinheiro": f.dinheiro, "assentos": f.assentos,
                   "clube": f.clube, "com_dinheiro": f.com_dinheiro}
                  for f in v.fares],
    }


def _sort(voos, mode: str, clube: bool):
    """Ordena DENTRO de cada trecho; a ordem dos trechos (ida, volta) e mantida."""
    if mode == "miles":
        key = lambda v: (v.trecho, v.ordem(clube))
    elif mode == "duration":
        key = lambda v: (v.trecho, v.duracao_min if v.duracao_min is not None else 10**9)
    elif mode == "departure":
        key = lambda v: (v.trecho, v.partida)
    else:  # "smart": diretos primeiro dentro do trecho
        key = lambda v: (v.trecho, 0 if v.paradas == 0 else 1, v.ordem(clube))
    voos.sort(key=key)
    return voos


def _smiles_url(p: dict) -> str:
    """Link profundo para a mesma busca no site do SMILES (para emitir)."""
    o, d = resolve(p["origin"]), resolve(p["dest"])
    q = {
        "adults": p["adults"], "children": p["children"], "infants": p["infants"],
        "cabin": p["cabin"], "departureDate": date_to_epoch_ms(p["out"]),
        "isElegible": "false", "isFlexibleDateChecked": "false",
        "searchType": "g3", "segments": "1",
        "tripType": "1" if p["ret"] else "2",
        "originAirport": p["origin"], "originCity": "", "originCountry": "",
        "originAirportIsAny": "true" if o and o["kind"] == "metro" else "false",
        "destinationAirport": p["dest"], "destinCity": "", "destinCountry": "",
        "destinAirportIsAny": "true" if d and d["kind"] == "metro" else "false",
        "novo-resultado-voos": "true",
    }
    if p["ret"]:
        q["returnDate"] = date_to_epoch_ms(p["ret"])
    return "https://www.smiles.com.br/mfe/emissao-passagem/?" + urlencode(q)


@app.get("/")
def index():
    return send_from_directory(WEB_DIR, "index.html")


@app.get("/api/airports")
def api_airports():
    return jsonify(suggest(request.args.get("q", "")))


@app.get("/api/status")
def api_status():
    cfg = load_config()
    demo = _demo_on(cfg)
    if demo:
        return jsonify({"configured": True, "demo": True, "locked": False,
                        "key_source": None, "key_error": None, "endpoint": None})
    r = _resolver_chave()
    return jsonify({
        "configured": bool(r["key"]),
        "demo": False,
        "locked": False,
        "key_source": r["source"],      # manual | auto | auto (cache)
        "key_error": r["error"],        # por que a descoberta falhou, se falhou
        "endpoint": r["url"] or cfg.search_url,
    })


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
    p = _params(body)
    err = _validate(p)
    if err:
        return jsonify({"ok": False, "error": err}), 400
    try:
        raw, cached, demo = _raw_search(p, force=bool(body.get("nocache")))
    except SmilesError as exc:
        needs = any(t in str(exc) for t in ("x-api-key", "401", "403", "rotacionou"))
        return jsonify({"ok": False, "error": str(exc), "needs_capture": needs}), 502

    clube = bool(body.get("clube"))
    voos = parse_flights(raw)
    resumo_ = resumo(voos, clube)
    _sort(voos, body.get("sort") or "smart", clube)
    if body.get("direct_only"):
        voos = [v for v in voos if v.paradas == 0]
    return jsonify({
        "ok": True,
        "flights": [_voo_json(v, clube) for v in voos],
        "summary": resumo_,
        "cached": cached, "demo": demo, "smiles_url": _smiles_url(p),
    })


@app.post("/api/day")
def api_day():
    """Resumo de UM dia (so ida) para a varredura do calendario."""
    body = request.get_json(silent=True) or {}
    p = _params(body)
    p["ret"] = None  # calendario e por trecho
    err = _validate(p)
    if err:
        return jsonify({"ok": False, "error": err}), 400
    try:
        raw, cached, demo = _raw_search(p)
    except SmilesError as exc:
        needs = any(t in str(exc) for t in ("x-api-key", "401", "403", "rotacionou"))
        return jsonify({"ok": False, "error": str(exc), "needs_capture": needs}), 502
    r = resumo(parse_flights(raw), bool(body.get("clube")))
    leg = r["legs"][0] if r["legs"] else {"cheapest": None, "cheapest_direct": None,
                                          "directs": 0, "total": 0}
    return jsonify({"ok": True, "date": p["out"], "cached": cached, "demo": demo,
                    "cheapest": leg["cheapest"], "cheapest_direct": leg["cheapest_direct"],
                    "directs": leg["directs"], "total": leg["total"]})


if __name__ == "__main__":
    print("Plataforma SMILES pessoal: http://127.0.0.1:8777")
    app.run(host="127.0.0.1", port=8777, debug=False)
