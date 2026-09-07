// Gera o documento da proposta em imagem (Canvas, sem dependência) ou em PDF
// (jsPDF, carregado só quando o usuário pede PDF — assim os ~350 KB nunca
// pesam para quem só compartilha imagem).

import { formatarTaxa, formatarDiferenca } from "./calculo.js";
import { tituloProposta, chamada, nomeArquivo } from "./proposta.js";

const JSPDF_CDN = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";

const hexParaRGB = (hex) => {
  const h = hex.replace("#", "").trim();
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [
    parseInt(n.slice(0, 2), 16),
    parseInt(n.slice(2, 4), 16),
    parseInt(n.slice(4, 6), 16),
  ];
};

// aceita "#RRGGBB" e "rgb(r, g, b)" — o registro usa as duas formas
function corParaRGB(cor) {
  if (cor.startsWith("#")) return hexParaRGB(cor);
  const m = cor.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : [0, 0, 0];
}

const rgbCss = ([r, g, b]) => `rgb(${r}, ${g}, ${b})`;

// ---------------------------------------------------------------- imagem

const IMG = {
  largura: 760,
  margem: 36,
  alturaCabecalho: 104,
  alturaLinha: 34,
  escala: 2, // desenha em 2x para não sair borrado em tela retina
};

function colunas(p) {
  const util = IMG.largura - IMG.margem * 2;
  if (!p.comparacao) return [{ x: 0, w: util * 0.45 }, { x: util * 0.45, w: util * 0.55 }];
  return [
    { x: 0, w: util * 0.19 },
    { x: util * 0.19, w: util * 0.27 },
    { x: util * 0.46, w: util * 0.27 },
    { x: util * 0.73, w: util * 0.27 },
  ];
}

export async function gerarImagem(p) {
  if (document.fonts?.ready) await document.fonts.ready;

  const cols = colunas(p);
  const topoTabela = IMG.alturaCabecalho + 76;
  const altura = topoTabela + IMG.alturaLinha * (p.linhas.length + 1) + 72;

  const canvas = document.createElement("canvas");
  canvas.width = IMG.largura * IMG.escala;
  canvas.height = altura * IMG.escala;
  const ctx = canvas.getContext("2d");
  ctx.scale(IMG.escala, IMG.escala);
  ctx.textBaseline = "middle";

  // fundo
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, IMG.largura, altura);

  // faixa com as cores das operadoras
  const grad = ctx.createLinearGradient(0, 0, IMG.largura, 0);
  grad.addColorStop(0, rgbCss(corParaRGB(p.corA.de)));
  grad.addColorStop(1, rgbCss(corParaRGB(p.comparacao ? p.corB.ate : p.corA.ate)));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, IMG.largura, IMG.alturaCabecalho);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "700 27px Roboto, sans-serif";
  ctx.fillText(p.cliente || "Proposta de taxas", IMG.margem, 42);
  ctx.font = "400 16px Roboto, sans-serif";
  ctx.fillText(`${tituloProposta(p)}  ·  ${p.dataBR}`, IMG.margem, 72);

  // chamada
  ctx.fillStyle = "#2A2118";
  ctx.font = "700 18px Roboto, sans-serif";
  ctx.fillText(chamada(p), IMG.margem, IMG.alturaCabecalho + 34);

  const x0 = IMG.margem;
  const dir = (c) => x0 + c.x + c.w; // colunas de número alinham à direita

  // cabeçalho da tabela
  const yCab = topoTabela + IMG.alturaLinha / 2;
  const titulos = p.comparacao
    ? ["Parcela", p.nomeA, p.nomeB, "Diferença"]
    : ["Parcela", "Taxa efetiva"];
  ctx.font = "700 14px Roboto, sans-serif";
  ctx.fillStyle = "#7A6A55";
  titulos.forEach((t, i) => {
    ctx.textAlign = i === 0 ? "left" : "right";
    ctx.fillText(t, i === 0 ? x0 : dir(cols[i]), yCab);
  });

  ctx.strokeStyle = "#E6D9C4";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x0, topoTabela + IMG.alturaLinha);
  ctx.lineTo(IMG.largura - IMG.margem, topoTabela + IMG.alturaLinha);
  ctx.stroke();

  // linhas
  p.linhas.forEach((l, i) => {
    const y = topoTabela + IMG.alturaLinha * (i + 1);
    const meio = y + IMG.alturaLinha / 2;

    if (i % 2 === 1) {
      ctx.fillStyle = "#F7F1E6";
      ctx.fillRect(x0, y, IMG.largura - IMG.margem * 2, IMG.alturaLinha);
    }

    ctx.textAlign = "left";
    ctx.font = "700 15px Roboto, sans-serif";
    ctx.fillStyle = "#2A2118";
    ctx.fillText(l.rotulo, x0, meio);

    ctx.textAlign = "right";
    ctx.font = "400 15px Roboto, sans-serif";
    ctx.fillText(formatarTaxa(l.a), dir(cols[1]), meio);

    if (p.comparacao) {
      ctx.fillText(formatarTaxa(l.b), dir(cols[2]), meio);
      ctx.font = "700 15px Roboto, sans-serif";
      ctx.fillStyle = l.dif < 0 ? "#1F6B4A" : l.dif > 0 ? "#A33823" : "#7A6A55";
      ctx.fillText(formatarDiferenca(l.dif), dir(cols[3]), meio);
    }

    ctx.strokeStyle = "#E6D9C4";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x0, y + IMG.alturaLinha);
    ctx.lineTo(IMG.largura - IMG.margem, y + IMG.alturaLinha);
    ctx.stroke();
  });

  // rodapé
  ctx.textAlign = "left";
  ctx.font = "400 13px Roboto, sans-serif";
  ctx.fillStyle = "#7A6A55";
  const yPe = altura - 38;
  ctx.fillText(
    p.comparacao
      ? `Diferença em pontos percentuais (${p.nomeA} menos ${p.nomeB}).`
      : "Taxa efetiva por parcela.",
    x0,
    yPe
  );
  ctx.fillText("Simulação sujeita a confirmação. Gerado pela Calculadora de Taxas.", x0, yPe + 20);

  const blob = await new Promise((r) => canvas.toBlob(r, "image/png"));
  return new File([blob], nomeArquivo(p, "png"), { type: "image/png" });
}

