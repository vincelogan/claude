"""Modo demonstracao: voos sinteticos deterministicos, sem tocar a rede.

Ativado quando a config tem api_key == "demo" (ou env SMILES_DEMO=1).
Serve para conhecer a plataforma (lista, filtros, calendario) antes de
capturar a x-api-key real — e para testes automatizados.

Os valores sao pseudo-aleatorios mas ESTAVEIS por (rota, data): a mesma
busca da sempre o mesmo resultado, e os precos variam por dia numa onda
semanal (fim de semana mais caro), como num calendario real.
"""

from __future__ import annotations

import hashlib
import math
from datetime import datetime, timedelta

from .airports import resolve


def _seed(*parts) -> int:
    h = hashlib.sha256("|".join(str(p) for p in parts).encode()).hexdigest()
    return int(h[:12], 16)


def _rng(seed: int):
    """Gerador congruente simples e deterministico."""
    state = seed or 1

    def nxt(lo: int, hi: int) -> int:
        nonlocal state
        state = (state * 6364136223846793005 + 1442695040888963407) % (2**63)
        return lo + state % (hi - lo + 1)

    return nxt


def _segmento(origin: str, dest: str, day_str: str, cabin: str) -> dict:
    """Um trecho sintetico, no mesmo formato de um item de requestedFlightSegmentList."""
    o = resolve(origin) or {"airports": [origin]}
    d = resolve(dest) or {"airports": [dest]}
    day = datetime.strptime(day_str, "%Y-%m-%d")
    rnd = _rng(_seed(origin, dest, day_str))

    intl = (o.get("country", "BR") != d.get("country", "BR"))
    base = 85000 if intl else 18000
    # onda semanal (sex-dom mais caro) + ruido do dia
    weekly = 1.0 + 0.28 * math.sin((day.weekday() - 4) * math.pi / 3.5) ** 2
    daily = base * weekly * (0.82 + rnd(0, 40) / 100)

    n = rnd(3, 7)
    flights = []
    for i in range(n):
        direct = rnd(0, 99) < (35 if intl else 55)
        stops = 0 if direct else rnd(1, 2)
        dep_h, dep_m = rnd(5, 22), rnd(0, 11) * 5
        dur = (rnd(150, 220) if not intl else rnd(520, 620)) + stops * rnd(90, 180)
        arr = day.replace(hour=dep_h, minute=dep_m) + timedelta(minutes=dur)
        miles = int(daily * (1.0 + 0.15 * stops * -1 + rnd(-12, 25) / 100))
        miles = max(int(base * 0.55), miles // 100 * 100)
        club = int(miles * 0.86) // 100 * 100
        taxes = round((120 if not intl else 320) * (0.9 + rnd(0, 30) / 100), 2)
        seats = rnd(1, 9)
        flights.append({
            "departure": {"airport": {"code": o["airports"][rnd(0, len(o["airports"]) - 1)]},
                          "date": day.replace(hour=dep_h, minute=dep_m).strftime("%Y-%m-%dT%H:%M:%S")},
            "arrival": {"airport": {"code": d["airports"][rnd(0, len(d["airports"]) - 1)]},
                        "date": arr.strftime("%Y-%m-%dT%H:%M:%S")},
            "airline": {"code": "G3", "name": "GOL"},
            "flightNumber": str(1000 + rnd(0, 8999)),
            "stops": stops,
            "duration": {"hours": dur // 60, "minutes": dur % 60},
            "cabin": "ECONOMIC" if cabin in ("ALL", "ECONOMIC") else cabin,
            "availableSeats": seats,
            "fareList": [
                {"type": "SMILES_CLUB", "miles": club, "money": taxes, "availableSeats": seats},
                {"type": "SMILES", "miles": miles, "money": taxes, "availableSeats": seats},
            ],
        })
    return {"flightList": flights}


def demo_search(origin: str, dest: str, departure_date: str, cabin: str = "ALL",
                return_date: str | None = None, **_kw) -> dict:
    """Envelope no MESMO formato do SMILES: um segmento por trecho.

    Gerar a volta aqui e essencial — sem ela o caminho de ida-e-volta nunca
    seria exercitado nos testes, que foi como um bug de mistura de trechos
    passou despercebido.
    """
    segs = [_segmento(origin, dest, departure_date, cabin)]
    if return_date:
        segs.append(_segmento(dest, origin, return_date, cabin))
    return {"requestedFlightSegmentList": segs, "demo": True}
