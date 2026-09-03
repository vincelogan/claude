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
import threading
import time
import unicodedata
from dataclasses import asdict, dataclass, field
from datetime import datetime, timedelta, timezone
from urllib.parse import urlencode

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


def main() -> None:
    if OUT.exists():
        shutil.rmtree(OUT)
    (OUT / "api").mkdir(parents=True)

    parts = [HEADER]
    for mod in ("airports", "parser", "demo"):
        parts.append(f"\n# ===== inlined: smiles/{mod}.py =====\n")
        parts.append(clean((ROOT / "smiles" / f"{mod}.py").read_text(encoding="utf-8")))
    parts.append(f"\n# ===== vercel/app_tail.py =====\n")
    parts.append(clean((BASE / "app_tail.py").read_text(encoding="utf-8")))
    (OUT / "api" / "index.py").write_text("\n".join(parts) + "\n", encoding="utf-8")

    # Sem framework, o Vercel serve os estaticos da raiz do projeto.
    shutil.copy(ROOT / "web" / "index.html", OUT / "index.html")
    (OUT / "requirements.txt").write_text("flask>=3.0\nrequests>=2.31\n", encoding="utf-8")
    (OUT / "vercel.json").write_text(json.dumps({
        "rewrites": [{"source": "/api/(.*)", "destination": "/api/index"}],
        "functions": {"api/index.py": {"includeFiles": "index.html"}},
    }, indent=2) + "\n", encoding="utf-8")

    n = len((OUT / "api" / "index.py").read_text(encoding="utf-8").splitlines())
    print(f"OK -> {OUT}  (api/index.py com {n} linhas)")


if __name__ == "__main__":
    main()
