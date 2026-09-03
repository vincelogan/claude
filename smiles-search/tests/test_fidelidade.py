#!/usr/bin/env python3
"""Testes das regras de fidelidade dos dados de milhas.

Rode:  python tests/test_fidelidade.py
Cada teste trava um comportamento que, se quebrar, faria a plataforma
mostrar um numero de milhas que nao corresponde ao que o SMILES cobra.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from smiles.client import date_to_epoch_ms
from smiles.demo import demo_search
from smiles.parser import parse_flights, resumo

falhas = []


def check(nome, cond, detalhe=""):
    print(("  ok   " if cond else "  FALHA") + f"  {nome}" + (f"  [{detalhe}]" if detalhe and not cond else ""))
    if not cond:
        falhas.append(nome)


def voo(origem, destino, fares, stops=0):
    return {"departure": {"airport": {"code": origem}},
            "arrival": {"airport": {"code": destino}},
            "stops": stops, "fareList": fares}


IDA_VOLTA = {"requestedFlightSegmentList": [
    {"flightList": [voo("GIG", "JFK", [{"type": "SMILES", "miles": 95000, "money": 289.10},
                                       {"type": "SMILES_CLUB", "miles": 80000, "money": 289.10}])]},
    {"flightList": [voo("JFK", "GIG", [{"type": "SMILES", "miles": 60000, "money": 120.00},
                                       {"type": "SMILES_CLUB", "miles": 51000, "money": 120.00}])]},
]}

print("\n1) Ida e volta sao trechos SEPARADOS")
v = parse_flights(IDA_VOLTA)
check("cada voo sabe seu trecho", sorted(x.trecho for x in v) == [0, 1])
check("ida e trecho 0", next(x for x in v if x.trecho == 0).destino == "JFK")
check("volta e trecho 1", next(x for x in v if x.trecho == 1).destino == "GIG")

print("\n2) Resumo nao mistura trechos e soma a viagem inteira")
r = resumo(v)
check("dois trechos no resumo", len(r["legs"]) == 2)
check("menor da ida = 95.000 (padrao)", r["legs"][0]["cheapest"] == 95000, str(r["legs"][0]["cheapest"]))
check("menor da volta = 60.000 (padrao)", r["legs"][1]["cheapest"] == 60000, str(r["legs"][1]["cheapest"]))
check("total da viagem = 155.000", r["total_milhas"] == 155000, str(r["total_milhas"]))

print("\n3) Tarifa do Clube NUNCA substitui a padrao")
x = next(i for i in v if i.trecho == 0)
check("milhas_padrao = 95.000", x.milhas_padrao == 95000)
check("milhas_clube = 80.000", x.milhas_clube == 80000)
check("preco() sem clube usa a padrao", x.preco(False) == 95000)
check("preco(clube=True) usa a do Clube", x.preco(True) == 80000)
rc = resumo(v, clube=True)
check("resumo do assinante soma 131.000", rc["total_milhas"] == 131000, str(rc["total_milhas"]))

print("\n4) Tarifa milhas+dinheiro nao entra no preco 'so milhas'")
so_money = parse_flights({"requestedFlightSegmentList": [{"flightList": [
    voo("GRU", "GIG", [{"type": "SMILES_MONEY", "miles": 5000, "money": 400.0},
                       {"type": "SMILES", "miles": 12000, "money": 60.0}])]}]})[0]
check("padrao ignora o +dinheiro (12.000, nao 5.000)", so_money.milhas_padrao == 12000,
      str(so_money.milhas_padrao))
check("a tarifa +dinheiro continua listada", any(f.com_dinheiro for f in so_money.fares))

print("\n5) Sem tarifa legivel -> None (nao inventa numero)")
vazio = parse_flights({"requestedFlightSegmentList": [{"flightList": [voo("GRU", "GIG", [])]}]})[0]
check("milhas_padrao e None", vazio.milhas_padrao is None)
check("preco e None", vazio.preco() is None)
check("resumo do trecho sem preco = None", resumo([vazio])["legs"][0]["cheapest"] is None)

print("\n6) Total so existe se TODO trecho tiver preco")
parcial = parse_flights({"requestedFlightSegmentList": [
    {"flightList": [voo("GIG", "JFK", [{"type": "SMILES", "miles": 95000}])]},
    {"flightList": [voo("JFK", "GIG", [])]},
]})
check("trecho sem preco impede o total", resumo(parcial)["total_milhas"] is None)

print("\n7) Datas em epoch batem com a URL real do SMILES")
check("2027-05-17 -> 1810566000000", date_to_epoch_ms("2027-05-17") == 1810566000000,
      str(date_to_epoch_ms("2027-05-17")))
check("ida e volta no mesmo padrao (12h de diferenca do dia seguinte)",
      date_to_epoch_ms("2027-05-08") - date_to_epoch_ms("2027-05-07") == 86400000)

print("\n8) Demo gera os DOIS trechos em ida e volta")
d = demo_search("RIO", "NYC", "2027-05-07", return_date="2027-05-17")
check("dois segmentos", len(d["requestedFlightSegmentList"]) == 2)
check("marcado como demo", d.get("demo") is True)
dv = parse_flights(d)
check("volta vai de NYC para RIO",
      all(x.origem in ("JFK", "EWR", "LGA") for x in dv if x.trecho == 1))
check("so ida gera um segmento",
      len(demo_search("RIO", "NYC", "2027-05-07")["requestedFlightSegmentList"]) == 1)

print("\n9) Ordenacao mantem os trechos agrupados")
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from server import _sort
ordenado = _sort(parse_flights(IDA_VOLTA), "smart", False)
check("trechos nao se intercalam",
      [x.trecho for x in ordenado] == sorted(x.trecho for x in ordenado))

print("\n" + ("FALHOU: " + ", ".join(falhas) if falhas else "TODOS OS TESTES PASSARAM"))
sys.exit(1 if falhas else 0)
