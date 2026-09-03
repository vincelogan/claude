#!/usr/bin/env python3
"""Monta a pasta pronta para o Vercel a partir do codigo que ja existe.

Gera vercel/out/ com:
  api/index.py       -> um unico arquivo autocontido (airports + parser + demo
                        + a parte serverless), porque no Vercel cada .py dentro
                        de api/ virava uma function separada.
  index.html         -> o mesmo frontend do servidor local (estatico na raiz)
  requirements.txt   -> flask + requests
  vercel.json        -> manda /api/* para a function

Uso:  python vercel/build.py
"""

from __future__ import annotations

import json
import pathlib
import shutil

BASE = pathlib.Path(__file__).resolve().parent
ROOT = BASE.parent
OUT = BASE / "out"

HEADER = '''"""Radar SMILES — versao serverless (Vercel).

GERADO por vercel/build.py — nao edite este arquivo a mao.
Edite smiles/*.py ou vercel/app_tail.py e rode o build de novo.
"""
from __future__ import annotations

import hashlib
import hmac
import json
import math
import os
import re
import threading
import time
import unicodedata
from dataclasses import asdict, dataclass, field
from datetime import datetime, timedelta, timezone
from urllib.parse import urlencode, urljoin

import requests
from flask import Flask, Response, jsonify, request
'''


def clean(src: str) -> str:
    """Remove imports relativos e __future__ (ja estao no cabecalho unico)."""
    keep = []
    for ln in src.splitlines():
        s = ln.strip()
        if s.startswith("from __future__") or s.startswith("from ."):
            continue
        keep.append(ln)
    return "\n".join(keep)


def nomes_topo(src: str) -> set[str]:
    """Nomes definidos no nivel de modulo (def/class/atribuicao simples)."""
    import ast
    nomes = set()
    try:
        arvore = ast.parse(src)
    except SyntaxError:
        return nomes
    for no in arvore.body:
        if isinstance(no, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            nomes.add(no.name)
        elif isinstance(no, ast.Assign):
            for alvo in no.targets:
                if isinstance(alvo, ast.Name):
                    nomes.add(alvo.id)
        elif isinstance(no, ast.AnnAssign) and isinstance(no.target, ast.Name):
            nomes.add(no.target.id)
    return nomes


def checar_colisoes(pecas: dict[str, str]) -> None:
    """Inlinar junta tudo num namespace so: nome repetido = um sobrescreve o outro.

    Ja aconteceu (o _CACHE do autokey virou o cache de buscas do app_tail e a
    descoberta da chave quebrou em producao), entao o build agora falha alto.
    """
    visto: dict[str, str] = {}
    problemas = []
    for origem, src in pecas.items():
        for nome in nomes_topo(src):
            if nome in visto:
                problemas.append(f"{nome!r}: {visto[nome]} vs {origem}")
            else:
                visto[nome] = origem
    if problemas:
        raise SystemExit("ERRO: nomes colidem entre os modulos inlinados:\n  - "
                         + "\n  - ".join(problemas))


def main() -> None:
    if OUT.exists():
        shutil.rmtree(OUT)
    (OUT / "api").mkdir(parents=True)

    pecas = {}
    for mod in ("airports", "parser", "demo", "autokey"):
        pecas[f"smiles/{mod}.py"] = clean((ROOT / "smiles" / f"{mod}.py").read_text(encoding="utf-8"))
    pecas["vercel/app_tail.py"] = clean((BASE / "app_tail.py").read_text(encoding="utf-8"))
    checar_colisoes(pecas)

    parts = [HEADER]
    for origem, src in pecas.items():
        parts.append(f"\n# ===== inlined: {origem} =====\n")
        parts.append(src)
    (OUT / "api" / "index.py").write_text("\n".join(parts) + "\n", encoding="utf-8")

    # Sem framework, o Vercel serve os estaticos da raiz do projeto.
    shutil.copy(ROOT / "web" / "index.html", OUT / "index.html")
    # brotli: sem ele nao anunciamos "br" no Accept-Encoding, e um Chrome real
    # sempre anuncia. Header a menos = fingerprint de bot para o Akamai.
    (OUT / "requirements.txt").write_text(
        "flask>=3.0\nrequests>=2.31\nbrotli>=1.1\n", encoding="utf-8")
    (OUT / "vercel.json").write_text(json.dumps({
        # gru1 = Sao Paulo. Sair do Brasil aproxima a requisicao do que o
        # SMILES espera (e corta ~150ms de latencia por chamada).
        "regions": ["gru1"],
        "rewrites": [{"source": "/api/(.*)", "destination": "/api/index"}],
        "functions": {"api/index.py": {"includeFiles": "index.html"}},
    }, indent=2) + "\n", encoding="utf-8")

    n = len((OUT / "api" / "index.py").read_text(encoding="utf-8").splitlines())
    print(f"OK -> {OUT}  (api/index.py com {n} linhas)")


if __name__ == "__main__":
    main()
