#!/usr/bin/env bash
# Roda a cada start do Codespace (não só na criação).
# Garante que o Postgres está respondendo antes de devolver o controle.
set -e

for i in {1..30}; do
  if pg_isready -h db -U donnici -d donnici 2>/dev/null; then
    exit 0
  fi
  sleep 1
done

echo "⚠ Postgres não respondeu em 30s. Verifique 'docker compose logs db'."
exit 1
