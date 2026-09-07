// Cálculo da taxa efetiva. Função pura: não toca no DOM.
//
// É a mesma fórmula que estava repetida em calculadora.js, calculadoraTaxas.js
// e calculadoraTaxaProgramada.js, agora em um lugar só.
//
//   taxa(n) = ((100 - MDR) / n) * (RAV / 100 * T(n)) + MDR
//
// onde n é o número de parcelas e T(n) = n(n+1)/2 é o total de meses que o
// dinheiro fica antecipado somando todas as parcelas (1 + 2 + ... + n).

export const PARCELAS_MAX = 18;

const triangular = (n) => (n * (n + 1)) / 2;

export function taxaDaParcela({ mdr, rav, parcela }) {
  return ((100 - mdr) / parcela) * ((rav / 100) * triangular(parcela)) + mdr;
}

/**
 * Calcula as 18 parcelas a partir do MDR de cada banda e da taxa de antecipação.
 * @returns {{ debito: number, parcelas: number[] }}
 */
export function calcularTaxas({ bandas, valores, rav, debito }) {
  const parcelas = [];
  for (let n = 1; n <= PARCELAS_MAX; n++) {
    const banda = bandas.find((b) => n >= b.de && n <= b.ate);
    parcelas.push(taxaDaParcela({ mdr: valores[banda.id], rav, parcela: n }));
  }
  return { debito, parcelas };
}

/** Aceita "3,15" e "3.15" — no Brasil se digita com vírgula. */
export function lerTaxa(texto) {
  if (typeof texto !== "string") return NaN;
  const limpo = texto.trim().replace(",", ".");
  if (limpo === "") return NaN;
  return Number.parseFloat(limpo);
}

/** Uma taxa válida é um número finito entre 0 e 100. */
export function taxaValida(valor) {
  return Number.isFinite(valor) && valor >= 0 && valor <= 100;
}

export const formatarTaxa = (n) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%";

/** Diferença entre duas taxas, em pontos percentuais. */
export const formatarDiferenca = (n) => {
  const sinal = n > 0 ? "+" : n < 0 ? "−" : "";
  const abs = Math.abs(n).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${sinal}${abs} pp`;
};

export const rotuloParcela = (n) => `${n}x`;
