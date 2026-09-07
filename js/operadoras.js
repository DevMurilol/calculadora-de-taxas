// Registro das operadoras de pagamento que atuam no Brasil.
//
// Esta é a única fonte de verdade sobre operadoras. Para incluir uma nova,
// basta acrescentar um objeto em OPERADORAS — nenhum HTML ou CSS precisa mudar.
//
// Sobre as cores: as cinco primeiras (Stone, Cielo, Rede, GetNet, PagBank) são
// exatamente os gradientes que já existiam em styles.css. As demais são
// aproximações da identidade visual de cada marca e podem ser ajustadas aqui.
//
// Sobre "tipo": serve apenas para agrupar a lista no seletor. Não é uma
// classificação regulatória.
//
// Não guardamos taxas padrão por operadora de propósito: MDR e RAV são
// negociados caso a caso e mudam com frequência. Quem digita é o usuário.

const BANDA_DEBITO = { id: "debito", rotulo: "Débito" };

// A maioria das operadoras cota o parcelado em quatro faixas.
const FAIXA_CHEIA = [
  { id: "avista", rotulo: "Crédito à vista", de: 1, ate: 1 },
  { id: "p2a6", rotulo: "Crédito 2x a 6x", de: 2, ate: 6 },
  { id: "p7a12", rotulo: "Crédito 7x a 12x", de: 7, ate: 12 },
  { id: "p13a18", rotulo: "Crédito 13x a 18x", de: 13, ate: 18 },
];

// Stone e Ton trabalham com uma faixa única de 7x a 18x.
const FAIXA_7A18 = [
  { id: "avista", rotulo: "Crédito à vista", de: 1, ate: 1 },
  { id: "p2a6", rotulo: "Crédito 2x a 6x", de: 2, ate: 6 },
  { id: "p7a18", rotulo: "Crédito 7x a 18x", de: 7, ate: 18 },
];

export const OPERADORAS = [
  // --- Adquirentes -------------------------------------------------------
  {
    id: "stone",
    nome: "Stone",
    tipo: "adquirente",
    cor: { de: "#005C39", ate: "#03C379" },
    textoClaro: true,
    bandas: FAIXA_7A18,
  },
  {
    id: "cielo",
    nome: "Cielo",
    tipo: "adquirente",
    cor: { de: "#000000", ate: "#494949" },
    textoClaro: true,
    bandas: FAIXA_CHEIA,
  },
  {
    id: "rede",
    nome: "Rede",
    tipo: "adquirente",
    cor: { de: "#FF6200", ate: "#FF8F45" },
    textoClaro: true,
    bandas: FAIXA_CHEIA,
  },
  {
    id: "getnet",
    nome: "GetNet",
    tipo: "adquirente",
    cor: { de: "#681212", ate: "#ED5C5C" },
    textoClaro: true,
    bandas: FAIXA_CHEIA,
  },
  {
    id: "safrapay",
    nome: "SafraPay",
    tipo: "adquirente",
    cor: { de: "#0A2240", ate: "#2C4A7C" },
    textoClaro: true,
    bandas: FAIXA_CHEIA,
  },
  {
    id: "vero",
    nome: "Vero (Banrisul)",
    tipo: "adquirente",
    cor: { de: "#00539B", ate: "#3D8FD1" },
    textoClaro: true,
    bandas: FAIXA_CHEIA,
  },
  {
    id: "sipag",
    nome: "Sipag (Sicredi)",
    tipo: "adquirente",
    cor: { de: "#2E7D0F", ate: "#7CC142" },
    textoClaro: true,
    bandas: FAIXA_CHEIA,
  },
  {
    id: "banescard",
    nome: "Banese Card",
    tipo: "adquirente",
    cor: { de: "#00563F", ate: "#2E9E77" },
    textoClaro: true,
    bandas: FAIXA_CHEIA,
  },
  {
    id: "adiq",
    nome: "Adiq",
    tipo: "adquirente",
    cor: { de: "#1F2A44", ate: "#4A5B87" },
    textoClaro: true,
    bandas: FAIXA_CHEIA,
  },

  // --- Subadquirentes e facilitadores ------------------------------------
  {
    id: "pagbank",
    nome: "PagBank (PagSeguro)",
    tipo: "subadquirente",
    cor: { de: "#E4D249", ate: "#C8BE38" },
    textoClaro: false,
    bandas: FAIXA_CHEIA,
  },
  {
    id: "mercadopago",
    nome: "Mercado Pago",
    tipo: "subadquirente",
    cor: { de: "#009EE3", ate: "#5FC8F2" },
    textoClaro: true,
    bandas: FAIXA_CHEIA,
  },
  {
    id: "sumup",
    nome: "SumUp",
    tipo: "subadquirente",
    cor: { de: "#0B2C5E", ate: "#1E5AA8" },
    textoClaro: true,
    bandas: FAIXA_CHEIA,
  },
  {
    id: "infinitepay",
    nome: "InfinitePay",
    tipo: "subadquirente",
    cor: { de: "#3B1E8F", ate: "#7B5CE0" },
    textoClaro: true,
    bandas: FAIXA_CHEIA,
  },
  {
    id: "ton",
    nome: "Ton",
    tipo: "subadquirente",
    cor: { de: "#0B6E4F", ate: "#16C97F" },
    textoClaro: true,
    bandas: FAIXA_7A18,
  },
  {
    id: "picpay",
    nome: "PicPay",
    tipo: "subadquirente",
    cor: { de: "#0E8F45", ate: "#21C25E" },
    textoClaro: true,
    bandas: FAIXA_CHEIA,
  },
  {
    id: "pagarme",
    nome: "Pagar.me",
    tipo: "subadquirente",
    cor: { de: "#1B2A2F", ate: "#3E5C63" },
    textoClaro: true,
    bandas: FAIXA_CHEIA,
  },
  {
    id: "asaas",
    nome: "Asaas",
    tipo: "subadquirente",
    cor: { de: "#0B3F8F", ate: "#2F6FD0" },
    textoClaro: true,
    bandas: FAIXA_CHEIA,
  },
  {
    id: "adyen",
    nome: "Adyen",
    tipo: "subadquirente",
    cor: { de: "#0A7F3B", ate: "#0ABF53" },
    textoClaro: true,
    bandas: FAIXA_CHEIA,
  },
  {
    id: "stripe",
    nome: "Stripe",
    tipo: "subadquirente",
    cor: { de: "#4B45C6", ate: "#635BFF" },
    textoClaro: true,
    bandas: FAIXA_CHEIA,
  },

  // --- Escape para o restante do mercado ---------------------------------
  {
    id: "outra",
    nome: "Outra operadora",
    tipo: "outra",
    cor: { de: "#68683F", ate: "#C0C791" },
    textoClaro: false,
    bandas: FAIXA_CHEIA,
    nomeLivre: true, // o usuário digita o nome
  },
];

export const GRUPOS = [
  { tipo: "adquirente", rotulo: "Adquirentes" },
  { tipo: "subadquirente", rotulo: "Subadquirentes e facilitadores" },
  { tipo: "outra", rotulo: "Outra" },
];

export { BANDA_DEBITO };

export function obterOperadora(id) {
  return OPERADORAS.find((o) => o.id === id) ?? OPERADORAS[0];
}

/** Nome a exibir: o digitado, quando a operadora aceita nome livre. */
export function nomeExibido(operadora, nomeLivre) {
  if (operadora.nomeLivre && nomeLivre.trim() !== "") return nomeLivre.trim();
  return operadora.nome;
}
