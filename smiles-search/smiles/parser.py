"""Normaliza a resposta JSON do SMILES em voos legiveis.

FIDELIDADE — tres regras que este modulo respeita:

1. TRECHO. O SMILES devolve um item de `requestedFlightSegmentList` por
   trecho (ida, volta). Cada voo carrega o indice do seu trecho; nunca
   misturamos ida com volta numa lista so.
2. TIPO DE TARIFA. "SMILES" e o preco que qualquer pessoa paga; "SMILES_CLUB"
   so vale para quem assina o Clube Smiles (mensalidade a parte); os tipos com
   "MONEY" sao milhas+dinheiro, um produto diferente. Cada um fica separado —
   o preco padrao nunca e substituido pelo do Clube.
3. NAO INVENTAR. Campo ausente vira None e aparece como "—". Nada e estimado.

O schema exato do SMILES muda com o tempo, entao a leitura e defensiva:
procura chaves conhecidas em varios formatos e ignora o que nao existir.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone

SEM_PRECO = 10**12  # sentinela de ordenacao para voo sem tarifa legivel


@dataclass
class Fare:
    tipo: str                 # SMILES, SMILES_CLUB, SMILES_MONEY, ...
    milhas: int | None
    dinheiro: float | None    # taxas/copart. em BRL
    assentos: int | None

    @property
    def clube(self) -> bool:
        """Tarifa exclusiva de assinante do Clube Smiles."""
        return "CLUB" in (self.tipo or "").upper()

    @property
    def com_dinheiro(self) -> bool:
        """Tarifa milhas+dinheiro — produto diferente da tarifa so-milhas."""
        return "MONEY" in (self.tipo or "").upper()

    def rotulo(self) -> str:
        if self.clube and self.com_dinheiro:
            return "Clube + dinheiro"
        if self.clube:
            return "Clube Smiles (assinantes)"
        if self.com_dinheiro:
            return "Milhas + dinheiro"
        return "Smiles (padrão)"


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
    trecho: int = 0           # 0 = ida, 1 = volta, ...
    fares: list[Fare] = field(default_factory=list)

    def _menor(self, clube: bool) -> int | None:
        """Menor milhagem em tarifa SO-MILHAS do nivel pedido."""
        vals = [f.milhas for f in self.fares
                if f.milhas is not None and not f.com_dinheiro and f.clube is clube]
        return min(vals) if vals else None

    @property
    def milhas_padrao(self) -> int | None:
        """O que qualquer pessoa paga (sem assinar o Clube)."""
        return self._menor(False)

    @property
    def milhas_clube(self) -> int | None:
        """Só para assinantes do Clube Smiles."""
        return self._menor(True)

    def preco(self, clube: bool = False) -> int | None:
        """Preco de referencia; assinante ve o do Clube, com queda para o padrao."""
        if clube:
            return self.milhas_clube if self.milhas_clube is not None else self.milhas_padrao
        return self.milhas_padrao

    def ordem(self, clube: bool = False) -> int:
        p = self.preco(clube)
        return SEM_PRECO if p is None else p

    @property
    def taxas(self) -> float | None:
        vals = [f.dinheiro for f in self.fares if f.dinheiro is not None]
        return min(vals) if vals else None

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
    if isinstance(value, (int, float)):          # epoch ms
        try:
            return datetime.fromtimestamp(value / 1000, tz=timezone.utc).strftime("%d/%m %H:%M")
        except (ValueError, OSError):
            return str(value)
    s = str(value)                                # ISO
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


def parse_flights(data: dict) -> list[Voo]:
    """Extrai voos preservando a que trecho (ida/volta) cada um pertence."""
    voos: list[Voo] = []
    segments = (
        _get(data, "requestedFlightSegmentList", "flightSegmentList", "segments", default=[])
        or []
    )
    # Alguns formatos poem os voos direto na raiz.
    if not segments and _get(data, "flightList"):
        segments = [data]

    for idx, seg in enumerate(segments):
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
                    trecho=idx,
                    fares=_parse_fares(fl),
                )
            )
    return voos


def resumo(voos: list[Voo], clube: bool = False) -> dict:
    """Resumo fiel: por trecho, e o TOTAL da viagem quando ha ida e volta.

    `total` so existe se todo trecho pedido tiver ao menos um voo com preco —
    somar trechos incompletos daria um numero falso.
    """
    trechos = sorted({v.trecho for v in voos})
    por_trecho = []
    for t in trechos:
        do_trecho = [v for v in voos if v.trecho == t]
        precos = [v.preco(clube) for v in do_trecho if v.preco(clube) is not None]
        diretos = [v.preco(clube) for v in do_trecho
                   if v.paradas == 0 and v.preco(clube) is not None]
        por_trecho.append({
            "trecho": t,
            "rotulo": "Ida" if t == 0 else ("Volta" if t == 1 else f"Trecho {t + 1}"),
            "cheapest": min(precos) if precos else None,
            "cheapest_direct": min(diretos) if diretos else None,
            "directs": sum(1 for v in do_trecho if v.paradas == 0),
            "total": len(do_trecho),
        })

    completos = [s["cheapest"] for s in por_trecho]
    total = sum(completos) if por_trecho and all(c is not None for c in completos) else None
    return {
        "legs": por_trecho,
        "total_milhas": total,          # soma dos trechos (viagem inteira)
        "cheapest": por_trecho[0]["cheapest"] if por_trecho else None,
        "cheapest_direct": por_trecho[0]["cheapest_direct"] if por_trecho else None,
        "directs": sum(s["directs"] for s in por_trecho),
        "total": len(voos),
        "clube": clube,
    }
