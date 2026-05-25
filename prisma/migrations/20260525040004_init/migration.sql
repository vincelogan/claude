-- CreateEnum
CREATE TYPE "PerfilUsuario" AS ENUM ('ADMIN', 'ADVOGADO', 'ESTAGIARIO', 'SECRETARIA');

-- CreateEnum
CREATE TYPE "TipoPessoa" AS ENUM ('PF', 'PJ');

-- CreateEnum
CREATE TYPE "AreaJuridica" AS ENUM ('CIVEL', 'TRABALHISTA', 'CRIMINAL', 'TRIBUTARIO', 'PREVIDENCIARIO', 'EMPRESARIAL', 'FAMILIA', 'CONSUMIDOR', 'ADMINISTRATIVO', 'OUTRO');

-- CreateEnum
CREATE TYPE "EsferaTribunal" AS ENUM ('ESTADUAL', 'FEDERAL', 'TRABALHISTA', 'ELEITORAL', 'MILITAR', 'SUPERIOR');

-- CreateEnum
CREATE TYPE "SistemaTribunal" AS ENUM ('PJE', 'ESAJ', 'PROJUDI', 'EPROC', 'OUTRO');

-- CreateEnum
CREATE TYPE "TipoProcesso" AS ENUM ('JUDICIAL', 'ADMINISTRATIVO', 'EXTRAJUDICIAL');

-- CreateEnum
CREATE TYPE "FaseProcesso" AS ENUM ('PRE_PROCESSUAL', 'CONHECIMENTO', 'RECURSAL', 'EXECUCAO', 'CUMPRIMENTO_SENTENCA', 'ARQUIVADO');

-- CreateEnum
CREATE TYPE "StatusProcesso" AS ENUM ('ATIVO', 'SUSPENSO', 'ARQUIVADO', 'BAIXADO', 'ENCERRADO');

-- CreateEnum
CREATE TYPE "PoloParte" AS ENUM ('ATIVO', 'PASSIVO', 'TERCEIRO', 'OUTRO');

-- CreateEnum
CREATE TYPE "TipoParte" AS ENUM ('PARTE_PRINCIPAL', 'ADVOGADO_CONTRARIO', 'TERCEIRO_INTERESSADO', 'TESTEMUNHA', 'PERITO');

-- CreateEnum
CREATE TYPE "TipoMovimentacao" AS ENUM ('MANUAL', 'PUBLICACAO', 'DESPACHO', 'DECISAO', 'SENTENCA', 'ACORDAO', 'PETICAO', 'JUNTADA', 'OUTRO');

