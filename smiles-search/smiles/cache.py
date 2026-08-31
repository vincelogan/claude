"""Cache local (SQLite) das buscas, com TTL.

O calendario dispara uma busca por dia — sem cache, navegar entre meses ou
reordenar resultados repetiria dezenas de chamadas ao SMILES. Com ele, cada
(rota, dia, pax, cabine) so vai a rede uma vez a cada TTL horas.
"""

from __future__ import annotations

import json
import sqlite3
import time
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "cache.db"
DEFAULT_TTL = 6 * 3600  # 6 horas


class SearchCache:
    def __init__(self, path: Path = DB_PATH, ttl: int = DEFAULT_TTL):
        self.ttl = ttl
        self.conn = sqlite3.connect(path, check_same_thread=False)
        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS searches (key TEXT PRIMARY KEY, ts REAL, data TEXT)"
        )
        self.conn.commit()

    @staticmethod
    def key(**parts) -> str:
        return "|".join(f"{k}={parts[k]}" for k in sorted(parts))

    def get(self, key: str) -> dict | None:
        row = self.conn.execute(
            "SELECT ts, data FROM searches WHERE key = ?", (key,)
        ).fetchone()
        if not row:
            return None
        ts, data = row
        if time.time() - ts > self.ttl:
            return None
        try:
            return json.loads(data)
        except ValueError:
            return None

    def put(self, key: str, data: dict) -> None:
        self.conn.execute(
            "INSERT OR REPLACE INTO searches (key, ts, data) VALUES (?, ?, ?)",
            (key, time.time(), json.dumps(data, ensure_ascii=False)),
        )
        self.conn.commit()

    def age_seconds(self, key: str) -> float | None:
        row = self.conn.execute(
            "SELECT ts FROM searches WHERE key = ?", (key,)
        ).fetchone()
        return (time.time() - row[0]) if row else None
