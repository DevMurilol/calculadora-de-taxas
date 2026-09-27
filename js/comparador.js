import {
  OPERADORAS,
  GRUPOS,
  obterOperadora,
  nomeExibido,
  bandasAte,
  rotuloBanda,
} from "./operadoras.js";
import { montarProposta, resumoTexto, tituloProposta, notaCobertura } from "./proposta.js";
import {
  gerarArquivo,
  podeCompartilharArquivo,
  baixar,
  linkCanal,
} from "./documento.js";
import * as armazem from "./armazenamento.js";
import {
  calcularTaxas,
  lerTaxa,
  taxaValida,
  formatarTaxa,
  formatarDiferenca,
  rotuloParcela,
  limitesPossiveis,
  ajustarLimite,
  LIMITE_PADRAO,
} from "./calculo.js";

const esc = (s) => String(s).replace(/[&<>"]/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// --- estado ---------------------------------------------------------------
// Tudo que a tela precisa saber mora aqui. Nada é lido de volta do CSS.

const criarLado = (operadoraId) => ({
  operadoraId,
  nomeLivre: "",
  efetiva: false, // true = usuário digita a taxa efetiva pronta
  valores: {},
});

const estado = {
  modo: "comparar", // "unica" | "comparar"
  limite: LIMITE_PADRAO, // até quantas parcelas a proposta é apresentada
  a: criarLado("stone"),
  b: criarLado("cielo"),
  resultado: null,
};

const ladosVisiveis = () => (estado.modo === "unica" ? ["a"] : ["a", "b"]);

// --- campos de cada lado --------------------------------------------------

// Campo opcional pode ficar em branco: quem tem a taxa efetiva pronta nem
// sempre tem todas as faixas — a concorrente costuma parcelar em menos vezes.
function camposDe(lado) {
  if (lado.efetiva) {
    return [
      { chave: "debito", rotulo: "Débito", opcional: true },
      ...Array.from({ length: estado.limite }, (_, i) => ({
        chave: `p${i + 1}`,
        rotulo: rotuloParcela(i + 1),
        opcional: true,
      })),
    ];
  }
  const op = obterOperadora(lado.operadoraId);
  return [
    { chave: "debito", rotulo: "Débito", opcional: true },
    // o MDR de cada banda alimenta a fórmula: sem ele não há o que calcular
    ...bandasAte(op, estado.limite).map((b) => ({
      chave: b.id,
      rotulo: rotuloBanda(b, estado.limite),
    })),
    { chave: "rav", rotulo: "Taxa de antecipação (RAV)" },
  ];
}

const preenchido = (lado, chave) => (lado.valores[chave] ?? "").trim() !== "";

/** Até quantas parcelas este lado tem taxa efetiva digitada. */
function ateOndeVai(lado) {
  for (let n = estado.limite; n >= 1; n--) {
    if (preenchido(lado, `p${n}`)) return n;
  }
  return 0;
}

/**
 * Problemas do lado, já com o motivo: o aviso muda conforme o caso.
 * "buraco" é parcela vazia no meio da sequência — só o fim da lista pode
 * ficar em branco, senão a tabela sai com furo.
 */
function problemasDe(lado) {
  const problemas = [];

  camposDe(lado).forEach(({ chave, opcional }) => {
    if (!preenchido(lado, chave)) {
      if (!opcional) problemas.push({ chave, tipo: "vazio" });
      return;
    }
    if (!taxaValida(lerTaxa(lado.valores[chave]))) problemas.push({ chave, tipo: "invalido" });
  });

  if (!lado.efetiva) return problemas;

  const ate = ateOndeVai(lado);
  if (ate === 0 && !preenchido(lado, "debito")) {
    return [{ chave: "p1", tipo: "nenhuma" }];
  }
  for (let n = 1; n <= ate; n++) {
    if (!preenchido(lado, `p${n}`)) problemas.push({ chave: `p${n}`, tipo: "buraco" });
  }
  return problemas;
}

function resultadoDe(lado) {
  const num = (k) => {
    const valor = lerTaxa(lado.valores[k] ?? "");
    return taxaValida(valor) ? valor : null;
  };

  if (lado.efetiva) {
    return {
      debito: num("debito"),
      parcelas: Array.from({ length: ateOndeVai(lado) }, (_, i) => num(`p${i + 1}`)),
    };
  }
  const op = obterOperadora(lado.operadoraId);
  const valores = {};
  bandasAte(op, estado.limite).forEach((b) => (valores[b.id] = num(b.id)));
  return calcularTaxas({
    bandas: op.bandas,
    valores,
    rav: num("rav"),
    debito: num("debito"),
    limite: estado.limite,
  });
}

// --- render: seletores e campos ------------------------------------------

function opcoesOperadora(selecionadaId) {
  return GRUPOS.map((g) => {
    const itens = OPERADORAS.filter((o) => o.tipo === g.tipo)
      .map((o) => `<option value="${o.id}"${o.id === selecionadaId ? " selected" : ""}>${esc(o.nome)}</option>`)
      .join("");
    return `<optgroup label="${esc(g.rotulo)}">${itens}</optgroup>`;
  }).join("");
}

function renderLado(chaveLado) {
  const lado = estado[chaveLado];
  const op = obterOperadora(lado.operadoraId);
  const nome = nomeExibido(op, lado.nomeLivre);
  const idBase = `lado-${chaveLado}`;

  const campos = camposDe(lado)
    .map(({ chave, rotulo, opcional }) => {
      const id = `${idBase}-${chave}`;
      return `
        <div class="campo">
          <label class="campo__rotulo" for="${id}">${esc(rotulo)}</label>
          <div class="campo__entrada">
            <input class="campo__input" id="${id}" data-lado="${chaveLado}" data-chave="${chave}"
                   type="text" inputmode="decimal" autocomplete="off"
                   placeholder="${opcional ? "—" : "0,00"}" value="${esc(lado.valores[chave] ?? "")}">
            <span class="campo__sufixo" aria-hidden="true">%</span>
          </div>
        </div>`;
    })
    .join("");

  const dicaEfetiva = lado.efetiva
    ? `<p class="lado__dica">Preencha só até onde tiver taxa — as parcelas em branco
         ficam de fora da comparação.</p>`
    : "";

  const nomeLivre = op.nomeLivre
    ? `<div class="campo campo--texto">
         <label class="campo__rotulo" for="${idBase}-nome">Nome da operadora</label>
         <input class="campo__input campo__input--texto" id="${idBase}-nome"
                data-lado="${chaveLado}" data-nome-livre type="text" autocomplete="off"
                placeholder="Digite o nome" value="${esc(lado.nomeLivre)}">
       </div>`
    : "";

  return `
    <section class="lado" style="--marca-de:${op.cor.de};--marca-ate:${op.cor.ate}">
      <div class="lado__marca" aria-hidden="true"></div>
      <div class="lado__topo">
        <label class="lado__rotulo" for="${idBase}-operadora">
          ${chaveLado === "a" ? "Operadora" : "Comparar com"}
        </label>
        <select class="lado__select" id="${idBase}-operadora" data-lado="${chaveLado}" data-operadora>
          ${opcoesOperadora(lado.operadoraId)}
        </select>
      </div>
      ${nomeLivre}
      <label class="chave">
        <input type="checkbox" data-lado="${chaveLado}" data-efetiva ${lado.efetiva ? "checked" : ""}>
        <span>Já tenho a taxa efetiva pronta</span>
      </label>
      ${dicaEfetiva}
      <div class="campos">${campos}</div>
    </section>`;
}

// O fundo desta página usa as cores da operadora: quem propõe à esquerda,
// a concorrente à direita. Os cards seguem no bege, que é o que dá o
// contraste. As mesmas variáveis alimentam a faixa sob o cabeçalho.
function renderTema() {
  const a = obterOperadora(estado.a.operadoraId);
  const b = obterOperadora(estado.b.operadoraId);
  const raiz = document.documentElement.style;

  raiz.setProperty("--tema-de", a.cor.de);
  raiz.setProperty("--tema-ate", estado.modo === "unica" ? a.cor.ate : b.cor.ate);
  // marcas claras (PagBank, por exemplo) pedem texto escuro sobre o fundo
  raiz.setProperty("--tema-tinta", a.textoClaro ? "#FFFFFF" : "#2A2118");

  document.body.classList.add("corpo--marca");
}

function renderLimite() {
  const select = document.getElementById("limite");
  select.innerHTML = limitesPossiveis()
    .map((n) => `<option value="${n}"${n === estado.limite ? " selected" : ""}>${n}x</option>`)
    .join("");
}

function render() {
  document.getElementById("lados").innerHTML = ladosVisiveis().map(renderLado).join("");
  document.querySelectorAll("[data-modo]").forEach((r) => (r.checked = r.value === estado.modo));
  renderLimite();
  renderTema();
}

// --- render: resultado ----------------------------------------------------

// A tela mostra exatamente a proposta que vira documento — assim não há como
// a tabela e o arquivo enviado ao cliente discordarem.
function renderResultado() {
  const saida = document.getElementById("saida");
  const p = propostaAtual();

  if (!p.comparacao) {
    saida.innerHTML = `
      <h2 class="saida__titulo" tabindex="-1">${esc(p.nomeA)}</h2>
      <div class="tabela-rolagem">
        <table class="tabela">
          <thead><tr><th scope="col">Parcela</th><th scope="col">Taxa efetiva</th></tr></thead>
          <tbody>${p.linhas
            .map((l) => `<tr><th scope="row">${l.rotulo}</th><td>${formatarTaxa(l.a)}</td></tr>`)
            .join("")}</tbody>
        </table>
      </div>`;
    return;
  }

  const corpo = p.linhas
    .map((l) => {
      const classe = l.dif < 0 ? "e-melhor" : l.dif > 0 ? "e-pior" : "";
      return `<tr>
        <th scope="row">${l.rotulo}</th>
        <td>${formatarTaxa(l.a)}</td>
        <td>${formatarTaxa(l.b)}</td>
        <td class="dif ${classe}">${formatarDiferenca(l.dif)}</td>
      </tr>`;
    })
    .join("");

  const nota = notaCobertura(p);

  saida.innerHTML = `
    <h2 class="saida__titulo" tabindex="-1">${esc(chamadaDoTitulo(p))}</h2>
    <div class="tabela-rolagem">
      <table class="tabela">
        <thead><tr>
          <th scope="col">Parcela</th>
          <th scope="col">${esc(p.nomeA)}</th>
          <th scope="col">${esc(p.nomeB)}</th>
          <th scope="col">Diferença</th>
        </tr></thead>
        <tbody>${corpo}</tbody>
      </table>
    </div>
    <p class="legenda">
      ${nota ? `${esc(nota)}<br>` : ""}
      Diferença em pontos percentuais, ${esc(p.nomeA)} menos ${esc(p.nomeB)}.
      Negativo (verde) = ${esc(p.nomeA)} tem a menor taxa na faixa.
    </p>`;
}

const chamadaDoTitulo = (p) =>
  p.comparaveis === 0
    ? `Proposta ${p.nomeA}`
    : `${p.nomeA} tem a menor taxa em ${p.vitoriasA} de ${p.comparaveis} faixas`;

// --- ações ----------------------------------------------------------------

// Um aviso por vez, o do problema mais específico: dizer "faltam 3 taxas"
// quando o caso é um buraco no meio da lista só faz o usuário procurar.
// O campo que recebe o foco é o mesmo que o aviso descreve.
const ORDEM_PROBLEMAS = ["buraco", "nenhuma", "invalido", "vazio"];

const problemaPrincipal = (problemas) =>
  problemas.reduce((melhor, p) =>
    ORDEM_PROBLEMAS.indexOf(p.tipo) < ORDEM_PROBLEMAS.indexOf(melhor.tipo) ? p : melhor);

function avisoDe(problema, quantos) {
  if (problema.tipo === "buraco") {
    return `Faltou a taxa de ${problema.chave.slice(1)}x. Preencha as parcelas em ` +
      "sequência — só o fim da lista pode ficar em branco.";
  }
  if (problema.tipo === "nenhuma") return "Preencha ao menos uma taxa efetiva.";
  if (problema.tipo === "invalido") return "Revise as taxas destacadas: use números entre 0 e 100.";
  return quantos === 1
    ? "Falta preencher 1 taxa (use números entre 0 e 100)."
    : `Faltam preencher ${quantos} taxas (use números entre 0 e 100).`;
}

function calcular() {
  document.querySelectorAll(".campo__input").forEach((i) => i.classList.remove("invalido"));
  document.getElementById("aviso").textContent = "";

  const pendentes = ladosVisiveis().flatMap((k) =>
    problemasDe(estado[k]).map((p) => ({ ...p, id: `lado-${k}-${p.chave}` })));

  if (pendentes.length > 0) {
    pendentes.forEach(({ id }) => document.getElementById(id)?.classList.add("invalido"));
    const principal = problemaPrincipal(pendentes);
    document.getElementById("aviso").textContent = avisoDe(principal, pendentes.length);
    document.getElementById(principal.id)?.focus();
    estado.resultado = null;
    document.getElementById("saida").innerHTML = "";
    mostrarEnvio(false);
    return;
  }

  estado.resultado = {
    a: resultadoDe(estado.a),
    b: estado.modo === "comparar" ? resultadoDe(estado.b) : null,
  };
  renderResultado();
  mostrarEnvio(true);
  guardarProposta();

  const titulo = document.querySelector(".saida__titulo");
  titulo?.scrollIntoView({ behavior: "smooth", block: "start" });
  titulo?.focus({ preventScroll: true });
}

// --- eventos --------------------------------------------------------------

// O resultado exibido vira documento e vai para o cliente. Qualquer mudança
// no formulário o torna desatualizado, então ele é descartado na hora — nunca
// deixamos nome novo com número velho.
function limparResultado() {
  if (!estado.resultado) return;
  estado.resultado = null;
  document.getElementById("saida").innerHTML = "";
  mostrarEnvio(false);
}

const lados = document.getElementById("lados");

lados.addEventListener("input", (e) => {
  const el = e.target;
  const lado = estado[el.dataset.lado];
  if (!lado) return;
  if (el.dataset.chave) {
    lado.valores[el.dataset.chave] = el.value;
    el.classList.remove("invalido");
  } else if (el.hasAttribute("data-nome-livre")) {
    lado.nomeLivre = el.value;
  } else {
    return;
  }
  limparResultado();
});

lados.addEventListener("change", (e) => {
  const el = e.target;
  const lado = estado[el.dataset.lado];
  if (!lado) return;
  if (el.hasAttribute("data-operadora")) {
    lado.operadoraId = el.value;
  } else if (el.hasAttribute("data-efetiva")) {
    lado.efetiva = el.checked;
  } else {
    return;
  }
  limparResultado();
  render();
});

document.querySelectorAll("[data-modo]").forEach((radio) =>
  radio.addEventListener("change", () => {
    estado.modo = radio.value;
    limparResultado();
    render();
  })
);

// Mudar o limite muda quais campos são pedidos, então o formulário é redesenhado.
// O que já foi digitado acima do limite continua guardado no estado: se o usuário
// voltar para 18x, os valores reaparecem.
document.getElementById("limite").addEventListener("change", (e) => {
  estado.limite = ajustarLimite(Number(e.target.value));
  limparResultado();
  render();
});

document.getElementById("calcular").addEventListener("click", calcular);

// --- envio da proposta ----------------------------------------------------

const envio = document.getElementById("envio");
const estadoEnvio = document.getElementById("envioEstado");
const dicaEnvio = document.getElementById("dicaEnvio");
const btCompartilhar = document.getElementById("compartilhar");
const btBaixar = document.getElementById("baixar");

const formatoEscolhido = () =>
  document.querySelector('input[name="formato"]:checked').value;

function avisar(texto, erro = false) {
  estadoEnvio.textContent = texto;
  estadoEnvio.classList.toggle("envio__estado--erro", erro);
}

function propostaAtual() {
  const opA = obterOperadora(estado.a.operadoraId);
  const opB = obterOperadora(estado.b.operadoraId);
  return montarProposta({
    cliente: document.getElementById("cliente").value,
    nomeA: nomeExibido(opA, estado.a.nomeLivre),
    nomeB: estado.modo === "comparar" ? nomeExibido(opB, estado.b.nomeLivre) : null,
    corA: opA.cor,
    corB: estado.modo === "comparar" ? opB.cor : null,
    resultado: estado.resultado,
  });
}

// Roda a ação desabilitando o botão, para não gerar o documento duas vezes.
async function comBotao(botao, rotulo, acao) {
  const original = botao.textContent;
  botao.disabled = true;
  botao.textContent = rotulo;
  try {
    await acao();
  } catch (e) {
    if (e?.name !== "AbortError") avisar(e.message || "Não foi possível gerar o documento.", true);
  } finally {
    botao.disabled = false;
    botao.textContent = original;
  }
}

btCompartilhar.addEventListener("click", () =>
  comBotao(btCompartilhar, "Gerando…", async () => {
    if (!estado.resultado) return;
    const p = propostaAtual();
    const arquivo = await gerarArquivo(p, formatoEscolhido());

    if (podeCompartilharArquivo(arquivo)) {
      await navigator.share({
        files: [arquivo],
        title: `Proposta de taxas — ${tituloProposta(p)}`,
        text: p.cliente ? `Proposta de taxas para ${p.cliente}.` : "Proposta de taxas.",
      });
      avisar("Compartilhado.");
      return;
    }

    // Sem Web Share (desktop, em geral): baixa o arquivo para o usuário anexar.
    baixar(arquivo);
    avisar(
      `Este navegador não anexa arquivos direto. Baixamos "${arquivo.name}" — ` +
        "anexe no WhatsApp Web, no e-mail ou onde preferir."
    );
  })
);

btBaixar.addEventListener("click", () =>
  comBotao(btBaixar, "Gerando…", async () => {
    if (!estado.resultado) return;
    const arquivo = await gerarArquivo(propostaAtual(), formatoEscolhido());
    baixar(arquivo);
    avisar(`Salvo como "${arquivo.name}".`);
  })
);

document.querySelectorAll("[data-canal]").forEach((botao) =>
  botao.addEventListener("click", () => {
    if (!estado.resultado) return;
    const p = propostaAtual();
    const assunto = p.cliente
      ? `Proposta de taxas — ${p.cliente}`
      : `Proposta de taxas — ${tituloProposta(p)}`;
    window.open(linkCanal(botao.dataset.canal, resumoTexto(p), assunto), "_blank", "noopener");
    avisar("Resumo em texto aberto no aplicativo escolhido.");
  })
);

// A dica depende do aparelho: só o celular costuma anexar pela folha nativa.
function renderDicaEnvio() {
  const teste = new File(["x"], "t.png", { type: "image/png" });
  dicaEnvio.textContent = podeCompartilharArquivo(teste)
    ? "Abre a tela de compartilhamento do aparelho, com o arquivo já anexado — escolha WhatsApp, e-mail ou mensagem por lá."
    : "Neste navegador o arquivo é baixado para você anexar. WhatsApp, e-mail e SMS por link só levam texto, sem anexo.";
}

function mostrarEnvio(visivel) {
  envio.hidden = !visivel;
  if (visivel) renderDicaEnvio();
  avisar("");
}

// --- últimas propostas ----------------------------------------------------

const historico = document.getElementById("historico");
const historicoLista = document.getElementById("historicoLista");
const campoCliente = document.getElementById("cliente");

// id da proposta gravada no último cálculo, para casar o nome do cliente
// (que é digitado depois) com o registro certo
let propostaSalvaId = null;

// Guarda só os campos que a operadora escolhida realmente usa: sobras de uma
// troca de operadora fariam duas propostas iguais parecerem diferentes.
function instantaneoLado(lado) {
  const valores = {};
  camposDe(lado).forEach(({ chave }) => {
    valores[chave] = lado.valores[chave] ?? "";
  });
  return {
    operadoraId: lado.operadoraId,
    nomeLivre: lado.nomeLivre,
    efetiva: lado.efetiva,
    valores,
  };
}

function guardarProposta() {
  if (!armazem.disponivel()) return;
  const salva = armazem.salvar({
    cliente: campoCliente.value.trim(),
    modo: estado.modo,
    limite: estado.limite,
    a: instantaneoLado(estado.a),
    b: instantaneoLado(estado.b),
  });
  propostaSalvaId = salva?.id ?? null;
  renderHistorico();
}

function rotuloProposta(p) {
  const nomeA = nomeExibido(obterOperadora(p.a.operadoraId), p.a.nomeLivre);
  if (p.modo !== "comparar") return nomeA;
  return `${nomeA} × ${nomeExibido(obterOperadora(p.b.operadoraId), p.b.nomeLivre)}`;
}

function quando(iso) {
  const d = new Date(iso);
  const dois = (n) => String(n).padStart(2, "0");
  const hora = `${dois(d.getHours())}:${dois(d.getMinutes())}`;
  const hoje = new Date();
  const mesmoDia = d.toDateString() === hoje.toDateString();
  return mesmoDia ? `hoje ${hora}` : `${dois(d.getDate())}/${dois(d.getMonth() + 1)} ${hora}`;
}

function renderHistorico() {
  if (!armazem.disponivel()) {
    historico.hidden = true;
    return;
  }
  const propostas = armazem.listar();
  historico.hidden = propostas.length === 0;

  historicoLista.innerHTML = propostas
    .map((p) => {
      const rotulo = rotuloProposta(p);
      const titulo = p.cliente || rotulo;
      const detalhe = p.cliente ? `${rotulo} · ${quando(p.salvoEm)}` : quando(p.salvoEm);
      return `<li>
        <button class="historico__abrir" type="button" data-abrir="${esc(p.id)}">
          <span class="historico__nome">${esc(titulo)}</span>
          <span class="historico__meta">${esc(detalhe)}</span>
        </button>
      </li>`;
    })
    .join("");
}

function aplicarProposta(id) {
  const p = armazem.obter(id);
  if (!p) return;

  estado.modo = p.modo;
  estado.limite = ajustarLimite(p.limite); // propostas antigas não guardavam o limite
  estado.a = { ...criarLado(p.a.operadoraId), ...p.a, valores: { ...p.a.valores } };
  estado.b = { ...criarLado(p.b.operadoraId), ...p.b, valores: { ...p.b.valores } };
  campoCliente.value = p.cliente ?? "";
  propostaSalvaId = p.id;

  render();
  calcular(); // reabrir uma proposta já mostra o resultado
}

historicoLista.addEventListener("click", (e) => {
  const botao = e.target.closest("[data-abrir]");
  if (botao) aplicarProposta(botao.dataset.abrir);
});

document.getElementById("limparHistorico").addEventListener("click", () => {
  armazem.limpar();
  propostaSalvaId = null;
  renderHistorico();
});

// o nome do cliente é digitado depois do cálculo — acerta o registro salvo
campoCliente.addEventListener("input", () => {
  if (!propostaSalvaId) return;
  armazem.atualizarCliente(propostaSalvaId, campoCliente.value.trim());
  renderHistorico();
});

render();
renderHistorico();
