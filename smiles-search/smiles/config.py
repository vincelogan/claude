"""Carrega e salva a configuracao (host/path/x-api-key) capturada do SMILES."""

from __future__ import annotations

import json
import os
from dataclasses import dataclass, asdict
from pathlib import Path

CONFIG_PATH = Path(__file__).resolve().parent.parent / "config.json"

DEFAULT_SEARCH_HOST = "https://api-air-flightsearch-prd.smiles.com.br"
DEFAULT_SEARCH_PATH = "/v1/airlines/search"


@dataclass
class SmilesConfig:
    """O minimo necessario para replicar a chamada airlines/search."""

    api_key: str = ""
    search_url: str = f"{DEFAULT_SEARCH_HOST}{DEFAULT_SEARCH_PATH}"
    # Parametros "fixos" observados na captura (ex.: region, forceCongener).
    # Sao mesclados em toda busca; origem/destino/datas sobrescrevem por cima.
    base_params: dict | None = None
    # Headers extras observados alem de x-api-key (ex.: region, channel).
    extra_headers: dict | None = None

    def __post_init__(self) -> None:
        if self.base_params is None:
            self.base_params = {}
        if self.extra_headers is None:
            self.extra_headers = {}

    @property
    def is_usable(self) -> bool:
        return bool(self.api_key) and bool(self.search_url)


def load_config(path: Path = CONFIG_PATH) -> SmilesConfig:
    if path.exists():
        data = json.loads(path.read_text(encoding="utf-8"))
        return SmilesConfig(
            api_key=data.get("api_key", ""),
            search_url=data.get("search_url", f"{DEFAULT_SEARCH_HOST}{DEFAULT_SEARCH_PATH}"),
            base_params=data.get("base_params", {}),
            extra_headers=data.get("extra_headers", {}),
        )
    # Permite passar a chave via variavel de ambiente sem arquivo.
    return SmilesConfig(api_key=os.environ.get("SMILES_API_KEY", ""))


def save_config(cfg: SmilesConfig, path: Path = CONFIG_PATH) -> None:
    path.write_text(json.dumps(asdict(cfg), indent=2, ensure_ascii=False), encoding="utf-8")
