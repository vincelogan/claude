# ---------------------------------------------------------------------------
# Parte especifica do Vercel (serverless). Anexada pelo build.py depois dos
# modulos airports/parser/demo, que ja definem: suggest, resolve, parse_flights,
# demo_search.
# ---------------------------------------------------------------------------

# ---- configuracao por variavel de ambiente ----
API_KEY = os.environ.get("SMILES_API_KEY", "").strip()
SEARCH_URL = os.environ.get(
    "SMILES_SEARCH_URL",
    "https://api-air-flightsearch-prd.smiles.com.br/v1/airlines/search",
)
ACCESS_CODE = os.environ.get("ACCESS_CODE", "").strip()
# Demo so quando pedido explicitamente. Sem chave manual, o sistema tenta
# descobri-la sozinho no JS publico do SMILES (ver get_key acima).
FORCE_DEMO = os.environ.get("SMILES_DEMO") == "1" or API_KEY.lower() == "demo"


def _chave(force=False):
    """Chave em uso: SMILES_API_KEY se definida, senao descoberta automatica."""
    return get_key(preferida=API_KEY, force=force)


def _modo():
    """(demo?, info da chave) - demo se pedido, ou se a descoberta falhou."""
    if FORCE_DEMO:
        return True, {"key": None, "source": None, "error": None}
    r = _chave()
    return (r["key"] is None), r

# ---- cache em memoria (serverless: vive enquanto a instancia estiver quente) ----
CACHE_TTL = 6 * 3600
_CACHE: dict = {}
_lock = threading.Lock()
_last_call = 0.0


def cache_get(k):
    v = _CACHE.get(k)
    if not v:
        return None
    ts, data = v
    if time.time() - ts > CACHE_TTL:
        _CACHE.pop(k, None)
        return None
    return data


def cache_put(k, data):
    if len(_CACHE) > 400:
        _CACHE.clear()
    _CACHE[k] = (time.time(), data)


def _throttle():
    """Ritmo minimo entre chamadas reais (por instancia; o cliente ja serializa)."""
    global _last_call
    with _lock:
        wait = 1.2 - (time.monotonic() - _last_call)
        if wait > 0:
            time.sleep(wait)
        _last_call = time.monotonic()


class SmilesError(RuntimeError):
    pass


# ---- memoria do bloqueio anti-bot ----------------------------------------
# O SMILES recusa (406) as requisicoes vindas do IP deste servidor. Sem
# lembrar disso, a varredura do calendario dispararia 30 requisicoes que ja
# sabemos que serao recusadas — lento para o usuario e insistente com o
# servidor da Gol sem nenhuma chance de dar certo.
ANTIBOT_TTL = 1800          # meia hora ate testar de novo (o IP pode mudar)
_ANTIBOT = {"ts": 0.0, "ip": None}


def _antibot_ativo() -> bool:
    return bool(_ANTIBOT["ts"]) and (time.time() - _ANTIBOT["ts"]) < ANTIBOT_TTL


def _erro_antibot() -> SmilesError:
    ip = _ANTIBOT["ip"]
    return SmilesError(
        "Esta versao hospedada nao consegue buscar no SMILES: a protecao "
        "anti-bot do site recusa o IP deste servidor"
        + (f" ({ip})" if ip else "")
        + ". Nao e chave nem header — o mesmo codigo com os headers completos "
        "do Chrome leva 406 daqui. Nao ha conserto do lado do servidor sem "
        "disfarcar a requisicao, o que este projeto nao faz. Rode a versao "
        "local (python server.py): la existe o modo navegador, que faz a "
        "busca dentro do Chromium, na propria pagina do SMILES."
    )


def _marcar_antibot(corpo: str) -> None:
    ip = None
    m = re.search(r'"clientIP"\s*:\s*"([^"]+)"', corpo or "")
    if m:
        ip = m.group(1)
    _ANTIBOT.update({"ts": time.time(), "ip": ip})


def date_to_epoch_ms(date_str: str) -> int:
    d = datetime.strptime(date_str, "%Y-%m-%d").replace(tzinfo=timezone.utc)
    # Meio-dia de Brasilia (15h UTC): e o que a URL real do SMILES usa e da
    # 12h de folga de cada lado da virada do dia, imune a fuso.
    return int(d.timestamp() * 1000) + 15 * 3600 * 1000


