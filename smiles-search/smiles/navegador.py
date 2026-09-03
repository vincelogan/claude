"""Modo navegador: faz a busca dentro do Chromium, como uma pessoa faria.

POR QUE ISTO EXISTE
-------------------
O SMILES fica atras do Akamai. Mandar a requisicao com `requests` — mesmo com
todos os headers de Chrome — leva HTTP 406 a partir de IP de datacenter: a
protecao olha muito alem dos headers (reputacao do IP, impressao digital do
handshake TLS/HTTP2). Falsificar esses sinais exige biblioteca cujo unico
proposito e se passar por navegador; nao e o caminho deste projeto.

A saida honesta e nao ter o que falsificar: quem faz a requisicao passa a ser
um Chromium de verdade, abrindo a MESMA pagina publica que voce abriria, com a
MESMA busca. Nos so lemos a resposta que o site ja recebeu — nenhum login,
nenhum contorno de protecao, nenhuma tarifa que o site nao mostraria a voce.

So faz sentido na sua maquina: no Vercel nao ha navegador (e e justamente o IP
de la que e recusado).

CUSTO
-----
Abrir o navegador leva alguns segundos. Por isso a instancia fica VIVA entre as
buscas (`_SESSAO`) — sem isso a varredura de um mes no calendario abriria o
Chromium 30 vezes. O acesso e serializado por um lock: uma busca por vez, o que
tambem mantem o ritmo respeitoso com o servidor da Gol.
"""

from __future__ import annotations

import os
import threading
import time

from .urls import mfe_url

# Caminho de um Chromium ja instalado, se voce nao quiser (ou nao puder) usar o
# que o Playwright baixa. Ex.: SMILES_CHROMIUM=/usr/bin/google-chrome
CHROMIUM = os.environ.get("SMILES_CHROMIUM", "").strip()

# Ritmo minimo entre buscas reais, igual ao do cliente HTTP.
MIN_INTERVAL = 1.5

# Quanto esperar a resposta da API depois que a pagina abre.
ESPERA_MS = 60_000

# Fecha o navegador se ficar este tempo sem uso (libera ~300MB de RAM).
OCIOSO_S = 600


class NavegadorError(RuntimeError):
    pass


def _pw():
    try:
        from playwright.sync_api import sync_playwright
    except ImportError as exc:  # pragma: no cover
        raise NavegadorError(
            "Modo navegador precisa do Playwright. Rode:\n"
            "  pip install playwright\n"
            "  python -m playwright install chromium"
        ) from exc
    return sync_playwright