-- CreateEnum
CREATE TYPE "StatusPrazo" AS ENUM ('PENDENTE', 'CUMPRIDO', 'PRORROGADO', 'PERDIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoAudiencia" AS ENUM ('CONCILIACAO', 'INSTRUCAO', 'JULGAMENTO', 'UNA', 'CUSTODIA', 'ARBITRAL', 'OUTRA');

-- CreateEnum
CREATE TYPE "StatusAudiencia" AS ENUM ('AGENDADA', 'REALIZADA', 'ADIADA', 'CANCELADA');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "oab" TEXT,
    "oabUf" CHAR(2),
    "perfil" "PerfilUsuario" NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "tipoPessoa" "TipoPessoa" NOT NULL,
    "nome" TEXT NOT NULL,
    "cpfCnpj" TEXT NOT NULL,
    "rg" TEXT,
    "email" TEXT,
    "telefone" TEXT,
    "endereco" TEXT,
    "cep" TEXT,
    "cidade" TEXT,
    "uf" CHAR(2),
    "observacoes" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assuntos" (
    "id" TEXT NOT NULL,
    "codigoCnj" TEXT,
    "nome" TEXT NOT NULL,
    "area" "AreaJuridica" NOT NULL,
    "paiId" TEXT,

    CONSTRAINT "assuntos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tribunais" (
    "id" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "esfera" "EsferaTribunal" NOT NULL,
    "sistema" "SistemaTribunal" NOT NULL,
    "uf" CHAR(2),

    CONSTRAINT "tribunais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "varas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "comarca" TEXT,
    "tribunalId" TEXT NOT NULL,

    CONSTRAINT "varas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "processos" (
    "id" TEXT NOT NULL,
    "numeroCnj" TEXT NOT NULL,
    "numeroAntigo" TEXT,
    "classeProcessual" TEXT,
    "tipo" "TipoProcesso" NOT NULL DEFAULT 'JUDICIAL',
    "fase" "FaseProcesso" NOT NULL DEFAULT 'CONHECIMENTO',
    "status" "StatusProcesso" NOT NULL DEFAULT 'ATIVO',
    "sigiloso" BOOLEAN NOT NULL DEFAULT false,
    "valorCausa" DECIMAL(14,2),
    "tribunalId" TEXT,
    "varaId" TEXT,
    "assuntoId" TEXT,
    "ultimaSincronizacao" TIMESTAMP(3),
    "observacoes" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "processos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partes" (
    "id" TEXT NOT NULL,
    "processoId" TEXT NOT NULL,
    "clienteId" TEXT,
    "nome" TEXT NOT NULL,
    "cpfCnpj" TEXT,
    "polo" "PoloParte" NOT NULL,
    "tipoParte" "TipoParte" NOT NULL DEFAULT 'PARTE_PRINCIPAL',

    CONSTRAINT "partes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "processos_responsaveis" (
    "processoId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "principal" BOOLEAN NOT NULL DEFAULT false,
    "desde" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "processos_responsaveis_pkey" PRIMARY KEY ("processoId","usuarioId")
);

-- CreateTable
CREATE TABLE "movimentacoes" (
    "id" TEXT NOT NULL,
    "processoId" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" "TipoMovimentacao" NOT NULL DEFAULT 'OUTRO',
    "origemTribunal" BOOLEAN NOT NULL DEFAULT false,
    "hashTribunal" TEXT,
    "criadaPorId" TEXT,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimentacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prazos" (
    "id" TEXT NOT NULL,
    "processoId" TEXT,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "fatal" BOOLEAN NOT NULL DEFAULT false,
    "status" "StatusPrazo" NOT NULL DEFAULT 'PENDENTE',
    "diasCorridos" BOOLEAN NOT NULL DEFAULT false,
    "responsavelId" TEXT NOT NULL,
    "cumpridoEm" TIMESTAMP(3),
    "observacoes" TEXT,
    "googleEventId" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prazos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audiencias" (
    "id" TEXT NOT NULL,
    "processoId" TEXT NOT NULL,
    "tipo" "TipoAudiencia" NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL,
    "local" TEXT,
    "virtual" BOOLEAN NOT NULL DEFAULT false,
    "linkVirtual" TEXT,
    "responsavelId" TEXT,
    "status" "StatusAudiencia" NOT NULL DEFAULT 'AGENDADA',
    "resultado" TEXT,
    "observacoes" TEXT,
    "googleEventId" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audiencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integracoes_tribunal" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "sistema" "SistemaTribunal" NOT NULL,
    "tribunalSigla" TEXT NOT NULL,
    "credencialCifrada" TEXT NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "ultimoSync" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integracoes_tribunal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integracoes_google" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "accessTokenCif" TEXT NOT NULL,
    "refreshTokenCif" TEXT NOT NULL,
    "expiraEm" TIMESTAMP(3) NOT NULL,
    "calendarId" TEXT,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integracoes_google_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_cpfCnpj_key" ON "clientes"("cpfCnpj");

-- CreateIndex
CREATE INDEX "clientes_nome_idx" ON "clientes"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "assuntos_codigoCnj_key" ON "assuntos"("codigoCnj");

-- CreateIndex
CREATE UNIQUE INDEX "tribunais_sigla_key" ON "tribunais"("sigla");

-- CreateIndex
CREATE INDEX "varas_tribunalId_idx" ON "varas"("tribunalId");

-- CreateIndex
CREATE UNIQUE INDEX "processos_numeroCnj_key" ON "processos"("numeroCnj");

-- CreateIndex
CREATE INDEX "processos_status_idx" ON "processos"("status");

-- CreateIndex
CREATE INDEX "processos_numeroCnj_idx" ON "processos"("numeroCnj");

-- CreateIndex
CREATE INDEX "processos_tribunalId_idx" ON "processos"("tribunalId");

-- CreateIndex
CREATE INDEX "processos_varaId_idx" ON "processos"("varaId");

-- CreateIndex
CREATE INDEX "partes_processoId_idx" ON "partes"("processoId");

-- CreateIndex
CREATE INDEX "partes_clienteId_idx" ON "partes"("clienteId");

-- CreateIndex
CREATE INDEX "processos_responsaveis_usuarioId_idx" ON "processos_responsaveis"("usuarioId");

-- CreateIndex
CREATE INDEX "movimentacoes_processoId_data_idx" ON "movimentacoes"("processoId", "data");

-- CreateIndex
CREATE UNIQUE INDEX "movimentacoes_processoId_hashTribunal_key" ON "movimentacoes"("processoId", "hashTribunal");

-- CreateIndex
CREATE INDEX "prazos_dataVencimento_idx" ON "prazos"("dataVencimento");

-- CreateIndex
CREATE INDEX "prazos_responsavelId_status_idx" ON "prazos"("responsavelId", "status");

-- CreateIndex
CREATE INDEX "prazos_processoId_idx" ON "prazos"("processoId");

-- CreateIndex
CREATE INDEX "audiencias_dataHora_idx" ON "audiencias"("dataHora");

-- CreateIndex
CREATE INDEX "audiencias_processoId_idx" ON "audiencias"("processoId");

-- CreateIndex
CREATE UNIQUE INDEX "integracoes_tribunal_usuarioId_sistema_tribunalSigla_key" ON "integracoes_tribunal"("usuarioId", "sistema", "tribunalSigla");

-- CreateIndex
CREATE UNIQUE INDEX "integracoes_google_usuarioId_key" ON "integracoes_google"("usuarioId");

-- AddForeignKey
ALTER TABLE "assuntos" ADD CONSTRAINT "assuntos_paiId_fkey" FOREIGN KEY ("paiId") REFERENCES "assuntos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "varas" ADD CONSTRAINT "varas_tribunalId_fkey" FOREIGN KEY ("tribunalId") REFERENCES "tribunais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processos" ADD CONSTRAINT "processos_tribunalId_fkey" FOREIGN KEY ("tribunalId") REFERENCES "tribunais"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processos" ADD CONSTRAINT "processos_varaId_fkey" FOREIGN KEY ("varaId") REFERENCES "varas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processos" ADD CONSTRAINT "processos_assuntoId_fkey" FOREIGN KEY ("assuntoId") REFERENCES "assuntos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partes" ADD CONSTRAINT "partes_processoId_fkey" FOREIGN KEY ("processoId") REFERENCES "processos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partes" ADD CONSTRAINT "partes_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processos_responsaveis" ADD CONSTRAINT "processos_responsaveis_processoId_fkey" FOREIGN KEY ("processoId") REFERENCES "processos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processos_responsaveis" ADD CONSTRAINT "processos_responsaveis_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes" ADD CONSTRAINT "movimentacoes_processoId_fkey" FOREIGN KEY ("processoId") REFERENCES "processos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes" ADD CONSTRAINT "movimentacoes_criadaPorId_fkey" FOREIGN KEY ("criadaPorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prazos" ADD CONSTRAINT "prazos_processoId_fkey" FOREIGN KEY ("processoId") REFERENCES "processos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prazos" ADD CONSTRAINT "prazos_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audiencias" ADD CONSTRAINT "audiencias_processoId_fkey" FOREIGN KEY ("processoId") REFERENCES "processos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audiencias" ADD CONSTRAINT "audiencias_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integracoes_tribunal" ADD CONSTRAINT "integracoes_tribunal_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integracoes_google" ADD CONSTRAINT "integracoes_google_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
