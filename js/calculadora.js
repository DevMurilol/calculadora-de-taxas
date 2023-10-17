import imprimeTela from "./imprimirTaxaTela.js";

const btnCalcular = document.querySelectorAll(".calculadora__botao");
const calcularBtn = document.querySelector("#botaoCalcular");
const concorrenciaBtn = document.querySelector("#concorrenciaBtn");
const concorrenciaBtnEfetiva = document.querySelector(
  "#concorrenciaBtnEfetiva"
);
const resultadosConcorrencia = document.getElementById("resultadosConcorrencia");

const debitoTaxaEfetiva = document.querySelector("#taxaMdrDebitoEfetiva");

btnCalcular.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.textContent == "Calcular") {
      if (
        btn == calcularBtn ||
        btn == concorrenciaBtn ||
        btn == concorrenciaBtnEfetiva
      ) {
        calculadora(btn);
        ocultarCalculadora();
      }
    }
    else{
      continuar();
      resultadosConcorrencia.style.display = "flex";
    }
  });
});

function calculadora(btn) {
  let taxa = [[new Array(18)], [new Array(18)], [new Array(18)]];
  let taxaMdrDebito = new Array(3);
  let taxaMdrCreditoAvista = new Array(2);
  let taxaMdrCredito2a6 = new Array(2);
  let taxaMdrCredito7a18 = new Array(2);
  let taxaAntecipacao = new Array(2);
  let Mdr;
  const taxaMdrCreditoConcorrencia12a18 = parseFloat(
    document.getElementById("taxaMdrCredito12a18").value
  );
  for (var i = 0; i < 2; i++) {
    taxaMdrDebito[i] = parseFloat(
      document.getElementById("taxaMdrDebito-" + i).value
    );
    taxaMdrCreditoAvista[i] = parseFloat(
      document.getElementById("taxaMdrCreditoAvista-" + i).value
    );
    taxaMdrCredito2a6[i] = parseFloat(
      document.getElementById("taxaMdrCredito2a6-" + i).value
    );
    taxaMdrCredito7a18[i] = parseFloat(
      document.getElementById("taxaMdrCredito7a18-" + i).value
    );
    taxaAntecipacao[i] = parseFloat(
      document.getElementById("taxaAntecipacao-" + i).value
    );
    var contador = 0;
    for (var j = 0; j < 18; j++) {
      contador += 1 * j + 1;
      if (j == 0) {
        Mdr = taxaMdrCreditoAvista[i];
      } else {
        if (j > 0 && j < 6) {
          Mdr = taxaMdrCredito2a6[i];
        } else {
          if (i == 0) {
            Mdr = taxaMdrCredito7a18[i];
          } else {
            if (j <= 11) {
              Mdr = taxaMdrCredito7a18[i];
            } else {
              Mdr = taxaMdrCreditoConcorrencia12a18;
            }
          }
        }
      }

      taxa[i][j] =
        ((100 - Mdr) / (j + 1)) * ((taxaAntecipacao[i] / 100) * contador) + Mdr;
    }
  }
  for (var k = 0; k < 18; k++) {
    taxa[2][k] = parseFloat(
      document.getElementById("taxaEfetiva" + (k + 1) + "x").value
    );
    taxaMdrDebito[2] = parseFloat(debitoTaxaEfetiva.value);
  }
  imprimeTela(taxa, taxaMdrDebito, btn);
}
function comparaTaxa() {
  const compararBtn = document.querySelector("#compararBtn");
  compararBtn.addEventListener("click", () => {
    if(calcularBtn.textContent == "Calcular"){
      calcularBtn.textContent = "Continuar";
    }
    else{
      calcularBtn.textContent = "Calcular";
    }
    
  });
}
comparaTaxa();