class SessaoNavegador:
    """Um Chromium vivo, reaproveitado entre buscas.

    Playwright sincrono e preso a thread que o criou, entao TUDO aqui roda
    sob `self._lock` — e o servidor Flask atende buscas em threads diferentes.
    """

    def __init__(self, headless: bool = True):
        self.headless = headless
        self._lock = threading.RLock()
        self._pw = None
        self._browser = None
        self._ctx = None
        self._ultima_busca = 0.0
        self._ultimo_uso = 0.0

    # ---- ciclo de vida ----
    def _abrir(self):
        if self._ctx is not None:
            return
        sync_playwright = _pw()
        self._pw = sync_playwright().start()
        opcoes = {"headless": self.headless}
        if CHROMIUM:
            opcoes["executable_path"] = CHROMIUM
        try:
            self._browser = self._pw.chromium.launch(**opcoes)
        except Exception as exc:
            self._fechar_silencioso()
            raise NavegadorError(
                f"Nao consegui abrir o Chromium: {exc}\n"
                "Rode 'python -m playwright install chromium', ou aponte um "
                "navegador que voce ja tem: SMILES_CHROMIUM=/caminho/do/chrome"
            ) from exc
        # locale/timezone do Brasil: e o que um usuario do SMILES teria, e
        # afeta o que o site considera "sua" busca.
        self._ctx = self._browser.new_context(
            locale="pt-BR",
            timezone_id="America/Sao_Paulo",
            viewport={"width": 1366, "height": 900},
        )

    def _fechar_silencioso(self):
        for obj, metodo in ((self._ctx, "close"), (self._browser, "close"),
                            (self._pw, "stop")):
            if obj is not None:
                try:
                    getattr(obj, metodo)()
                except Exception:
                    pass
        self._ctx = self._browser = self._pw = None

    def close(self):
        with self._lock:
            self._fechar_silencioso()

    def _reciclar_se_ocioso(self):
        if self._ctx is not None and self._ultimo_uso and \
                (time.monotonic() - self._ultimo_uso) > OCIOSO_S:
            self._fechar_silencioso()

    def _throttle(self):
        espera = MIN_INTERVAL - (time.monotonic() - self._ultima_busca)
        if espera > 0:
            time.sleep(espera)
        self._ultima_busca = time.monotonic()

    # ---- busca ----
    def search(self, origin: str, dest: str, departure_date: str,
               return_date: str | None = None, adults: int = 1,
               children: int = 0, infants: int = 0, cabin: str = "ALL",
               timeout_ms: int = ESPERA_MS) -> dict:
        """Abre a busca no Chromium e devolve o JSON que o site recebeu."""
        url = mfe_url(origin, dest, departure_date, return_date,
                      adults, children, infants, cabin)
        return self._buscar_via_url(url, timeout_ms)

    def _buscar_via_url(self, url: str, timeout_ms: int = ESPERA_MS) -> dict:
        """Abre uma URL e devolve o JSON da busca que a pagina disparar.

        Separado de `search` para os testes poderem apontar para um SMILES
        falso local — o ambiente de desenvolvimento nao alcanca o site real.
        """
        with self._lock:
            self._reciclar_se_ocioso()
            self._abrir()
            self._throttle()
            try:
                return self._buscar_na_pagina(url, timeout_ms)
            except NavegadorError:
                raise
            except Exception as exc:
                # Navegador em estado ruim (crash, contexto morto): descarta,
                # para a proxima busca comecar limpa em vez de repetir o erro.
                self._fechar_silencioso()
                raise NavegadorError(f"Falha no navegador: {exc}") from exc
            finally:
                self._ultimo_uso = time.monotonic()

    def _buscar_na_pagina(self, url: str, timeout_ms: int) -> dict:
        respostas: list[dict] = []
        erros: list[str] = []

        def on_response(resp):
            u = resp.url.lower()
            if "airlines/search" not in u and "flightsearch" not in u:
                return
            if resp.status >= 400:
                erros.append(f"HTTP {resp.status} em {resp.url[:120]}")
                return
            try:
                dados = resp.json()
            except Exception:
                return
            # So conta se vier com a estrutura de resultado de voos.
            if isinstance(dados, dict) and (
                    dados.get("requestedFlightSegmentList") is not None
                    or dados.get("flightSegmentList") is not None
                    or dados.get("flightList") is not None):
                respostas.append(dados)

        page = self._ctx.new_page()
        page.on("response", on_response)
        try:
            page.goto(url, wait_until="domcontentloaded", timeout=timeout_ms)
            esperou = 0
            while not respostas and esperou < timeout_ms:
                page.wait_for_timeout(500)
                esperou += 500
        finally:
            try:
                page.close()
            except Exception:
                pass

        if respostas:
            return respostas[-1]
        if erros:
            raise NavegadorError(
                "O proprio site do SMILES recebeu erro na busca: "
                + "; ".join(erros[:3]))
        raise NavegadorError(
            "O navegador abriu a pagina mas nao vi a resposta da busca em "
            f"{timeout_ms // 1000}s. Pode ser data sem voos, ou o site pediu "
            "alguma interacao. Tente com SMILES_BROWSER_HEADED=1 para ver a "
            "janela e entender o que apareceu.")


# ---------------------------------------------------------------------------
# Instancia unica do processo.
# ---------------------------------------------------------------------------
_SESSAO: SessaoNavegador | None = None
_SESSAO_LOCK = threading.Lock()


def sessao(headless: bool = True) -> SessaoNavegador:
    global _SESSAO
    with _SESSAO_LOCK:
        if _SESSAO is None:
            _SESSAO = SessaoNavegador(headless=headless)
        return _SESSAO


def search(origin: str, dest: str, departure_date: str,
           return_date: str | None = None, adults: int = 1, children: int = 0,
           infants: int = 0, cabin: str = "ALL", headless: bool = True) -> dict:
    """Busca pelo navegador, reaproveitando a instancia aberta."""
    return sessao(headless=headless).search(
        origin, dest, departure_date, return_date,
        adults, children, infants, cabin)


def fechar() -> None:
    global _SESSAO
    with _SESSAO_LOCK:
        if _SESSAO is not None:
            _SESSAO.close()
            _SESSAO = None
