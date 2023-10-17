function mudaSimulacao() {
    const simuladorTaxaAplicada = document.querySelector(
      "#simuladorDeTaxaAplicada"
    );
    const simuladorDeVendas = document.querySelector("#simuladorDeVendas");
    const resultados = document.getElementById("resultadosSimulador");
    resultados.innerHTML = "";
    if (simuladorDeVendas.style.display == "none") {
      simuladorTaxaAplicada.style.display = "none";
      simuladorDeVendas.style.display = "flex";
    } else {
      simuladorTaxaAplicada.style.display = "flex";
      simuladorDeVendas.style.display = "none";
    }
  }
  function simular() {
    const taxaPraticada = document.getElementById("taxaPraticada").value;
    const valorReceber = document.getElementById("valorReceber").value;
    const valorRecebido = document.querySelector("#valorRecebido").value;
    const valorCobrado = document.querySelector("#valorCobrado").value;
    const resultados = document.getElementById("resultadosSimulador");
    const simuladorTaxaAplicada = document.querySelector(
      "#simuladorDeTaxaAplicada"
    );
    const valorAplicado = valorReceber / (1 - taxaPraticada / 100);
    const taxaAplicada = ((valorCobrado - valorRecebido) * 100) / valorCobrado;
    if (simuladorTaxaAplicada.style.display == "flex") {
      resultados.innerHTML =
        "Taxa Aplicada foi de: " + taxaAplicada.toFixed(2) + "%";
    } else {
      resultados.innerHTML =
        "Valor a ser Cobrado: " + valorAplicado.toFixed(2) + " Reais";
    }
  }
  