"""Base de aeroportos + busca por cidade, com codigos de metropole.

Digitar "Rio" resolve para RIO (GIG + SDU); "Sao Paulo" para SAO (GRU/CGH/VCP);
"Nova York" para NYC (JFK/EWR/LGA), etc. Busca e sem acento e case-insensitive.

Cobertura: Brasil (ampla) + principais destinos internacionais do SMILES/Gol.
Nao pretende ser exaustiva — e uma ferramenta pessoal; adicione o que faltar.
"""

from __future__ import annotations

import unicodedata
from dataclasses import dataclass

# iata, cidade, nome do aeroporto, pais (ISO2), codigo de metropole (ou "")
_RAW: list[tuple[str, str, str, str, str]] = [
    # ---- Brasil ----
    ("GIG", "Rio de Janeiro", "Galeao / Antonio Carlos Jobim", "BR", "RIO"),
    ("SDU", "Rio de Janeiro", "Santos Dumont", "BR", "RIO"),
    ("GRU", "Sao Paulo", "Guarulhos", "BR", "SAO"),
    ("CGH", "Sao Paulo", "Congonhas", "BR", "SAO"),
    ("VCP", "Campinas", "Viracopos", "BR", "SAO"),
    ("BSB", "Brasilia", "Presidente Juscelino Kubitschek", "BR", ""),
    ("CNF", "Belo Horizonte", "Confins / Tancredo Neves", "BR", "BHZ"),
    ("PLU", "Belo Horizonte", "Pampulha", "BR", "BHZ"),
    ("SSA", "Salvador", "Deputado Luis Eduardo Magalhaes", "BR", ""),
    ("REC", "Recife", "Guararapes / Gilberto Freyre", "BR", ""),
    ("FOR", "Fortaleza", "Pinto Martins", "BR", ""),
    ("POA", "Porto Alegre", "Salgado Filho", "BR", ""),
    ("CWB", "Curitiba", "Afonso Pena", "BR", ""),
    ("FLN", "Florianopolis", "Hercilio Luz", "BR", ""),
    ("VIX", "Vitoria", "Eurico de Aguiar Salles", "BR", ""),
    ("NAT", "Natal", "Sao Goncalo do Amarante", "BR", ""),
    ("MCZ", "Maceio", "Zumbi dos Palmares", "BR", ""),
    ("JPA", "Joao Pessoa", "Castro Pinto", "BR", ""),
    ("AJU", "Aracaju", "Santa Maria", "BR", ""),
    ("BEL", "Belem", "Val de Cans", "BR", ""),
    ("MAO", "Manaus", "Eduardo Gomes", "BR", ""),
    ("SLZ", "Sao Luis", "Marechal Cunha Machado", "BR", ""),
    ("THE", "Teresina", "Senador Petronio Portella", "BR", ""),
    ("CGB", "Cuiaba", "Marechal Rondon", "BR", ""),
    ("CGR", "Campo Grande", "Campo Grande", "BR", ""),
    ("GYN", "Goiania", "Santa Genoveva", "BR", ""),
    ("PMW", "Palmas", "Palmas", "BR", ""),
    ("PVH", "Porto Velho", "Governador Jorge Teixeira", "BR", ""),
    ("RBR", "Rio Branco", "Placido de Castro", "BR", ""),
    ("BVB", "Boa Vista", "Atlas Brasil Cantanhede", "BR", ""),
    ("MCP", "Macapa", "Alberto Alcolumbre", "BR", ""),
    ("IGU", "Foz do Iguacu", "Cataratas", "BR", ""),
    ("NVT", "Navegantes", "Ministro Victor Konder", "BR", ""),
    ("JOI", "Joinville", "Lauro Carneiro de Loyola", "BR", ""),
    ("LDB", "Londrina", "Governador Jose Richa", "BR", ""),
    ("MGF", "Maringa", "Silvio Name Junior", "BR", ""),
    ("UDI", "Uberlandia", "Ten. Cel. Av. Cesar Bombonato", "BR", ""),
    ("RAO", "Ribeirao Preto", "Leite Lopes", "BR", ""),
    ("SJP", "Sao Jose do Rio Preto", "Prof. Eribelto Manoel Reino", "BR", ""),
    ("PPB", "Presidente Prudente", "A. de Oliveira Cesar", "BR", ""),
    ("CXJ", "Caxias do Sul", "Hugo Cantergiani", "BR", ""),
    ("PET", "Pelotas", "Joao Simoes Lopes Neto", "BR", ""),
    ("IOS", "Ilheus", "Jorge Amado", "BR", ""),
    ("BPS", "Porto Seguro", "Porto Seguro", "BR", ""),
    ("JJD", "Jericoacoara", "Jericoacoara", "BR", ""),
    ("FEN", "Fernando de Noronha", "Fernando de Noronha", "BR", ""),
    ("PNZ", "Petrolina", "Senador Nilo Coelho", "BR", ""),
    ("IMP", "Imperatriz", "Prefeito Renato Moreira", "BR", ""),
    ("STM", "Santarem", "Maestro Wilson Fonseca", "BR", ""),
    ("AFL", "Alta Floresta", "Alta Floresta", "BR", ""),
    ("DOU", "Dourados", "Francisco de Matos Pereira", "BR", ""),
    ("MAB", "Maraba", "Joao Correa da Rocha", "BR", ""),
    ("CZS", "Cruzeiro do Sul", "Cruzeiro do Sul", "BR", ""),
    ("JDO", "Juazeiro do Norte", "Orlando Bezerra de Menezes", "BR", ""),
    ("MOC", "Montes Claros", "Mario Ribeiro", "BR", ""),
    ("CPV", "Campina Grande", "Joao Suassuna", "BR", ""),

    # ---- America do Sul ----
    ("EZE", "Buenos Aires", "Ezeiza", "AR", "BUE"),
    ("AEP", "Buenos Aires", "Aeroparque Jorge Newbery", "AR", "BUE"),
    ("COR", "Cordoba", "Ingeniero Ambrosio Taravella", "AR", ""),
    ("MDZ", "Mendoza", "El Plumerillo", "AR", ""),
    ("BRC", "Bariloche", "San Carlos de Bariloche", "AR", ""),
    ("SCL", "Santiago", "Arturo Merino Benitez", "CL", ""),
    ("MVD", "Montevideu", "Carrasco", "UY", ""),
    ("PDP", "Punta del Este", "Capitan Corbeta CA Curbelo", "UY", ""),
    ("ASU", "Assuncao", "Silvio Pettirossi", "PY", ""),
    ("LIM", "Lima", "Jorge Chavez", "PE", ""),
    ("CUZ", "Cusco", "Alejandro Velasco Astete", "PE", ""),
    ("BOG", "Bogota", "El Dorado", "CO", ""),
    ("CTG", "Cartagena", "Rafael Nunez", "CO", ""),
    ("UIO", "Quito", "Mariscal Sucre", "EC", ""),
    ("GYE", "Guayaquil", "Jose Joaquin de Olmedo", "EC", ""),
    ("CCS", "Caracas", "Simon Bolivar / Maiquetia", "VE", ""),
    ("LPB", "La Paz", "El Alto", "BO", ""),
    ("VVI", "Santa Cruz de la Sierra", "Viru Viru", "BO", ""),

    # ---- America do Norte / Central / Caribe ----
    ("JFK", "Nova York", "John F. Kennedy", "US", "NYC"),
    ("EWR", "Nova York", "Newark Liberty", "US", "NYC"),
    ("LGA", "Nova York", "LaGuardia", "US", "NYC"),
    ("MIA", "Miami", "Miami International", "US", ""),
    ("FLL", "Fort Lauderdale", "Hollywood International", "US", ""),
    ("MCO", "Orlando", "Orlando International", "US", ""),
    ("IAD", "Washington", "Dulles", "US", "WAS"),
    ("DCA", "Washington", "Ronald Reagan National", "US", "WAS"),
    ("LAX", "Los Angeles", "Los Angeles International", "US", ""),
    ("SFO", "Sao Francisco", "San Francisco International", "US", ""),
    ("ORD", "Chicago", "O'Hare", "US", "CHI"),
    ("MDW", "Chicago", "Midway", "US", "CHI"),
    ("BOS", "Boston", "Logan", "US", ""),
    ("ATL", "Atlanta", "Hartsfield-Jackson", "US", ""),
    ("DFW", "Dallas", "Dallas/Fort Worth", "US", ""),
    ("IAH", "Houston", "George Bush Intercontinental", "US", ""),
    ("LAS", "Las Vegas", "Harry Reid", "US", ""),
    ("SEA", "Seattle", "Tacoma", "US", ""),
    ("YYZ", "Toronto", "Pearson", "CA", ""),
    ("YUL", "Montreal", "Trudeau", "CA", ""),
    ("MEX", "Cidade do Mexico", "Benito Juarez", "MX", ""),
    ("CUN", "Cancun", "Cancun International", "MX", ""),
    ("PTY", "Cidade do Panama", "Tocumen", "PA", ""),
    ("SJO", "San Jose", "Juan Santamaria", "CR", ""),
    ("HAV", "Havana", "Jose Marti", "CU", ""),
    ("PUJ", "Punta Cana", "Punta Cana", "DO", ""),
    ("SDQ", "Santo Domingo", "Las Americas", "DO", ""),
    ("AUA", "Aruba", "Reina Beatrix", "AW", ""),

    # ---- Europa ----
    ("LIS", "Lisboa", "Humberto Delgado", "PT", ""),
    ("OPO", "Porto", "Francisco Sa Carneiro", "PT", ""),
    ("MAD", "Madri", "Barajas", "ES", ""),
    ("BCN", "Barcelona", "El Prat", "ES", ""),
    ("LHR", "Londres", "Heathrow", "GB", "LON"),
    ("LGW", "Londres", "Gatwick", "GB", "LON"),
    ("CDG", "Paris", "Charles de Gaulle", "FR", "PAR"),
    ("ORY", "Paris", "Orly", "FR", "PAR"),
    ("FCO", "Roma", "Fiumicino", "IT", ""),
    ("MXP", "Milao", "Malpensa", "IT", "MIL"),
    ("FRA", "Frankfurt", "Frankfurt am Main", "DE", ""),
    ("MUC", "Munique", "Franz Josef Strauss", "DE", ""),
    ("AMS", "Amsterda", "Schiphol", "NL", ""),
    ("ZRH", "Zurique", "Zurique", "CH", ""),
    ("BRU", "Bruxelas", "Zaventem", "BE", ""),
    ("VIE", "Viena", "Schwechat", "AT", ""),
    ("IST", "Istambul", "Istanbul Airport", "TR", ""),
    ("DUB", "Dublin", "Dublin", "IE", ""),

    # ---- Oriente Medio / Africa / Asia / Oceania ----
    ("DXB", "Dubai", "Dubai International", "AE", ""),
    ("DOH", "Doha", "Hamad", "QA", ""),
    ("ADD", "Adis Abeba", "Bole", "ET", ""),
    ("JNB", "Joanesburgo", "OR Tambo", "ZA", ""),
    ("CPT", "Cidade do Cabo", "Cape Town", "ZA", ""),
    ("NRT", "Toquio", "Narita", "JP", "TYO"),
    ("HND", "Toquio", "Haneda", "JP", "TYO"),
    ("SYD", "Sidney", "Kingsford Smith", "AU", ""),
]


