/**
 * Utilitários para CPF/CNPJ — validação, formatação e limpeza.
 * Armazenamento: SEMPRE apenas dígitos (sem máscara).
 */

export function limpar(valor: string | null | undefined): string {
  if (!valor) return "";
  return valor.replace(/\D+/g, "");
}

/**
 * Valida CPF (11 dígitos) usando o algoritmo dos dígitos verificadores.
 */
export function validarCPF(valor: string): boolean {
  const cpf = limpar(valor);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i), 10) * (10 - i);
  }
  let dv1 = 11 - (soma % 11);
  if (dv1 >= 10) dv1 = 0;
  if (dv1 !== parseInt(cpf.charAt(9), 10)) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i), 10) * (11 - i);
  }
  let dv2 = 11 - (soma % 11);
  if (dv2 >= 10) dv2 = 0;
  if (dv2 !== parseInt(cpf.charAt(10), 10)) return false;

  return true;
}

/**
 * Valida CNPJ (14 dígitos) usando o algoritmo dos dígitos verificadores.
 */
export function validarCNPJ(valor: string): boolean {
  const cnpj = limpar(valor);
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  const calcularDV = (base: string, pesos: number[]): number => {
    let soma = 0;
    for (let i = 0; i < pesos.length; i++) {
      soma += parseInt(base.charAt(i), 10) * pesos[i];
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const dv1 = calcularDV(cnpj.substring(0, 12), pesos1);
  if (dv1 !== parseInt(cnpj.charAt(12), 10)) return false;

  const dv2 = calcularDV(cnpj.substring(0, 13), pesos2);
  if (dv2 !== parseInt(cnpj.charAt(13), 10)) return false;

  return true;
}

/**
 * Formata um CPF (000.000.000-00) ou CNPJ (00.000.000/0000-00) para exibição.
 * Se o tipo não for informado, infere pelo tamanho dos dígitos.
 */
export function formatarCpfCnpj(
  valor: string | null | undefined,
  tipo?: "PF" | "PJ",
): string {
  const digitos = limpar(valor);
  if (!digitos) return "";

  const inferido: "PF" | "PJ" =
    tipo ?? (digitos.length === 14 ? "PJ" : "PF");

  if (inferido === "PF") {
    const padded = digitos.padStart(11, "0").slice(-11);
    return padded.replace(
      /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
      "$1.$2.$3-$4",
    );
  }

  const padded = digitos.padStart(14, "0").slice(-14);
  return padded.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5",
  );
}
