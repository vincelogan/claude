"""Monta a URL da busca no site do SMILES (a pagina, nao a API).

Fica separado porque DOIS caminhos precisam exatamente da mesma URL:

  - o link "emitir no SMILES" que a plataforma mostra no resultado;
  - o modo navegador (smiles/navegador.py), que abre essa mesma pagina no
    Chromium e escuta a resposta da API.

Se as duas versoes divergissem, o link levaria o usuario a uma busca
diferente da que gerou os numeros na tela.
"""

from __future__ import annotations

from datetime import datetime, timezone
from urllib.parse import urlencode

from .airports import resolve


def date_to_epoch_ms(date_str: str) -> int:
    """'2027-05-07' -> epoch ms no meio-dia de Brasilia (15h UTC).

    E o valor que a URL real do site usa, e da 12h de folga de cada lado da
    virada do dia — imune a fuso.
    """
    d = datetime.strptime(date_str, "%Y-%m-%d").replace(tzinfo=timezone.utc)
    return int(d.timestamp() * 1000) + 15 * 3600 * 1000


def mfe_url(origin: str, dest: str, out: str, ret: str | None = None,
            adults: int = 1, children: int = 0, infants: int = 0,
            cabin: str = "ALL") -> str:
    """Link profundo para a busca no site do SMILES."""
    o, d = resolve(origin), resolve(dest)
    q = {
        "adults": adults, "children": children, "infants": infants,
        "cabin": cabin, "departureDate": date_to_epoch_ms(out),
        "isElegible": "false", "isFlexibleDateChecked": "false",
        "searchType": "g3", "segments": "1",
        "tripType": "1" if ret else "2",
        "originAirport": origin, "originCity": "", "originCountry": "",
        "originAirportIsAny": "true" if o and o["kind"] == "metro" else "false",
        "destinationAirport": dest, "destinCity": "", "destinCountry": "",
        "destinAirportIsAny": "true" if d and d["kind"] == "metro" else "false",
        "novo-resultado-voos": "true",
    }
    if ret:
        q["returnDate"] = date_to_epoch_ms(ret)
    return "https://www.smiles.com.br/mfe/emissao-passagem/?" + urlencode(q)
