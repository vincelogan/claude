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
import os
import sys

from smiles.config import load_config
from smiles.client import SmilesClient, SmilesError
from smiles.parser import parse_flights, resumo


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


def cmd_autokey(args: argparse.Namespace) -> int:
    """Testa a descoberta automatica da chave contra o site real do SMILES."""
    from smiles import autokey
    print("Procurando a x-api-key no JavaScript publico do SMILES...")
    try:
        r = autokey.discover(timeout=args.timeout)
    except autokey.DiscoveryError as exc:
        print(f"\n[FALHOU] {exc}", file=sys.stderr)
        return 1
    print("\nOK — chave descoberta automaticamente:")
    print(f"  x-api-key  : {r['api_key'][:8]}... ({len(r['api_key'])} chars)")
    print(f"  endpoint   : {r['search_url'] or '(usa o padrao embutido)'}")
    print(f"  veio de    : {r['source']}")
    print(f"  candidatos : {r['candidates']}")
    print("\nNao precisa configurar nada: a plataforma faz isso sozinha a cada uso.")
    return 0


def _mi(n):
    return "—" if n is None else f"{n:,}".replace(",", ".")


def _print_table(voos, clube: bool = False) -> None:
    if not voos:
        print("Nenhum voo retornado (ou nada disponivel para as datas).")
        return
    r = resumo(voos, clube)
    for leg in r["legs"]:
        do_trecho = [v for v in voos if v.trecho == leg["trecho"]]
        do_trecho.sort(key=lambda v: (0 if v.paradas == 0 else 1, v.ordem(clube)))
        print(f"\n{leg['rotulo']} — {leg['total']} voos, {leg['directs']} diretos"
              f" | menor: {_mi(leg['cheapest'])} milhas")
        for v in do_trecho:
            conex = "direto" if v.paradas == 0 else f"{v.paradas} conex."
            print(f"  {v.origem}->{v.destino}  {v.partida} -> {v.chegada}  "
                  f"{v.duracao_str():>6}  {conex:<8}  {v.companhia} {v.numero}  [{v.cabine}]")
            padrao, cl = v.milhas_padrao, v.milhas_clube
            linha = f"        Smiles: {_mi(padrao)} milhas"
            if cl is not None:
                linha += f"   |   Clube (assinantes): {_mi(cl)}"
            if v.taxas:
                linha += f"   +R$ {v.taxas:,.2f}".replace(",", "@").replace(".", ",").replace("@", ".")
            print(linha)
    if r["total_milhas"] is not None and len(r["legs"]) > 1:
        print(f"\n  VIAGEM COMPLETA (ida + volta): {_mi(r['total_milhas'])} milhas"
              + ("  [tarifa Clube]" if clube else "  [tarifa padrao Smiles]"))
    print()


def cmd_search(args: argparse.Namespace) -> int:
    cfg = load_config()
    demo = cfg.api_key == "demo" or os.environ.get("SMILES_DEMO") == "1"
    if demo:
        from smiles.demo import demo_search
        print("### MODO DEMO — dados SINTETICOS, nao sao precos reais do SMILES ###")
        data = demo_search(args.origin.upper(), args.dest.upper(), args.out,
                           cabin=args.cabin.upper(), return_date=args.ret)
        if args.json:
            json.dump(data, sys.stdout, ensure_ascii=False, indent=2)
            print()
            return 0
        _print_table(parse_flights(data), args.clube)
        return 0
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

    _print_table(parse_flights(data), args.clube)
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Busca pessoal de voos em milhas SMILES.")
    sub = p.add_subparsers(dest="cmd", required=True)

    pc = sub.add_parser("capture", help="captura a x-api-key/endpoint atuais via navegador")
    pc.add_argument("--show", action="store_true", help="mostra o navegador (nao-headless)")
    pc.set_defaults(func=cmd_capture)

    pa = sub.add_parser("autokey", help="testa a descoberta automatica da chave (sem navegador)")
    pa.add_argument("--timeout", type=int, default=20)
    pa.set_defaults(func=cmd_autokey)

    ps = sub.add_parser("search", help="pesquisa voos")
    ps.add_argument("--origin", required=True, help="origem (IATA/metropole, ex.: RIO, GRU)")
    ps.add_argument("--dest", required=True, help="destino (IATA/metropole, ex.: NYC, MIA)")
    ps.add_argument("--out", required=True, help="data de ida AAAA-MM-DD")
    ps.add_argument("--ret", default=None, help="data de volta AAAA-MM-DD (opcional)")
    ps.add_argument("--adults", type=int, default=1)
    ps.add_argument("--children", type=int, default=0)
    ps.add_argument("--infants", type=int, default=0)
    ps.add_argument("--cabin", default="ALL", help="ALL|ECONOMIC|PREMIUM_ECONOMIC|BUSINESS")
    ps.add_argument("--clube", action="store_true",
                    help="voce assina o Clube Smiles (mostra a tarifa de assinante)")
    ps.add_argument("--json", action="store_true", help="imprime o JSON cru")
    ps.set_defaults(func=cmd_search)
    return p


def main(argv=None) -> int:
    args = build_parser().parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
