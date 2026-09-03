"""Descobre sozinho a x-api-key e o endpoint de busca do SMILES.

A chave NAO e um segredo: o proprio site a embute no JavaScript publico que
qualquer visitante baixa. Este modulo faz o que o navegador faria — busca a
pagina, acha os bundles JS e extrai a chave — so que com HTTP puro, sem
navegador. Assim funciona no Vercel (serverless) e se auto-corrige quando a
Gol rotaciona a chave.

Nao ha login, cookie de sessao nem burla de protecao: e leitura de arquivo
publico. O uso continua pessoal e com ritmo respeitoso.

LIMITACAO CONHECIDA: os padroes abaixo foram escritos SEM acesso ao bundle
real (a rede do ambiente de desenvolvimento bloqueia smiles.com.br). Por isso
sao varios padroes redundantes, e a funcao explica em detalhe quando falha.
Rode `python search.py autokey` na sua maquina para confirmar de verdade.
"""

from __future__ import annotations

import re
from urllib.parse import urljoin

import requests

# O SMILES fica atras do Akamai, que recusa (HTTP 406) requisicoes cujo
# conjunto de headers nao parece de navegador. Mandamos o mesmo conjunto que
# o Chrome manda — e coerente entre si: UA de Windows combina com
# sec-ch-ua-platform "Windows". UA de Linux + platform Windows denuncia bot.
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36")

SEC_CH_UA = '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"'

# So anuncia brotli se soubermos descompactar — senao a resposta viria
# ilegivel. urllib3 usa o pacote brotli/brotlicffi quando presente.
try:
    import brotli as _brotli  # noqa: F401
    _ACCEPT_ENC = "gzip, deflate, br"
except ImportError:  # pragma: no cover
    try:
        import brotlicffi as _brotli  # noqa: F401
        _ACCEPT_ENC = "gzip, deflate, br"
    except ImportError:
        _ACCEPT_ENC = "gzip, deflate"


def browser_headers(**extra) -> dict:
    """Headers de navegador real. Sem isto o Akamai devolve 406."""
    h = {
        "User-Agent": UA,
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept-Encoding": _ACCEPT_ENC,
        "Origin": "https://www.smiles.com.br",
        "Referer": "https://www.smiles.com.br/",
        "sec-ch-ua": SEC_CH_UA,
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
        "Connection": "keep-alive",
    }
    h.update({k: v for k, v in extra.items() if v is not None})
    return h


def page_headers() -> dict:
    """Headers para buscar PAGINA/JS (navegacao), nao a API."""
    h = browser_headers()
    h.update({
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Upgrade-Insecure-Requests": "1",
    })
    h.pop("Origin", None)
    h.pop("Referer", None)
    return h

PAGINAS = [
    "https://www.smiles.com.br/mfe/emissao-passagem/",
    "https://www.smiles.com.br/",
]

MAX_BUNDLES = 25          # nao varrer o site inteiro
MAX_BYTES = 6_000_000     # teto por arquivo

_CHAVE = r"([A-Za-z0-9_\-]{20,60})"
PADROES_CHAVE = [
    re.compile(r"""["']x-api-key["']\s*:\s*["']""" + _CHAVE + r"""["']""", re.I),
    re.compile(r"""x-api-key["']?\s*[:=]\s*["']""" + _CHAVE + r"""["']""", re.I),
    re.compile(r"""["'](?:apiKey|api_key|API_KEY|xApiKey)["']\s*:\s*["']""" + _CHAVE + r"""["']""", re.I),
    re.compile(r"""(?:apiKey|xApiKey)\s*=\s*["']""" + _CHAVE + r"""["']"""),
    # minificado costuma vir sem aspas no nome: apiKey:"..."
    re.compile(r"""\b(?:apiKey|api_key|API_KEY|xApiKey)\s*:\s*["']""" + _CHAVE + r"""["']"""),
]

PADRAO_URL = re.compile(
    r"""https://[A-Za-z0-9.\-]*smiles\.com\.br/[A-Za-z0-9/_\-]*airlines/search""", re.I)

PISTAS = ("airlines/search", "flightsearch", "flight-search", "air-flightsearch")

FALSOS = re.compile(
    r"^(?:undefined|null|true|false|function|process|env|production|development|"
    r"application|json|content|authorization|bearer|x-api-key)$", re.I)


class DiscoveryError(RuntimeError):
    """Nao foi possivel descobrir a chave — a mensagem explica o que falhou."""


def _baixar(sess, url, timeout):
    r = sess.get(url, timeout=timeout, stream=True)
    r.raise_for_status()
    dados = r.raw.read(MAX_BYTES, decode_content=True) or b""
    return dados.decode("utf-8", "ignore")


def _scripts(html: str, base: str) -> list[str]:
    """URLs de JS referenciadas na pagina, na ordem em que aparecem."""
    urls = []
    for m in re.finditer(r"""<script[^>]+src=["']([^"']+)["']""", html, re.I):
        urls.append(urljoin(base, m.group(1)))
    for m in re.finditer(
            r"""<link[^>]+(?:rel=["'](?:preload|modulepreload)["'][^>]*href|href)=["']([^"']+\.js[^"']*)["']""",
            html, re.I):
        urls.append(urljoin(base, m.group(1)))
    vistos, saida = set(), []
    for u in urls:
        if u not in vistos and ".js" in u.lower():
            vistos.add(u)
            saida.append(u)
    return saida