def live_search(origin, dest, departure_date, return_date, adults, children,
                infants, cabin, _retry=True):
    # Antes de qualquer coisa: se o IP ja foi recusado, nem a descoberta da
    # chave vale a pena — ela tambem bate no smiles.com.br e tambem seria
    # recusada. Falhar aqui poupa duas idas a rede por busca.
    if _antibot_ativo():
        raise _erro_antibot()
    info = _chave()
    if not info["key"]:
        raise SmilesError(info["error"] or "Nao foi possivel obter a x-api-key.")
    chave = info["key"]
    url = info["url"] or SEARCH_URL
    params = {
        "originAirportCode": origin, "destinationAirportCode": dest,
        "departureDate": date_to_epoch_ms(departure_date),
        "adults": adults, "children": children, "infants": infants,
        "cabinType": cabin, "tripType": "1" if return_date else "2",
    }
    if return_date:
        params["returnDate"] = date_to_epoch_ms(return_date)
    headers = browser_headers(**{"x-api-key": chave})
    _throttle()
    try:
        r = requests.get(url, params=params, headers=headers, timeout=25)
    except requests.RequestException as exc:
        raise SmilesError(f"Falha de rede: {exc}") from exc
    if r.status_code in (401, 403):
        # A Gol rotacionou a chave: descobre a nova e tenta mais uma vez.
        if _retry:
            invalidate()
            return live_search(origin, dest, departure_date, return_date, adults,
                               children, infants, cabin, _retry=False)
        raise SmilesError(f"HTTP {r.status_code}: a x-api-key foi recusada e a "
                          "redescoberta automatica nao resolveu.")
    if r.status_code == 406:
        # O corpo do Akamai traz o clientIP — o IP deste servidor, que e o que
        # esta sendo recusado. Guardamos para nao repetir a requisicao inutil.
        _marcar_antibot(r.text)
        raise _erro_antibot()
    if r.status_code == 429:
        raise SmilesError("HTTP 429: muitas buscas. Aguarde um pouco.")
    if r.status_code >= 400:
        raise SmilesError(f"HTTP {r.status_code}: {r.text[:200]}")
    try:
        return r.json()
    except ValueError as exc:
        raise SmilesError("Resposta não-JSON do SMILES.") from exc


# ---- helpers de busca ----
def _params(body):
    return {
        "origin": (body.get("origin") or "").upper().strip(),
        "dest": (body.get("dest") or "").upper().strip(),
        "out": body.get("out") or "",
        "ret": body.get("ret") or None,
        "adults": int(body.get("adults") or 1),
        "children": int(body.get("children") or 0),
        "infants": int(body.get("infants") or 0),
        "cabin": (body.get("cabin") or "ALL").upper(),
    }


def _validate(p):
    if not p["origin"] or not p["dest"] or not p["out"]:
        return "Informe origem, destino e data de ida."
    if resolve(p["origin"]) is None or resolve(p["dest"]) is None:
        return "Origem/destino desconhecidos. Use o autocomplete."
    if p["origin"] == p["dest"]:
        return "Origem e destino são iguais."
    if p["ret"] and p["ret"] < p["out"]:
        return "A volta não pode ser antes da ida."
    return None


def _raw_search(p, demo):
    key = "|".join(f"{k}={p[k]}" for k in sorted(p)) + f"|demo={int(demo)}"
    hit = cache_get(key)
    if hit is not None:
        return hit, True
    if demo:
        raw = demo_search(p["origin"], p["dest"], p["out"], cabin=p["cabin"],
                          return_date=p["ret"])
    else:
        raw = live_search(p["origin"], p["dest"], p["out"], p["ret"],
                          p["adults"], p["children"], p["infants"], p["cabin"])
    cache_put(key, raw)
    return raw, False


def _voo_json(v, clube):
    """Serializa um voo SEM esconder a diferenca entre tarifa padrao e Clube."""
    return {
        "origem": v.origem, "destino": v.destino,
        "partida": v.partida, "chegada": v.chegada,
        "companhia": v.companhia, "numero": v.numero,
        "paradas": v.paradas, "direto": v.paradas == 0,
        "duracao_min": v.duracao_min, "duracao_str": v.duracao_str(),
        "cabine": v.cabine, "trecho": v.trecho,
        "milhas_padrao": v.milhas_padrao,
        "milhas_clube": v.milhas_clube,
        "preco": v.preco(clube),
        "taxas": v.taxas,
        "fares": [{"tipo": f.tipo, "rotulo": f.rotulo(), "milhas": f.milhas,
                   "dinheiro": f.dinheiro, "assentos": f.assentos,
                   "clube": f.clube, "com_dinheiro": f.com_dinheiro}
                  for f in v.fares],
    }


def _sort(voos, mode, clube):
    """Ordena DENTRO de cada trecho; a ordem dos trechos (ida, volta) e mantida."""
    if mode == "miles":
        key = lambda v: (v.trecho, v.ordem(clube))
    elif mode == "duration":
        key = lambda v: (v.trecho, v.duracao_min if v.duracao_min is not None else 10**9)
    elif mode == "departure":
        key = lambda v: (v.trecho, v.partida)
    else:
        key = lambda v: (v.trecho, 0 if v.paradas == 0 else 1, v.ordem(clube))
    voos.sort(key=key)
    return voos


