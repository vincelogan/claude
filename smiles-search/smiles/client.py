"""Cliente que replica a chamada interna airlines/search do SMILES."""

from __future__ import annotations

import threading
import time

import requests

from .autokey import browser_headers
from .config import SmilesConfig
from .urls import date_to_epoch_ms  # noqa: F401  (reexportado: server/search usam daqui)

BROWSER_UA = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)

# Intervalo minimo entre chamadas reais ao SMILES (a varredura do calendario
# faz uma busca por dia — isto garante um ritmo respeitoso mesmo assim).
MIN_INTERVAL = 1.5
_throttle_lock = threading.Lock()
_last_call = 0.0


def _throttle() -> None:
    global _last_call
    with _throttle_lock:
        wait = MIN_INTERVAL - (time.monotonic() - _last_call)
        if wait > 0:
            time.sleep(wait)
        _last_call = time.monotonic()


class SmilesError(RuntimeError):
    pass


# Uma unica definicao de data para o projeto inteiro (smiles/urls.py). Ja
# houve divergencia aqui — o cliente usava meia-noite e a URL do site,
# meio-dia — e um dia de diferenca muda o resultado da busca.


class SmilesClient:
    def __init__(self, cfg: SmilesConfig):
        if not cfg.is_usable:
            raise SmilesError(
                "Config sem x-api-key. Rode 'python search.py capture' primeiro, "
                "ou preencha config.json (veja config.example.json)."
            )
        self.cfg = cfg
        self.session = requests.Session()
        self.session.headers.update(browser_headers(**{
            "x-api-key": cfg.api_key, **(cfg.extra_headers or {})}))

    def search(
        self,
        origin: str,
        dest: str,
        departure_date: str,
        return_date: str | None = None,
        adults: int = 1,
        children: int = 0,
        infants: int = 0,
        cabin: str = "ALL",
        timeout: int = 40,
    ) -> dict:
        """Faz a busca e devolve o JSON cru. Levanta SmilesError em falha."""
        params = dict(self.cfg.base_params or {})
        params.update(
            {
                "originAirportCode": origin.upper(),
                "destinationAirportCode": dest.upper(),
                "departureDate": date_to_epoch_ms(departure_date),
                "adults": adults,
                "children": children,
                "infants": infants,
                "cabinType": cabin.upper(),
                # Convencao observada na URL do site: 1 = ida e volta, 2 = so ida.
                "tripType": "1" if return_date else "2",
            }
        )
        if return_date:
            params["returnDate"] = date_to_epoch_ms(return_date)

        _throttle()
        try:
            resp = self.session.get(self.cfg.search_url, params=params, timeout=timeout)
        except requests.RequestException as exc:
            raise SmilesError(f"Falha de rede: {exc}") from exc

        if resp.status_code in (401, 403):
            raise SmilesError(
                f"HTTP {resp.status_code}: a x-api-key provavelmente rotacionou/expirou. "
                "Rode 'python search.py capture' de novo para pegar a chave atual."
            )
        if resp.status_code == 406:
            raise SmilesError(
                "HTTP 406: a protecao anti-bot (Akamai) do SMILES recusou a "
                "requisicao. Isso costuma ser header faltando ou o IP do "
                "servidor. Rode a mesma busca na sua maquina para comparar: "
                "se funcionar local e falhar no Vercel, e bloqueio de IP de "
                "datacenter — nesse caso use a versao local.")
        if resp.status_code == 429:
            raise SmilesError("HTTP 429: muitas buscas. Espere um pouco e diminua a frequencia.")
        if resp.status_code >= 400:
            raise SmilesError(f"HTTP {resp.status_code}: {resp.text[:300]}")

        try:
            return resp.json()
        except ValueError as exc:
            raise SmilesError(f"Resposta nao-JSON: {resp.text[:300]}") from exc
