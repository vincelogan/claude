// TODO: Instalar dependência bcryptjs antes de rodar este seed:
//   npm install bcryptjs
//   npm install -D @types/bcryptjs
//
// Seed inicial do banco da plataforma "Donnici Advogados".
// Popula dados de referência (tribunais, assuntos do CNJ, varas) e,
// opcionalmente, o usuário ADMIN inicial via variáveis de ambiente.
//
// Executar com: npm run db:seed

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// =============================================================================
// TRIBUNAIS
// =============================================================================
async function seedTribunais() {
  const tribunais = [
    // ----- Justiça Estadual -----
    {
      sigla: "TJSP",
      nome: "Tribunal de Justiça de São Paulo",
      esfera: "ESTADUAL",
      sistema: "ESAJ",
      uf: "SP",
    },
    {
      sigla: "TJRJ",
      nome: "Tribunal de Justiça do Rio de Janeiro",
      esfera: "ESTADUAL",
      sistema: "PJE",
      uf: "RJ",
    },
    {
      sigla: "TJMG",
      nome: "Tribunal de Justiça de Minas Gerais",
      esfera: "ESTADUAL",
      sistema: "PJE",
      uf: "MG",
    },
    {
      sigla: "TJPR",
      nome: "Tribunal de Justiça do Paraná",
      esfera: "ESTADUAL",
      sistema: "PROJUDI",
      uf: "PR",
    },
    {
      sigla: "TJRS",
      nome: "Tribunal de Justiça do Rio Grande do Sul",
      esfera: "ESTADUAL",
      sistema: "EPROC",
      uf: "RS",
    },

    // ----- Justiça Federal -----
    {
      sigla: "TRF1",
      nome: "Tribunal Regional Federal da 1ª Região",
      esfera: "FEDERAL",
      sistema: "PJE",
      uf: null,
    },
    {
      sigla: "TRF2",
      nome: "Tribunal Regional Federal da 2ª Região",
      esfera: "FEDERAL",
      sistema: "PJE",
      uf: null,
    },
    {
      sigla: "TRF3",
      nome: "Tribunal Regional Federal da 3ª Região",
      esfera: "FEDERAL",
      sistema: "PJE",
      uf: null,
    },
    {
      sigla: "TRF4",
      nome: "Tribunal Regional Federal da 4ª Região",
      esfera: "FEDERAL",
      sistema: "PJE",
      uf: null,
    },
    {
      sigla: "TRF5",
      nome: "Tribunal Regional Federal da 5ª Região",
      esfera: "FEDERAL",
      sistema: "PJE",
      uf: null,
    },
    {
      sigla: "TRF6",
      nome: "Tribunal Regional Federal da 6ª Região",
      esfera: "FEDERAL",
      sistema: "PJE",
      uf: null,
    },

    // ----- Justiça do Trabalho -----
    {
      sigla: "TRT2",
      nome: "Tribunal Regional do Trabalho da 2ª Região (SP)",
      esfera: "TRABALHISTA",
      sistema: "PJE",
      uf: "SP",
    },
    {
      sigla: "TRT15",
      nome: "Tribunal Regional do Trabalho da 15ª Região (Campinas)",
      esfera: "TRABALHISTA",
      sistema: "PJE",
      uf: "SP",
    },
    {
      sigla: "TRT1",
      nome: "Tribunal Regional do Trabalho da 1ª Região (RJ)",
      esfera: "TRABALHISTA",
      sistema: "PJE",
      uf: "RJ",
    },

    // ----- Tribunais Superiores -----
    {
      sigla: "STJ",
      nome: "Superior Tribunal de Justiça",
      esfera: "SUPERIOR",
      sistema: "PJE",
      uf: null,
    },
    {
      sigla: "STF",
      nome: "Supremo Tribunal Federal",
      esfera: "SUPERIOR",
      sistema: "PJE",
      uf: null,
    },
    {
      sigla: "TST",
      nome: "Tribunal Superior do Trabalho",
      esfera: "SUPERIOR",
      sistema: "PJE",
      uf: null,
    },
  ];

  for (const t of tribunais) {
    await prisma.tribunal.upsert({
      where: { sigla: t.sigla },
      update: {},
      create: t,
    });
  }

  console.log(`✓ ${tribunais.length} tribunais`);
}

