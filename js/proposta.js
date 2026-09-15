// Modelo da proposta: junta o que está na tela num objeto só, que serve tanto
// para desenhar o documento quanto para montar o texto do WhatsApp/e-mail/SMS.

import { formatarTaxa, formatarDiferenca, rotuloParcela, temTaxa } from "./calculo.js";

const hoje = () => new Date();

const soLetras = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // tira acentos
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

/** Última parcela com taxa (0 quando o lado só tem débito, ou nada). */
export const ultimaParcela = (res) => {
  for (let i = res.parcelas.length - 1; i >= 0; i--) {
    if (temTaxa(res.parcelas[i])) return i + 1;
  }
  return 0;
};

/**
 * Uma linha por faixa que a PROPOSTA (lado A) tem — é ela que vai ao cliente.
 * A concorrente costuma parcelar em menos vezes; onde ela não tem taxa a linha
 * segue só com o lado A, sem diferença para mostrar.
 */
export function linhasDaProposta({ a, b }) {
  const linha = (rotulo, parcela, valorA, valorB) => ({
    rotulo,
    parcela, // null no débito — o resumo em texto precisa distinguir
    a: valorA,
    b: temTaxa(valorB) ? valorB : null,
    dif: temTaxa(valorB) ? valorA - valorB : null,
  });

  const linhas = [];
  if (temTaxa(a.debito)) linhas.push(linha("Débito", null, a.debito, b?.debito));
  a.parcelas.forEach((valor, i) => {
    if (temTaxa(valor)) linhas.push(linha(rotuloParcela(i + 1), i + 1, valor, b?.parcelas[i]));
  });
  return linhas;
}

/**
 * @param {{cliente:string, nomeA:string, nomeB:string|null,
 *          corA:object, corB:object|null, resultado:{a:object,b:object|null}}} args
 */
export function montarProposta({ cliente, nomeA, nomeB, corA, corB, resultado }) {
  const linhas = linhasDaProposta(resultado);
  const comparaveis = linhas.filter((l) => l.dif !== null);

  const data = hoje();

  return {
    cliente: cliente.trim(),
    nomeA,
    nomeB,
    corA,
    corB,
    comparacao: Boolean(resultado.b),
    linhas,
    vitoriasA: comparaveis.filter((l) => l.dif < 0).length,
    comparaveis: comparaveis.length,
    total: linhas.length,
    ateA: ultimaParcela(resultado.a),
    ateB: resultado.b ? ultimaParcela(resultado.b) : null,
    data,
    dataBR: data.toLocaleDateString("pt-BR"),
  };
}

export function tituloProposta(p) {
  return p.comparacao ? `${p.nomeA} × ${p.nomeB}` : p.nomeA;
}

export function chamada(p) {
  if (!p.comparacao || p.comparaveis === 0) return `Taxas ${p.nomeA}`;
  return `${p.nomeA} tem a menor taxa em ${p.vitoriasA} de ${p.comparaveis} faixas`;
}

/**
 * Explica, quando é o caso, por que a comparação para antes da proposta:
 * a concorrente não cobre todas as faixas que estamos apresentando.
 */
export function notaCobertura(p) {
  if (!p.comparacao) return "";
  if (p.comparaveis === 0) return `Sem taxas de ${p.nomeB} para comparar.`;
  if (p.ateB === 0) return `${p.nomeB} não informou taxas de crédito.`;
  if (p.ateB >= p.ateA) return "";
  return `Comparação até ${p.ateB}x — acima disso, só ${p.nomeA} tem taxa informada.`;
}

export function nomeArquivo(p, extensao) {
  const partes = ["proposta", soLetras(p.cliente || tituloProposta(p))];
  const d = p.data;
  const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
  return `${partes.filter(Boolean).join("-")}-${iso}.${extensao}`;
}

/** Resumo em texto puro, para os canais que não aceitam anexo. */
export function resumoTexto(p) {
  const linhas = [];
  linhas.push(p.cliente ? `Proposta de taxas — ${p.cliente}` : "Proposta de taxas");
  linhas.push(`${tituloProposta(p)} · ${p.dataBR}`);
  linhas.push("");

  if (p.comparacao) {
    // As faixas que a concorrente não cobre vão num bloco à parte: repetir
    // "sem taxa" em cada linha só polui a mensagem.
    const comparadas = p.linhas.filter((l) => l.dif !== null);
    const soProposta = p.linhas.filter((l) => l.dif === null);

    linhas.push(`Taxa efetiva: ${p.nomeA} x ${p.nomeB}`);
    linhas.push("");
    comparadas.forEach((l) => {
      linhas.push(
        `${l.rotulo}: ${formatarTaxa(l.a)} x ${formatarTaxa(l.b)} (${formatarDiferenca(l.dif)})`
      );
    });

    if (comparadas.length > 0) {
      linhas.push("");
      linhas.push(chamada(p) + ".");
    }

    if (soProposta.length > 0) {
      const acimaDe = soProposta.every((l) => l.parcela !== null) && p.ateB > 0;
      linhas.push("");
      linhas.push(
        acimaDe
          ? `Acima de ${p.ateB}x, só ${p.nomeA} tem taxa:`
          : `Faixas sem taxa de ${p.nomeB}:`
      );
      soProposta.forEach((l) => linhas.push(`${l.rotulo}: ${formatarTaxa(l.a)}`));
    }
  } else {
    linhas.push("Taxa efetiva:");
    linhas.push("");
    p.linhas.forEach((l) => linhas.push(`${l.rotulo}: ${formatarTaxa(l.a)}`));
  }

  return linhas.join("\n");
}
