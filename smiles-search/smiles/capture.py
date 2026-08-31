"""Captura automatica da x-api-key e do endpoint reais via Chromium.

Abre a propria pagina de busca do SMILES num navegador (Playwright), deixa o
site fazer a chamada 'airlines/search' sozinho, intercepta essa requisicao e
guarda host+path, a x-api-key e os parametros "fixos" em config.json.

Isto e o cerne do 'modus operandi': em vez de chumbar uma chave que a Gol
rotaciona, pegamos a chave viva da sessao do proprio site.
"""

from __future__ import annotations

from urllib.parse import urlsplit, parse_qs

from .config import SmilesConfig, save_config

# Parametros que variam por busca — nao devem virar "base_params".
VARIABLE_PARAMS = {
    "originairportcode", "destinationairportcode", "originairport", "destinationairport",
    "departuredate", "returndate", "adults", "children", "infants", "babies",
    "cabintype", "cabin", "triptype", "segments",
}

# URL de exemplo (a mesma estrutura da que voce mandou) so para "acordar" a API.
EXAMPLE_URL = (
    "https://www.smiles.com.br/mfe/emissao-passagem/"
    "?adults=1&cabin=ALL&children=0&infants=0&tripType=2&segments=1&searchType=g3"
    "&originAirport=GRU&originAirportIsAny=false"
    "&destinationAirport=GIG&destinAirportIsAny=false"
    "&departureDate={dep}&novo-resultado-voos=true"
)


def _example_departure_ms() -> int:
    from datetime import datetime, timedelta, timezone

    d = datetime.now(tz=timezone.utc) + timedelta(days=45)
    d = d.replace(hour=3, minute=0, second=0, microsecond=0)  # ~meia-noite BRT
    return int(d.timestamp() * 1000)


def capture(headless: bool = True, timeout_ms: int = 60000) -> SmilesConfig:
    try:
        from playwright.sync_api import sync_playwright
    except ImportError as exc:  # pragma: no cover
        raise RuntimeError(
            "Playwright nao instalado. Rode: pip install playwright && "
            "python -m playwright install chromium"
        ) from exc

    captured: dict = {}

    def on_request(request):
        url = request.url.lower()
        if "smiles.com.br" not in url:
            return
        if "search" not in url:
            return
        headers = request.headers
        if "x-api-key" not in headers:
            return
        if captured:  # ja pegamos a primeira boa
            return
        parts = urlsplit(request.url)
        qs = parse_qs(parts.query)
        base_params = {
            k: v[0]
            for k, v in qs.items()
            if k.lower() not in VARIABLE_PARAMS
        }
        extra_headers = {}
        for h in ("region", "channel", "x-strategy", "language"):
            if h in headers:
                extra_headers[h] = headers[h]
        captured.update(
            {
                "search_url": f"{parts.scheme}://{parts.netloc}{parts.path}",
                "api_key": headers["x-api-key"],
                "base_params": base_params,
                "extra_headers": extra_headers,
            }
        )

    url = EXAMPLE_URL.format(dep=_example_departure_ms())
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=headless)
        page = browser.new_context(
            user_agent=(
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
            )
        ).new_page()
        page.on("request", on_request)
        page.goto(url, wait_until="domcontentloaded", timeout=timeout_ms)
        # Espera a chamada de busca acontecer.
        page.wait_for_timeout(2000)
        waited = 2000
        while not captured and waited < timeout_ms:
            page.wait_for_timeout(1000)
            waited += 1000
        browser.close()

    if not captured:
        raise RuntimeError(
            "Nao consegui interceptar a chamada de busca. O site pode ter mudado "
            "o fluxo, exigido interacao, ou bloqueado o navegador headless. "
            "Tente com headless=False, ou capture a x-api-key manualmente pelo "
            "DevTools (F12 -> Network -> filtre 'search')."
        )

    cfg = SmilesConfig(**captured)
    save_config(cfg)
    return cfg
