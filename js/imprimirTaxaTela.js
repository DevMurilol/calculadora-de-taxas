export default function imprimeTela(taxa, taxaMdrDebito, btn) {
  const resultadosDiv = [document.getElementById("resultados"), document.getElementById("resultadosConcorrencia")];
  const concorrenciaBtnEfetiva = document.querySelector("#concorrenciaBtnEfetiva")

  for (let i = 0; i < 2; i++) {
    if (i == 0) {
      resultadosDiv[i].innerHTML = `<h2 class="resultados__titulo"> Stone </h2>`;
    } else {
      resultadosDiv[i].innerHTML = `<h2 class="resultados__titulo"> Outra </h2>`;
    }
    resultadosDiv[i].innerHTML += `<p class="resultados__texto">Débito: ${taxaMdrDebito[i].toFixed(2)}%</p>`;
    for (let j = 0; j < 18; j++) {
      resultadosDiv[i].innerHTML += `<p class="resultados__texto">`+(j+1)+`x: ${taxa[i][
        j
      ].toFixed(2)}%</p>`;
    }
    if (btn == concorrenciaBtnEfetiva ){
        resultadosDiv[1].innerHTML = `<h2 class="resultados__titulo"> Outra </h2>`;
    
    resultadosDiv[1].innerHTML += `<p class="resultados__texto">Débito: ${taxaMdrDebito[2].toFixed(2)}%</p>`;
    for (let j = 0; j < 18; j++) {
        resultadosDiv[1].innerHTML += `<p class="resultados__texto">`+(j+1)+`x: ${taxa[2][
          j
        ].toFixed(2)}%</p>`;
      }
    }
  }
}