def _extrair(texto: str):
    """Devolve (chaves candidatas, url de busca) encontradas num texto."""
    chaves = []
    for pad in PADROES_CHAVE:
        for m in pad.finditer(texto):
            k = m.group(1)
            if not FALSOS.match(k) and any(c.isdigit() for c in k):
                chaves.append(k)
    mu = PADRAO_URL.search(texto)
    return chaves, (mu.group(0) if mu else None)


def _pontuar(texto: str, chave: str) -> int:
    """Chave que aparece perto de 'airlines/search' vale mais."""
    melhor = 0
    for m in re.finditer(re.escape(chave), texto):
        i = m.start()
        janela = texto[max(0, i - 3000): i + 3000].lower()
        pontos = sum(3 for p in PISTAS if p in janela)
        if "x-api-key" in janela:
            pontos += 4
        melhor = max(melhor, pontos)
    return melhor


def discover(timeout: int = 20, max_bundles: int = MAX_BUNDLES) -> dict:
    """Acha a x-api-key atual. Levanta DiscoveryError com diagnostico se falhar."""
    sess = requests.Session()
    sess.headers.update(page_headers())

    diag = []
    candidatos: dict[str, int] = {}
    url_busca = None
    origem = None

    for pagina in PAGINAS:
        try:
            html = _baixar(sess, pagina, timeout)
        except requests.RequestException as exc:
            diag.append(f"{pagina}: {type(exc).__name__}")
            continue

        ks, u = _extrair(html)          # as vezes esta inline na propria pagina
        for k in ks:
            candidatos[k] = max(candidatos.get(k, 0), _pontuar(html, k) + 1)
            origem = origem or pagina
        url_busca = url_busca or u

        scripts = _scripts(html, pagina)
        diag.append(f"{pagina}: {len(scripts)} bundles JS")
        for js in scripts[:max_bundles]:
            try:
                corpo = _baixar(sess, js, timeout)
            except requests.RequestException:
                continue
            ks, u = _extrair(corpo)
            url_busca = url_busca or u
            for k in ks:
                pontos = _pontuar(corpo, k) + (5 if u else 0)
                if pontos >= candidatos.get(k, -1):
                    candidatos[k] = pontos
                    origem = js
        if candidatos:
            break

    if not candidatos:
        raise DiscoveryError(
            "Nao encontrei a x-api-key no JavaScript publico do SMILES. "
            "O site pode ter mudado o formato. Diagnostico: " + " | ".join(diag)
            + ". Alternativa: capture manualmente (DevTools > Network > filtro "
            "'search' > header x-api-key) e defina SMILES_API_KEY.")

    chave = max(candidatos.items(), key=lambda kv: (kv[1], len(kv[0])))[0]
    return {"api_key": chave, "search_url": url_busca, "source": origem,
            "candidates": len(candidatos), "diag": diag}


# ---------------------------------------------------------------------------
# Resolucao da chave em uso, com cache. Ordem de preferencia:
#   1) chave explicita (config.json capturado, ou variavel de ambiente)
#   2) cache em memoria ainda valido
#   3) descoberta automatica no JS publico
# ---------------------------------------------------------------------------

KEY_TTL = 6 * 3600        # quanto tempo confiar numa chave achada
KEY_FAIL_TTL = 300        # espera antes de tentar de novo apos falhar
_KEY_CACHE = {"key": None, "url": None, "ts": 0.0, "source": None,
          "error": None, "fail_ts": 0.0}


def get_key(preferida: str | None = None, force: bool = False,
            timeout: int = 20) -> dict:
    """Devolve {key, url, source, error}. Nunca levanta: erro vem no dict.

    `force=True` ignora o cache — use quando o SMILES responder 401/403,
    que e o sinal de que a chave rotacionou.
    """
    import time as _t

    if preferida and preferida.strip() and preferida.strip().lower() != "demo":
        return {"key": preferida.strip(), "url": None, "source": "manual", "error": None}

    if not force and _KEY_CACHE["key"] and (_t.time() - _KEY_CACHE["ts"]) < KEY_TTL:
        return {"key": _KEY_CACHE["key"], "url": _KEY_CACHE["url"],
                "source": "auto (cache)", "error": None}

    # Falhou ha pouco: nao refaz a varredura a cada requisicao (lento e insistente
    # com o servidor da Gol). Repete o mesmo diagnostico ate o KEY_FAIL_TTL passar.
    if not force and _KEY_CACHE["error"] and (_t.time() - _KEY_CACHE["fail_ts"]) < KEY_FAIL_TTL:
        return {"key": None, "url": None, "source": None, "error": _KEY_CACHE["error"]}

    try:
        achado = discover(timeout=timeout)
    except DiscoveryError as exc:
        _KEY_CACHE.update({"error": str(exc), "fail_ts": _t.time()})
        return {"key": None, "url": None, "source": None, "error": str(exc)}
    except Exception as exc:                      # rede instavel, etc.
        msg = f"Falha inesperada na descoberta: {type(exc).__name__}: {exc}"
        _KEY_CACHE.update({"error": msg, "fail_ts": _t.time()})
        return {"key": None, "url": None, "source": None, "error": msg}

    _KEY_CACHE.update({"key": achado["api_key"], "url": achado["search_url"],
                   "ts": _t.time(), "source": achado["source"],
                   "error": None, "fail_ts": 0.0})
    return {"key": achado["api_key"], "url": achado["search_url"],
            "source": "auto", "error": None}


def invalidate() -> None:
    """Esquece a chave em cache (chamado quando o SMILES devolve 401/403)."""
    _KEY_CACHE.update({"key": None, "url": None, "ts": 0.0})
