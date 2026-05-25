import { z } from "zod";

import { limpar, validarCPF, validarCNPJ } from "./cpf-cnpj";

/**
 * Schema compartilhado entre client (react-hook-form) e server (server action).
 * As validações de dígito verificador de CPF/CNPJ acontecem via `superRefine`.
 */
export const clienteSchema = z
  .object({
    id: z.string().optional(),
    tipoPessoa: z.enum(["PF", "PJ"], {
      required_error: "Selecione o tipo de pessoa.",
    }),
    nome: z
      .string()
      .trim()
      .min(2, "Informe o nome completo.")
      .max(200, "Nome muito longo."),
    cpfCnpj: z.string().trim().min(1, "Informe o CPF ou CNPJ."),
    rg: z.string().trim().max(30).optional().or(z.literal("")),
    email: z
      .string()
      .trim()
      .email("E-mail inválido.")
      .max(200)
      .optional()
      .or(z.literal("")),
    telefone: z.string().trim().max(30).optional().or(z.literal("")),
    endereco: z.string().trim().max(300).optional().or(z.literal("")),
    cep: z.string().trim().max(15).optional().or(z.literal("")),
    cidade: z.string().trim().max(120).optional().or(z.literal("")),
    uf: z
      .string()
      .trim()
      .length(2, "UF deve ter 2 caracteres.")
      .toUpperCase()
      .optional()
      .or(z.literal("")),
    observacoes: z.string().trim().max(2000).optional().or(z.literal("")),
  })
  .superRefine((dados, ctx) => {
    const digitos = limpar(dados.cpfCnpj);

    if (dados.tipoPessoa === "PF") {
      if (digitos.length !== 11) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cpfCnpj"],
          message: "CPF deve ter 11 dígitos.",
        });
      } else if (!validarCPF(digitos)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cpfCnpj"],
          message: "CPF inválido.",
        });
      }
    } else {
      if (digitos.length !== 14) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cpfCnpj"],
          message: "CNPJ deve ter 14 dígitos.",
        });
      } else if (!validarCNPJ(digitos)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cpfCnpj"],
          message: "CNPJ inválido.",
        });
      }
    }
  });

export type ClienteInput = z.infer<typeof clienteSchema>;
