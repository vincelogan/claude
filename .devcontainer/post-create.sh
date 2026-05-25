#!/usr/bin/env bash
# Roda UMA vez quando o Codespace é criado.
set -e

echo "→ Instalando dependências Node..."
npm install

echo "→ Aguardando PostgreSQL ficar pronto..."
for i in {1..30}; do
  if pg_isready -h db -U donnici -d donnici 2>/dev/null; then
    echo "  Postgres pronto."
    break
  fi
  sleep 1
done

echo "→ Gerando Prisma Client..."
npx prisma generate

echo "→ Aplicando migrations..."
npx prisma migrate deploy

echo "→ Populando dados iniciais (tribunais, assuntos, usuário admin)..."
npm run db:seed

cat <<'EOF'

╭───────────────────────────────────────────────────────────────╮
│  ✓ Setup do Codespace concluído                               │
│                                                               │
│  Para subir o app:                                            │
│      npm run dev                                              │
│                                                               │
│  Login de teste:                                              │
│      donnici@donnici.adv.br / donnici                         │
│                                                               │
│  A porta 3000 será exposta automaticamente como URL pública.  │
╰───────────────────────────────────────────────────────────────╯

EOF
