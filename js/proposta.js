// Modelo da proposta: junta o que está na tela num objeto só, que serve tanto
// para desenhar o documento quanto para montar o texto do WhatsApp/e-mail/SMS.

import { formatarTaxa, formatarDiferenca, rotuloParcela } from "./calculo.js";

const hoje = () => new Date();

const soLetras = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // tira acentos
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

/**
 * @param {{cliente:string, nomeA:string, nomeB:string|null,
 *          corA:object, corB:object|null, resultado:{a:object,b:object|null}}} args
 */
export function montarProposta({ cliente, nomeA, nomeB, corA, corB, resultado }) {
  const linhasDe = (res) => [
    { rotulo: "Débito", valor: res.debito },
    ...res.parcelas.map((v, i) => ({ rotulo: rotuloParcela(i + 1), valor: v })),
  ];

  const a = linhasDe(resultado.a);
  const b = resultado.b ? linhasDe(resultado.b) : null;

  const linhas = a.map((l, i) => ({
    rotulo: l.rotulo,
    a: l.valor,
    b: b ? b[i].valor : null,
    dif: b ? l.valor - b[i].valor : null,
  }));

  const data = hoje();

  return {
    cliente: cliente.trim(),
    nomeA,
    nomeB,
    corA,
    corB,
    comparacao: Boolean(b),
    linhas,
    vitoriasA: b ? linhas.filter((l) => l.dif < 0).length : 0,
    total: linhas.length,
    data,
    dataBR: data.toLocaleDateString("pt-BR"),
  };
}

export function tituloProposta(p) {
  return p.comparacao ? `${p.nomeA} × ${p.nomeB}` : p.nomeA;
}

export function chamada(p) {
  if (!p.comparacao) return `Taxas ${p.nomeA}`;
  return `${p.nomeA} tem a menor taxa em ${p.vitoriasA} de ${p.total} faixas`;
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
    linhas.push(`Taxa efetiva: ${p.nomeA} x ${p.nomeB}`);
    linhas.push("");
    p.linhas.forEach((l) => {
      linhas.push(`${l.rotulo}: ${formatarTaxa(l.a)} x ${formatarTaxa(l.b)} (${formatarDiferenca(l.dif)})`);
    });
    linhas.push("");
    linhas.push(chamada(p) + ".");
  } else {
    linhas.push("Taxa efetiva:");
    linhas.push("");
    p.linhas.forEach((l) => linhas.push(`${l.rotulo}: ${formatarTaxa(l.a)}`));
  }

  return linhas.join("\n");
}
