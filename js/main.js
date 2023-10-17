const botaoTaxaEfetiva = document.getElementById("botaoTaxaEfetiva");
const botaoComparar = document.getElementById("botaoComparar");
const ocultaTaxaConcorrencia = document.getElementById("calculadoraConcorrencia");
const corpo = document.getElementById("corpo");
const resultados = document.getElementById("resultados");
const resultadosConcorrencia = document.getElementById(
  "resultadosConcorrencia"
);
const oculta = document.getElementById("calculadora");
const itens = document.getElementById("itens");
const taxaStoneBtn = document.querySelector('#taxa__botao-stone');
const taxaEfetivaConcorrencia = document.getElementById(
    "taxaEfetivaConcorrencia"
  );
const taxaEfetivaBtn = document.querySelector('#taxaEfetivaBtn');
const inputNomeConcorrencia = document.querySelector("#nomeConcorrencia"); 
let nomeConcorrencia =  document.querySelector("#nomeConcorrencia");



function ocultarCalculadora() {
  const calculadora = document.getElementById("calculadora");
  calculadora.style.display = "none";
  const ocultaLogo = document.getElementById("logo");
  ocultaLogo.style.display = "none";
  const mostra = document.getElementById("Voltar");
  mostra.classList.remove("oculto");
  const ocultaTaxa = document.getElementById("taxa-concorrencia");
  ocultaTaxa.classList.add("oculto");
  ocultaTaxaConcorrencia.style.display = "none";
  const calculadoraContainer = document.getElementById(
    "taxaEfetivaConcorrencia"
  );
  calculadoraContainer.style.display = "none";
}

function mostrar() {
  location.reload();
}

function mostraBotaoConcorrencia() {
   
    taxaStoneBtn.addEventListener('click', () => {
        if (taxaStoneBtn.checked == false) {
            botaoComparar.style.display = "flex";
            oculta.style.display = "flex";
            ocultaTaxaConcorrencia.style.display = "none";
            corpo.classList.remove("concorrencia");
            itens.classList.remove("concorrencia");
            resultados.style.display = "flex";
            resultadosConcorrencia.style.display = "none";
            botaoTaxaEfetiva.style.display = "none";
            taxaEfetivaConcorrencia.style.display = "none";
            taxaEfetivaBtn.checked = false
            corpo.style.background = `var(--stone)`;

          } else {
            botaoComparar.style.display = "none";
            const oculta = document.getElementById("calculadora");
            oculta.style.display = "none";
            ocultaTaxaConcorrencia.style.display = "flex";
            corpo.classList.add("concorrencia");
            itens.classList.add("concorrencia");
            resultados.style.display = "none";
            resultadosConcorrencia.style.display = "flex";
            botaoTaxaEfetiva.style.display = "flex";
          }
    })
        
}
mostraBotaoConcorrencia();
function mudaFundo(){
    
    inputNomeConcorrencia.addEventListener('blur', () =>{
    
    var corConcorrencia = "concorrencia";
    const verificadorNomeConcorrencia = nomeConcorrencia.value.toLowerCase();
     if (verificadorNomeConcorrencia == "getnet" || verificadorNomeConcorrencia == "pagseguro" || verificadorNomeConcorrencia == "pag seguro" || verificadorNomeConcorrencia == "stone" || verificadorNomeConcorrencia == "cielo" ){
    corConcorrencia = verificadorNomeConcorrencia;
     }
     if(verificadorNomeConcorrencia == "cielo" ){
        corpo.style.color = "#FFFFFF"
     }
     else{
        corpo.style.color = "#000000"
     }
     corpo.style.background = `var(--${corConcorrencia})`;    
     if (verificadorNomeConcorrencia == "antiga"){
        corpo.style.background = `var(--stone)`;       
     }
    })
}
mudaFundo();
function mostraBotaoCalcular() {
  const calcular = document.getElementById("botaoCalcular");
  const resultadosConcorrencia = document.getElementById(
    "resultadosConcorrencia"
  );
  if (calcular.style.display == "none") {
    calcular.style.display = "block";
    resultadosConcorrencia.style.display = "none";
  } else {
    calcular.style.display = "none";
    resultadosConcorrencia.style.display = "flex";
  }
}

function continuar() {
  const oculta = document.getElementById("calculadora");
  oculta.classList.add("oculto");
  const mostra = document.getElementById("calculadoraConcorrencia");
  mostra.classList.remove("oculto");
  const corpo = document.getElementById("corpo");
  corpo.classList.add("concorrencia");
  const itens = document.getElementById("itens");
  itens.classList.add("concorrencia");
  const botaoStone = document.getElementById("taxaStone");
  botaoStone.style.display = "none";
  const botaoComparar = document.getElementById("botaoComparar");
  botaoComparar.style.display = "none";
  botaoTaxaEfetiva.style.display = "flex";
}

function mostraTaxaEfetiva() {
  const calculadoraContainer = document.getElementById(
    "calculadoraConcorrencia"
  );
  taxaEfetivaBtn.addEventListener("click", () => {
    calculadora.style.display = "none";
    if (taxaEfetivaBtn.checked == false) {
      calculadoraContainer.style.display = "flex";
      taxaEfetivaConcorrencia.style.display = "none";
    
    } else {
      calculadoraContainer.style.display = "none";
      taxaEfetivaConcorrencia.style.display = "flex";
    }
  });
}
mostraTaxaEfetiva();
