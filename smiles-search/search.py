#!/usr/bin/env python3
"""CLI da ferramenta pessoal de busca SMILES.

Uso:
  python search.py capture                 # captura a x-api-key/endpoint atuais
  python search.py search --origin RIO --dest NYC \
      --out 2027-05-07 --ret 2027-05-17 --adults 2 --cabin ALL
"""

from __future__ import annotations

import argparse
import json
import sys

from smiles.config import load_config
from smiles.client import SmilesClient, SmilesError
from smiles.parser import parse_flights


def cmd_capture(args: argparse.Namespace) -> int:
    from smiles.capture import capture

    print("Abrindo o site do SMILES para capturar a chave/endpoint atuais...")
    try:
        cfg = capture(headless=not args.show)
    except RuntimeError as exc:
        print(f"[erro] {exc}", file=sys.stderr)
        return 1
    print("OK. Capturado e salvo em config.json:")
    print(f"  endpoint : {cfg.search_url}")
    print(f"  x-api-key: {cfg.api_key[:6]}... ({len(cfg.api_key)} chars)")
    if cfg.base_params:
        print(f"  params fixos: {', '.join(cfg.base_params)}")
    return 0


def _print_table(voos) -> None:
    if not voos:
        print("Nenhum voo retornado (ou nada disponivel para as datas).")
        return
    print(f"\n{len(voos)} voos (mais baratos primeiro em milhas):\n")
    for v in voos:
        conex = "direto" if v.paradas == 0 else f"{v.paradas} conex."
        print(
            f"  {v.origem}->{v.destino}  {v.partida} -> {v.chegada}  "
            f"{v.duracao_str():>6}  {conex:<8}  {v.companhia} {v.numero}  [{v.cabine}]"
        )
        for f in v.fares:
            print(f"        - {f.label()}")
    print()


def cmd_search(args: argparse.Namespace) -> int:
    cfg = load_config()
    if not cfg.is_usable:
        print(
            "Sem x-api-key configurada. Rode primeiro:\n  python search.py capture",
            file=sys.stderr,
        )
        return 1
    try:
        client = SmilesClient(cfg)
        data = client.search(
            origin=args.origin,
            dest=args.dest,
            departure_date=args.out,
            return_date=args.ret,
            adults=args.adults,
            children=args.children,
            infants=args.infants,
            cabin=args.cabin,
        )
    except SmilesError as exc:
        print(f"[erro] {exc}", file=sys.stderr)
        return 1

    if args.json:
        json.dump(data, sys.stdout, ensure_ascii=False, indent=2)
        print()
        return 0

    _print_table(parse_flights(data))
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Busca pessoal de voos em milhas SMILES.")
    sub = p.add_subparsers(dest="cmd", required=True)

    pc = sub.add_parser("capture", help="captura a x-api-key/endpoint atuais via navegador")
    pc.add_argument("--show", action="store_true", help="mostra o navegador (nao-headless)")
    pc.set_defaults(func=cmd_capture)

    ps = sub.add_parser("search", help="pesquisa voos")
    ps.add_argument("--origin", required=True, help="origem (IATA/metropole, ex.: RIO, GRU)")
    ps.add_argument("--dest", required=True, help="destino (IATA/metropole, ex.: NYC, MIA)")
    ps.add_argument("--out", required=True, help="data de ida AAAA-MM-DD")
    ps.add_argument("--ret", default=None, help="data de volta AAAA-MM-DD (opcional)")
    ps.add_argument("--adults", type=int, default=1)
    ps.add_argument("--children", type=int, default=0)
    ps.add_argument("--infants", type=int, default=0)
    ps.add_argument("--cabin", default="ALL", help="ALL|ECONOMIC|PREMIUM_ECONOMIC|BUSINESS")
    ps.add_argument("--json", action="store_true", help="imprime o JSON cru")
    ps.set_defaults(func=cmd_search)
    return p


def main(argv=None) -> int:
    args = build_parser().parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