def _smiles_url(p):
    o, d = resolve(p["origin"]), resolve(p["dest"])
    q = {
        "adults": p["adults"], "children": p["children"], "infants": p["infants"],
        "cabin": p["cabin"], "departureDate": date_to_epoch_ms(p["out"]),
        "isElegible": "false", "isFlexibleDateChecked": "false",
        "searchType": "g3", "segments": "1",
        "tripType": "1" if p["ret"] else "2",
        "originAirport": p["origin"], "originCity": "", "originCountry": "",
        "originAirportIsAny": "true" if o and o["kind"] == "metro" else "false",
        "destinationAirport": p["dest"], "destinCity": "", "destinCountry": "",
        "destinAirportIsAny": "true" if d and d["kind"] == "metro" else "false",
        "novo-resultado-voos": "true",
    }
    if p["ret"]:
        q["returnDate"] = date_to_epoch_ms(p["ret"])
    return "https://www.smiles.com.br/mfe/emissao-passagem/?" + urlencode(q)


# ---- app ----
app = Flask(__name__)

# Normalmente o Vercel serve o index.html estatico na raiz. Mas se o preset
# rotear "/" para esta function, servimos a pagina daqui — sem redirect, para
# nao arriscar loop.
_HTML_PATHS = [
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "index.html"),
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "index.html"),
    "/var/task/index.html",
    "index.html",
]


def _serve_page():
    for path in _HTML_PATHS:
        try:
            with open(path, encoding="utf-8") as fh:
                return Response(fh.read(), mimetype="text/html; charset=utf-8")
        except OSError:
            continue
    return Response(
        "<!doctype html><meta charset=utf-8><title>Radar SMILES</title>"
        "<p style='font:15px system-ui;padding:2rem'>index.html nao encontrado no bundle. "
        "Abra <a href='/index.html'>/index.html</a>.</p>",
        mimetype="text/html; charset=utf-8",
    )


def _authorized():
    if not ACCESS_CODE:
        return True
    given = request.headers.get("X-Access-Code", "")
    return hmac.compare_digest(given, ACCESS_CODE)


@app.route("/", defaults={"_p": ""}, methods=["GET", "POST"])
@app.route("/<path:_p>", methods=["GET", "POST"])
def handler(_p):
    """Despacha por ?action= (o rewrite do Vercel manda tudo para esta função)."""
    body = request.get_json(silent=True) or {}
    action = request.args.get("action") or body.get("action") or ""

    if not action:
        return _serve_page()

    if action == "status":
        demo, info = _modo()
        return jsonify({"configured": True, "demo": demo,
                        "locked": bool(ACCESS_CODE),
                        "key_source": info.get("source"),
                        "key_error": info.get("error"),
                        "hospedado": True,
                        "antibot": _antibot_ativo(),
                        "antibot_ip": _ANTIBOT["ip"],
                        "endpoint": None if demo else (info.get("url") or SEARCH_URL)})

    if action == "airports":
        return jsonify(suggest(request.args.get("q", "")))

    if action == "capture":
        return jsonify({"ok": False, "error":
                        "A captura automática não roda no Vercel (não há navegador). "
                        "Capture a chave no seu computador e defina SMILES_API_KEY "
                        "nas Environment Variables do projeto."}), 400

    if action in ("search", "day"):
        if not _authorized():
            return jsonify({"ok": False, "error": "Codigo de acesso invalido."}), 401
        p = _params(body)
        if action == "day":
            p["ret"] = None
        err = _validate(p)
        if err:
            return jsonify({"ok": False, "error": err}), 400
        demo, _info = _modo()
        try:
            raw, cached = _raw_search(p, demo)
        except SmilesError as exc:
            return jsonify({"ok": False, "error": str(exc)}), 502

        clube = bool(body.get("clube"))
        voos = parse_flights(raw)
        r = resumo(voos, clube)

        if action == "day":
            leg = r["legs"][0] if r["legs"] else {"cheapest": None, "cheapest_direct": None,
                                                  "directs": 0, "total": 0}
            return jsonify({"ok": True, "date": p["out"], "cached": cached, "demo": demo,
                            "cheapest": leg["cheapest"],
                            "cheapest_direct": leg["cheapest_direct"],
                            "directs": leg["directs"], "total": leg["total"]})

        _sort(voos, body.get("sort") or "smart", clube)
        if body.get("direct_only"):
            voos = [v for v in voos if v.paradas == 0]
        return jsonify({"ok": True,
                        "flights": [_voo_json(v, clube) for v in voos],
                        "summary": r, "cached": cached, "demo": demo,
                        "smiles_url": _smiles_url(p)})

    return jsonify({"ok": False, "error": f"Acao desconhecida: {action!r}"}), 404