// ------------------------------------------------------------------- pdf

let promessaJsPDF;

function carregarJsPDF() {
  if (window.jspdf?.jsPDF) return Promise.resolve(window.jspdf.jsPDF);
  if (!promessaJsPDF) {
    promessaJsPDF = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = JSPDF_CDN;
      s.onload = () =>
        window.jspdf?.jsPDF
          ? resolve(window.jspdf.jsPDF)
          : reject(new Error("Gerador de PDF carregou incompleto."));
      s.onerror = () => {
        promessaJsPDF = null;
        reject(new Error("Não foi possível baixar o gerador de PDF. Verifique a conexão."));
      };
      document.head.appendChild(s);
    });
  }
  return promessaJsPDF;
}

export async function gerarPDF(p) {
  const JsPDF = await carregarJsPDF();
  const doc = new JsPDF({ unit: "mm", format: "a4" });

  const M = 15;
  const L = 210;
  const util = L - M * 2;

  // faixa: metade com a cor de cada operadora
  const [ar, ag, ab] = corParaRGB(p.corA.ate);
  doc.setFillColor(ar, ag, ab);
  doc.rect(0, 0, p.comparacao ? L / 2 : L, 30, "F");
  if (p.comparacao) {
    const [br, bg, bb] = corParaRGB(p.corB.ate);
    doc.setFillColor(br, bg, bb);
    doc.rect(L / 2, 0, L / 2, 30, "F");
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(p.cliente || "Proposta de taxas", M, 14);
  doc.setFont("helvetica", "normal").setFontSize(11);
  doc.text(`${tituloProposta(p)}  ·  ${p.dataBR}`, M, 22);

  doc.setTextColor(42, 33, 24);
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.text(chamada(p), M, 42);

  const larguras = p.comparacao
    ? [util * 0.19, util * 0.27, util * 0.27, util * 0.27]
    : [util * 0.45, util * 0.55];
  const bordaDir = larguras.map((_, i) =>
    M + larguras.slice(0, i + 1).reduce((s, w) => s + w, 0)
  );

  let y = 54;
  const alturaLinha = 7.6;

  doc.setFontSize(9).setTextColor(122, 106, 85);
  const titulos = p.comparacao
    ? ["Parcela", p.nomeA, p.nomeB, "Diferença"]
    : ["Parcela", "Taxa efetiva"];
  titulos.forEach((t, i) =>
    i === 0 ? doc.text(t, M, y) : doc.text(t, bordaDir[i], y, { align: "right" })
  );

  y += 2.5;
  doc.setDrawColor(230, 217, 196).setLineWidth(0.5).line(M, y, L - M, y);

  doc.setFontSize(10);
  p.linhas.forEach((l, i) => {
    y += alturaLinha;

    if (i % 2 === 1) {
      doc.setFillColor(247, 241, 230);
      doc.rect(M, y - 5.2, util, alturaLinha, "F");
    }

    doc.setTextColor(42, 33, 24).setFont("helvetica", "bold");
    doc.text(l.rotulo, M, y);
    doc.setFont("helvetica", "normal");
    doc.text(formatarTaxa(l.a), bordaDir[1], y, { align: "right" });

    if (p.comparacao) {
      doc.text(formatarTaxa(l.b), bordaDir[2], y, { align: "right" });
      const c = l.dif < 0 ? [31, 107, 74] : l.dif > 0 ? [163, 56, 35] : [122, 106, 85];
      doc.setTextColor(...c).setFont("helvetica", "bold");
      // o "−" tipográfico não existe no WinAnsi do PDF; usa hífen comum
      doc.text(formatarDiferenca(l.dif).replace("−", "-"), bordaDir[3], y, { align: "right" });
    }
  });

  y += 12;
  doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(122, 106, 85);
  if (p.comparacao) {
    doc.text(`Diferença em pontos percentuais (${p.nomeA} menos ${p.nomeB}).`, M, y);
    y += 4.5;
  }
  doc.text("Simulação sujeita a confirmação. Gerado pela Calculadora de Taxas.", M, y);

  const blob = doc.output("blob");
  return new File([blob], nomeArquivo(p, "pdf"), { type: "application/pdf" });
}

// --------------------------------------------------------------- entrega

export const gerarArquivo = (p, formato) =>
  formato === "pdf" ? gerarPDF(p) : gerarImagem(p);

export function podeCompartilharArquivo(arquivo) {
  return Boolean(navigator.canShare?.({ files: [arquivo] }) && navigator.share);
}

export function baixar(arquivo) {
  const url = URL.createObjectURL(arquivo);
  const a = document.createElement("a");
  a.href = url;
  a.download = arquivo.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/** Links de texto. Nenhum deles aceita anexo — por isso mandam o resumo. */
export function linkCanal(canal, texto, assunto) {
  const t = encodeURIComponent(texto);
  if (canal === "whatsapp") return `https://wa.me/?text=${t}`;
  if (canal === "sms") return `sms:?&body=${t}`;
  return `mailto:?subject=${encodeURIComponent(assunto)}&body=${t}`;
}
