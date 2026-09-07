// Menu de navegação. O painel usa o atributo `hidden` em vez de style.display,
// então o estado fica no DOM e não no CSS inline.

(function () {
  const botao = document.getElementById("menuBotao");
  const painel = document.getElementById("menu");
  if (!botao || !painel) return;

  const icone = botao.querySelector(".material-symbols-outlined");

  function alternar(abrir) {
    painel.hidden = !abrir;
    botao.setAttribute("aria-expanded", String(abrir));
    botao.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
    if (icone) icone.textContent = abrir ? "close" : "menu";
  }

  botao.addEventListener("click", (e) => {
    e.stopPropagation();
    alternar(painel.hidden);
  });

  // clicar em qualquer lugar fora fecha
  document.addEventListener("click", (e) => {
    if (!painel.hidden && !painel.contains(e.target)) alternar(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !painel.hidden) {
      alternar(false);
      botao.focus();
    }
  });

  alternar(false);
})();
