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
# Sem chave real -> modo demo, para o site funcionar assim que sobe.
DEMO = os.environ.get("SMILES_DEMO") == "1" or API_KEY.lower() == "demo" or not API_KEY

BROWSER_UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
              "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36")

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


def date_to_epoch_ms(date_str: str) -> int:
    d = datetime.strptime(date_str, "%Y-%m-%d").replace(tzinfo=timezone.utc)
    return int(d.timestamp() * 1000) + 3 * 3600 * 1000


def live_search(origin, dest, departure_date, return_date, adults, children, infants, cabin):
    if not API_KEY:
        raise SmilesError("Sem SMILES_API_KEY configurada nas variáveis de ambiente.")
    params = {
        "originAirportCode": origin, "destinationAirportCode": dest,
        "departureDate": date_to_epoch_ms(departure_date),
        "adults": adults, "children": children, "infants": infants,
        "cabinType": cabin, "tripType": "1" if return_date else "2",
    }
    if return_date:
        params["returnDate"] = date_to_epoch_ms(return_date)
    headers = {
        "x-api-key": API_KEY, "Accept": "application/json, text/plain, */*",
        "Origin": "https://www.smiles.com.br", "Referer": "https://www.smiles.com.br/",
        "User-Agent": BROWSER_UA,
    }
    _throttle()
    try:
        r = requests.get(SEARCH_URL, params=params, headers=headers, timeout=25)
    except requests.RequestException as exc:
        raise SmilesError(f"Falha de rede: {exc}") from exc
    if r.status_code in (401, 403):
        raise SmilesError(f"HTTP {r.status_code}: a x-api-key expirou ou rotacionou. "
                          "Capture a chave nova e atualize SMILES_API_KEY no Vercel.")
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
    return None


def _raw_search(p):
    key = "|".join(f"{k}={p[k]}" for k in sorted(p)) + f"|demo={int(DEMO)}"
    hit = cache_get(key)
    if hit is not None:
        return hit, True
    if DEMO:
        raw = demo_search(p["origin"], p["dest"], p["out"], cabin=p["cabin"])
    else:
        raw = live_search(p["origin"], p["dest"], p["out"], p["ret"],
                          p["adults"], p["children"], p["infants"], p["cabin"])
    cache_put(key, raw)
    return raw, False


def _summary(voos):
    best = best_direct = None
    for v in voos:
        m = v.menor_milhas
        if m >= 10 ** 12:
            continue
        if best is None or m < best:
            best = m
        if v.paradas == 0 and (best_direct is None or m < best_direct):
            best_direct = m
    return {"cheapest": best, "cheapest_direct": best_direct,
            "directs": sum(1 for v in voos if v.paradas == 0), "total": len(voos)}


def _sort(voos, mode):
    if mode == "miles":
        voos.sort(key=lambda v: v.menor_milhas)
    elif mode == "duration":
        voos.sort(key=lambda v: (v.duracao_min if v.duracao_min is not None else 10 ** 9))
    elif mode == "departure":
        voos.sort(key=lambda v: v.partida)
    else:
        voos.sort(key=lambda v: (0 if v.paradas == 0 else 1, v.menor_milhas))
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
        return jsonify({"configured": True, "demo": DEMO,
                        "locked": bool(ACCESS_CODE), "endpoint": None if DEMO else SEARCH_URL})

    if action == "airports":
        return jsonify(suggest(request.args.get("q", "")))

    if action == "capture":
        return jsonify({"ok": False, "error":
                        "A captura automática não roda no Vercel (não há navegador). "
                        "Capture a chave no seu computador e defina SMILES_API_KEY "
                        "nas Environment Variables do projeto."}), 400

    if action in ("search", "day"):
        if not _authorized():
            return jsonify({"ok": False, "error": "Código de acesso inválido."}), 401
        p = _params(body)
        if action == "day":
            p["ret"] = None
        err = _validate(p)
        if err:
            return jsonify({"ok": False, "error": err}), 400
        try:
            raw, cached = _raw_search(p)
        except SmilesError as exc:
            return jsonify({"ok": False, "error": str(exc)}), 502

        if action == "day":
            return jsonify({"ok": True, "date": p["out"], "cached": cached,
                            "demo": DEMO, **_summary(parse_flights(raw))})

        voos = _sort(parse_flights(raw), body.get("sort") or "smart")
        if body.get("direct_only"):
            voos = [v for v in voos if v.paradas == 0]
        out = [dict(asdict(v), duracao_str=v.duracao_str(), direto=v.paradas == 0,
                    melhor=(v.menor_milhas if v.menor_milhas < 10 ** 12 else None))
               for v in voos]
        return jsonify({"ok": True, "flights": out,
                        "summary": _summary(parse_flights(raw)),
                        "cached": cached, "demo": DEMO, "smiles_url": _smiles_url(p)})

    return jsonify({"ok": False, "error": f"Ação desconhecida: {action!r}"}), 404
