// Últimas propostas, guardadas no localStorage deste aparelho.
//
// Este é o ÚNICO arquivo que fala com o localStorage. Se um dia as propostas
// forem para um servidor (para o time compartilhar), só o miolo daqui muda —
// o resto do app continua chamando as mesmas funções.
//
// Guardamos o que foi DIGITADO, não as taxas calculadas: se a fórmula for
// corrigida, as propostas antigas passam a recalcular certo em vez de ficarem
// congeladas com o número errado.

const CHAVE = "calctaxas:propostas:v1";

/** Quantas propostas ficam guardadas. Ao salvar a próxima, a mais antiga sai. */
export const MAX_PROPOSTAS = 2;

const vazio = () => ({ versao: 1, propostas: [] });

/** localStorage lança em aba anônima do Safari e quando a cota estoura. */
export function disponivel() {
  try {
    const t = "__teste__";
    localStorage.setItem(t, "1");
    localStorage.removeItem(t);
    return true;
  } catch {
    return false;
  }
}

function ler() {
  try {
    const cru = JSON.parse(localStorage.getItem(CHAVE));
    if (!cru || cru.versao !== 1 || !Array.isArray(cru.propostas)) return vazio();
    return cru;
  } catch {
    return vazio(); // conteúdo corrompido não pode derrubar a calculadora
  }
}

function gravar(dados) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(dados));
    return true;
  } catch {
    return false;
  }
}

const novoId = () =>
  crypto.randomUUID?.() ?? `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

// Assinatura do conteúdo que define a proposta. O nome do cliente fica de fora
// de propósito: ele é digitado depois de calcular, e recalcular os mesmos
// números deve atualizar a proposta existente em vez de criar outra.
function assinar(p) {
  const lado = (l) =>
    l && [
      l.operadoraId,
      l.nomeLivre ?? "",
      l.efetiva ? 1 : 0,
      Object.entries(l.valores ?? {})
        .filter(([, v]) => v !== "" && v != null)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${v}`)
        .join(","),
    ].join("|");
  return [p.modo, lado(p.a), p.modo === "comparar" ? lado(p.b) : ""].join("::");
}

/** Mais recente primeiro. */
export function listar() {
  return ler().propostas;
}

/**
 * Salva a proposta no topo. Se já existir uma com o mesmo conteúdo, ela é
 * atualizada no lugar (e mantém o nome do cliente que já tinha).
 */
export function salvar(entrada) {
  const dados = ler();
  const assinatura = assinar(entrada);
  const anterior = dados.propostas.find((p) => assinar(p) === assinatura);

  const nova = {
    ...entrada,
    id: anterior?.id ?? novoId(),
    salvoEm: new Date().toISOString(),
    cliente: entrada.cliente || anterior?.cliente || "",
  };

  dados.propostas = [nova, ...dados.propostas.filter((p) => p.id !== nova.id)]
    .slice(0, MAX_PROPOSTAS);

  return gravar(dados) ? nova : null;
}

/** O nome do cliente é digitado depois de calcular; isto acerta o registro. */
export function atualizarCliente(id, cliente) {
  const dados = ler();
  const alvo = dados.propostas.find((p) => p.id === id);
  if (!alvo) return false;
  alvo.cliente = cliente;
  return gravar(dados);
}

export function obter(id) {
  return ler().propostas.find((p) => p.id === id) ?? null;
}

export function limpar() {
  try {
    localStorage.removeItem(CHAVE);
    return true;
  } catch {
    return false;
  }
}