@dataclass
class Airport:
    iata: str
    city: str
    name: str
    country: str
    metro: str


AIRPORTS: list[Airport] = [Airport(*row) for row in _RAW]
BY_IATA: dict[str, Airport] = {a.iata: a for a in AIRPORTS}

# Metropoles derivadas (codigo -> lista de aeroportos)
METROS: dict[str, list[Airport]] = {}
for _a in AIRPORTS:
    if _a.metro:
        METROS.setdefault(_a.metro, []).append(_a)


def _norm(s: str) -> str:
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    return s.lower().strip()


def suggest(query: str, limit: int = 12) -> list[dict]:
    """Autocomplete. Retorna metropoles e aeroportos que casam com a query.

    Cada item: {code, kind, label, city, country, airports:[iata...]}.
    `code` e o que se manda para a busca (metropole OU iata especifico).
    """
    q = _norm(query)
    if not q:
        return []
    results: list[tuple[int, dict]] = []
    seen_metro: set[str] = set()

    # 1) Metropoles (agrupam varios aeroportos) — prioridade alta.
    for code, aps in METROS.items():
        city = aps[0].city
        country = aps[0].country
        hay = _norm(f"{city} {code} " + " ".join(a.iata for a in aps))
        if q in hay or _norm(code) == q:
            score = 0 if _norm(city).startswith(q) or _norm(code) == q else 1
            if code not in seen_metro:
                seen_metro.add(code)
                results.append((
                    score,
                    {
                        "code": code,
                        "kind": "metro",
                        "label": f"{city} — todos ({code}: {', '.join(a.iata for a in aps)})",
                        "city": city,
                        "country": country,
                        "airports": [a.iata for a in aps],
                    },
                ))

    # 2) Aeroportos individuais.
    for a in AIRPORTS:
        hay = _norm(f"{a.city} {a.iata} {a.name} {a.country}")
        if q in hay:
            starts = _norm(a.city).startswith(q) or _norm(a.iata) == q
            score = 2 if starts else 3
            # iata exato vem antes de tudo
            if _norm(a.iata) == q:
                score = -1
            results.append((
                score,
                {
                    "code": a.iata,
                    "kind": "airport",
                    "label": f"{a.city} — {a.iata} ({a.name}), {a.country}",
                    "city": a.city,
                    "country": a.country,
                    "airports": [a.iata],
                },
            ))

    results.sort(key=lambda t: (t[0], t[1]["label"]))
    # dedup por code preservando ordem
    out: list[dict] = []
    seen_codes: set[str] = set()
    for _, item in results:
        if item["code"] in seen_codes:
            continue
        seen_codes.add(item["code"])
        out.append(item)
        if len(out) >= limit:
            break
    return out


def resolve(code: str) -> dict | None:
    """Dado um codigo (metropole ou iata), devolve rotulo + aeroportos."""
    code = code.upper().strip()
    if code in METROS:
        aps = METROS[code]
        return {
            "code": code,
            "kind": "metro",
            "city": aps[0].city,
            "country": aps[0].country,
            "airports": [a.iata for a in aps],
        }
    if code in BY_IATA:
        a = BY_IATA[code]
        return {
            "code": a.iata,
            "kind": "airport",
            "city": a.city,
            "country": a.country,
            "airports": [a.iata],
        }
    return None
