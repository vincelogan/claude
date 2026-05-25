import { z } from "zod";

const TIPOS_AUDIENCIA = [
  "CONCILIACAO",
  "INSTRUCAO",
  "JULGAMENTO",
  "UNA",
  "CUSTODIA",
  "ARBITRAL",
  "OUTRA",
] as const;

export const audienciaSchema = z
  .object({
    id: z.string().optional(),
    processoId: z.string().trim().min(1, "Selecione um processo."),
    tipo: z.enum(TIPOS_AUDIENCIA, {
      required_error: "Selecione o tipo de audiência.",
    }),
    dataHora: z.coerce.date({ message: "Data/hora inválida." }),
    virtual: z.coerce.boolean().optional().default(false),
    local: z.string().trim().optional().nullable(),
    linkVirtual: z.string().trim().optional().nullable(),
    responsavelId: z.string().trim().optional().nullable(),
    observacoes: z.string().trim().optional().nullable(),
  })
  .superRefine((dados, ctx) => {
    if (dados.virtual) {
      if (!dados.linkVirtual || dados.linkVirtual.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["linkVirtual"],
          message: "Informe o link da audiência virtual.",
        });
      } else {
        try {
          new URL(dados.linkVirtual);
        } catch {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["linkVirtual"],
            message: "Link inválido. Use uma URL completa (https://...).",
          });
        }
      }
    } else {
      if (!dados.local || dados.local.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["local"],
          message: "Informe o local da audiência.",
        });
      }
    }
  });

export type SalvarAudienciaInput = z.input<typeof audienciaSchema>;
export type SalvarAudienciaResult =
  | { ok: true; id: string }
  | { ok: false; erro: string };