// =============================================================================
// ASSUNTOS (hierarquia baseada na tabela do CNJ)
// =============================================================================
async function seedAssuntos() {
  // Estrutura: { nome do pai, area, filhos }
  const hierarquia: Array<{ nome: string; area: string; filhos: string[] }> = [
    {
      nome: "Direito Civil",
      area: "CIVEL",
      filhos: ["Obrigações", "Responsabilidade Civil", "Família", "Sucessões", "Coisas"],
    },
    {
      nome: "Direito do Trabalho",
      area: "TRABALHISTA",
      filhos: ["Verbas Rescisórias", "Adicional de Insalubridade", "Horas Extras"],
    },
    {
      nome: "Direito Tributário",
      area: "TRIBUTARIO",
      filhos: ["ICMS", "ISS", "IPTU"],
    },
    {
      nome: "Direito do Consumidor",
      area: "CONSUMIDOR",
      filhos: ["Vício do Produto", "Cobrança Indevida", "Negativação Indevida"],
    },
  ];

  let totalPais = 0;
  let totalFilhos = 0;

  for (const { nome: nomePai, area, filhos } of hierarquia) {
    // findOrCreate para o assunto raiz (nome não é unique no schema)
    let pai = await prisma.assunto.findFirst({ where: { nome: nomePai, paiId: null } });
    if (!pai) {
      pai = await prisma.assunto.create({
        data: { nome: nomePai, area: area as any, codigoCnj: null, paiId: null },
      });
    }
    totalPais++;

    for (const nomeFilho of filhos) {
      const existe = await prisma.assunto.findFirst({ where: { nome: nomeFilho, paiId: pai.id } });
      if (!existe) {
        await prisma.assunto.create({
          data: { nome: nomeFilho, area: area as any, codigoCnj: null, paiId: pai.id },
        });
      }
      totalFilhos++;
    }
  }

  console.log(`✓ ${totalPais} assuntos raiz + ${totalFilhos} filhos`);
}

// =============================================================================
// VARAS de exemplo
// =============================================================================
async function seedVaras() {
  const tjsp = await prisma.tribunal.findUnique({ where: { sigla: "TJSP" } });
  const trt2 = await prisma.tribunal.findUnique({ where: { sigla: "TRT2" } });

  if (!tjsp || !trt2) {
    console.warn("⚠ Tribunais TJSP/TRT2 não encontrados, pulando varas");
    return;
  }

  const varas = [
    {
      nome: "1ª Vara Cível - Foro Central",
      comarca: "São Paulo - SP",
      tribunalId: tjsp.id,
    },
    {
      nome: "2ª Vara da Fazenda Pública",
      comarca: "São Paulo - SP",
      tribunalId: tjsp.id,
    },
    {
      nome: "10ª Vara do Trabalho de São Paulo",
      comarca: "São Paulo - SP",
      tribunalId: trt2.id,
    },
  ];

  for (const v of varas) {
    const existe = await prisma.vara.findFirst({
      where: { nome: v.nome, tribunalId: v.tribunalId },
    });
    if (!existe) await prisma.vara.create({ data: v });
  }

  console.log(`✓ ${varas.length} varas`);
}

// =============================================================================
// USUÁRIO ADMIN inicial (opcional via env)
// =============================================================================
async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.log(
      "⚠ ADMIN_EMAIL ou ADMIN_PASSWORD não definidos — pulando criação do admin",
    );
    return;
  }

  const senhaHash = await bcrypt.hash(password, 10);

  await prisma.usuario.upsert({
    where: { email },
    update: {},
    create: {
      email,
      nome: "Administrador",
      senhaHash,
      perfil: "ADMIN",
    },
  });

  console.log(`✓ Usuário ADMIN criado: ${email}`);
}

// =============================================================================
// MAIN
// =============================================================================
async function main() {
  console.log("→ Iniciando seed do banco Donnici Advogados...\n");

  await seedTribunais();
  await seedAssuntos();
  await seedVaras();
  await seedAdmin();

  console.log("\n✓ Seed concluído com sucesso.");
}

main()
  .catch((e) => {
    console.error("✗ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
