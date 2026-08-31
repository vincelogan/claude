"""Normaliza a resposta JSON do SMILES em voos legiveis.

O schema exato do SMILES muda com o tempo, entao tudo aqui e defensivo:
procura chaves conhecidas em varios formatos e ignora o que nao existir.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone


@dataclass
class Fare:
    tipo: str            # SMILES, SMILES_CLUB, ...
    milhas: int | None
    dinheiro: float | None   # taxas/copart. em BRL
    assentos: int | None

    def label(self) -> str:
        m = f"{self.milhas:,}".replace(",", ".") if self.milhas is not None else "?"
        d = f" + R${self.dinheiro:,.2f}".replace(",", "@").replace(".", ",").replace("@", ".") if self.dinheiro else ""
        s = f" ({self.assentos} assentos)" if self.assentos is not None else ""
        return f"{self.tipo}: {m} milhas{d}{s}"


@dataclass
class Voo:
    origem: str
    destino: str
    partida: str
    chegada: str
    companhia: str
    numero: str
    paradas: int
    duracao_min: int | None
    cabine: str
    fares: list[Fare] = field(default_factory=list)

    @property
    def menor_milhas(self) -> int:
        vals = [f.milhas for f in self.fares if f.milhas is not None]
        return min(vals) if vals else 10**12

    def duracao_str(self) -> str:
        if self.duracao_min is None:
            return "?"
        return f"{self.duracao_min // 60}h{self.duracao_min % 60:02d}"


def _get(d: dict, *keys, default=None):
    """Retorna o primeiro dos keys presente em d (case-sensitive)."""
    for k in keys:
        if isinstance(d, dict) and k in d and d[k] is not None:
            return d[k]
    return default


def _airport_code(node) -> str:
    if isinstance(node, dict):
        ap = _get(node, "airport", "airportCode", default=node)
        if isinstance(ap, dict):
            return _get(ap, "code", "iataCode", "airportCode", default="?")
        return str(ap)
    return str(node) if node else "?"


def _fmt_dt(value) -> str:
    if value is None:
        return "?"
    # epoch ms
    if isinstance(value, (int, float)):
        try:
            return datetime.fromtimestamp(value / 1000, tz=timezone.utc).strftime("%d/%m %H:%M")
        except (ValueError, OSError):
            return str(value)
    # ISO string
    s = str(value)
    for fmt in ("%Y-%m-%dT%H:%M:%S", "%Y-%m-%dT%H:%M:%S.%f", "%Y-%m-%d %H:%M:%S", "%Y-%m-%dT%H:%M"):
        try:
            return datetime.strptime(s[: len(fmt) + 4], fmt).strftime("%d/%m %H:%M")
        except ValueError:
            continue
    return s


def _duration_minutes(node) -> int | None:
    d = _get(node, "duration")
    if isinstance(d, dict):
        h = _get(d, "hours", default=0) or 0
        m = _get(d, "minutes", default=0) or 0
        return int(h) * 60 + int(m)
    if isinstance(d, (int, float)):  # as vezes vem em minutos
        return int(d)
    return None


def _parse_fares(flight: dict) -> list[Fare]:
    fares: list[Fare] = []
    raw = _get(flight, "fareList", "fares", default=[]) or []
    seats_top = _get(flight, "availableSeats", "seatsAvailable")
    for fr in raw:
        if not isinstance(fr, dict):
            continue
        fares.append(
            Fare(
                tipo=_get(fr, "type", "fareType", "name", default="?"),
                milhas=_int(_get(fr, "miles", "milesAmount", "pointsAmount")),
                dinheiro=_float(_get(fr, "money", "amount", "airlineFarePrice", "value")),
                assentos=_int(_get(fr, "availableSeats", "seats", default=seats_top)),
            )
        )
    return fares


def _int(v):
    try:
        return int(round(float(v)))
    except (TypeError, ValueError):
        return None


def _float(v):
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def parse_flights(data: dict) -> list[Voo]:
    """Extrai voos de qualquer variacao conhecida do envelope de resposta."""
    voos: list[Voo] = []
    segments = (
        _get(data, "requestedFlightSegmentList", "flightSegmentList", "segments", default=[])
        or []
    )
    # Alguns formatos poem os voos direto na raiz.
    if not segments and _get(data, "flightList"):
        segments = [data]

    for seg in segments:
        flights = _get(seg, "flightList", "flights", default=[]) or []
        for fl in flights:
            if not isinstance(fl, dict):
                continue
            dep = _get(fl, "departure", "origin", default={})
            arr = _get(fl, "arrival", "destination", default={})
            airline = _get(fl, "airline", "carrier", default={})
            voos.append(
                Voo(
                    origem=_airport_code(dep),
                    destino=_airport_code(arr),
                    partida=_fmt_dt(_get(dep, "date", "dateTime", "departureDate")),
                    chegada=_fmt_dt(_get(arr, "date", "dateTime", "arrivalDate")),
                    companhia=_get(airline, "name", "code", default="?") if isinstance(airline, dict) else str(airline),
                    numero=str(_get(fl, "flightNumber", "number", default="")),
                    paradas=_int(_get(fl, "stops", "numberOfStops", default=0)) or 0,
                    duracao_min=_duration_minutes(fl),
                    cabine=_get(fl, "cabin", "cabinType", default="?"),
                    fares=_parse_fares(fl),
                )
            )
    voos.sort(key=lambda v: v.menor_milhas)
    return voos
