
function calculadora() {
    var taxa = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]];
    const taxaMdrDebito = parseFloat(document.getElementById('taxaMdrDebito').value);
    const taxaMdrCreditoAvista = parseFloat(document.getElementById('taxaMdrCreditoAvista').value);
    const taxaMdrCredito2a6 = parseFloat(document.getElementById('taxaMdrCredito2a6').value);
    const taxaMdrCredito7a18 = parseFloat(document.getElementById('taxaMdrCredito7a18').value);
    const taxaAntecipacao = parseFloat(document.getElementById('taxaAntecipacao').value);

    const taxaMdrDebitoConcorrencia = parseFloat(document.getElementById('taxaMdrDebitoConcorrencia').value);
    const taxaMdrCreditoConcorrenciaAvista = parseFloat(document.getElementById('taxaMdrCreditoConcorrenciaAvista').value);
    const taxaMdrCreditoConcorrencia2a6 = parseFloat(document.getElementById('taxaMdrCreditoConcorrencia2a6').value);
    const taxaMdrCreditoConcorrencia7a18 = parseFloat(document.getElementById('taxaMdrCreditoConcorrencia7a18').value);
    const taxaAntecipacaoConcorrencia = parseFloat(document.getElementById('taxaAntecipacaoConcorrencia').value);

    for (var i = 0; i < 2; i++) {
        var contador = 0;
        for (var j = 0; j < 18; j++) {
            contador += 1 * j + 1;
            if (j == 0) {
                if (i == 0) {
                    Mdr = taxaMdrCreditoAvista;
                }
                else {
                    Mdr = taxaMdrCreditoConcorrenciaAvista;
                }
            }
            else {
                if (j > 0 && j < 6) {
                    if (i == 0) {
                        Mdr = taxaMdrCredito2a6;
                    }
                    else {
                        Mdr = taxaMdrCreditoConcorrencia2a6;
                    }
                }
                else {
                    if (i == 0) {
                        Mdr = taxaMdrCredito7a18;
                    }
                    else {
                        Mdr = taxaMdrCreditoConcorrencia7a18;
                    }
                }
            }
            if (i == 0) {
                Antecipacao = taxaAntecipacao;
            }
            else {
                Antecipacao = taxaAntecipacaoConcorrencia;
            }

            taxa[i][j] = ((100 - Mdr) / (j + 1)) * ((Antecipacao / 100) * contador) + Mdr;


        }

    }

    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = `
<h2 class="resultados__titulo"> Stone </h2>
<p class="resultados__texto">Débito: ${taxaMdrDebito.toFixed(2)}%</p>
<p class="resultados__texto">1x: ${taxa[0][0].toFixed(2)}%</p>
<p class="resultados__texto">2x: ${taxa[0][1].toFixed(2)}%</p>
<p class="resultados__texto">3x: ${taxa[0][2].toFixed(2)}%</p>
<p class="resultados__texto">4x: ${taxa[0][3].toFixed(2)}%</p>
<p class="resultados__texto">5x: ${taxa[0][4].toFixed(2)}%</p>
<p class="resultados__texto">6x: ${taxa[0][5].toFixed(2)}%</p>
<p class="resultados__texto">7x: ${taxa[0][6].toFixed(2)}%</p>
<p class="resultados__texto">8x: ${taxa[0][7].toFixed(2)}%</p>
<p class="resultados__texto">9x: ${taxa[0][8].toFixed(2)}%</p>
<p class="resultados__texto">10x: ${taxa[0][9].toFixed(2)}%</p>
<p class="resultados__texto">11x: ${taxa[0][10].toFixed(2)}%</p>
<p class="resultados__texto">12x: ${taxa[0][11].toFixed(2)}%</p>
<p class="resultados__texto">13x: ${taxa[0][12].toFixed(2)}%</p>
<p class="resultados__texto">14x: ${taxa[0][13].toFixed(2)}%</p>
<p class="resultados__texto">15x: ${taxa[0][14].toFixed(2)}%</p>
<p class="resultados__texto">16x: ${taxa[0][15].toFixed(2)}%</p>
<p class="resultados__texto">17x: ${taxa[0][16].toFixed(2)}%</p> 
<p class="resultados__texto">18x: ${taxa[0][17].toFixed(2)}%</p> 
`;

    const resultadosConcorrenciaDiv = document.getElementById('resultadosConcorrencia');
    resultadosConcorrenciaDiv.innerHTML = `
<h2 class="resultados__titulo"> Outra </h2>
<p class="resultados__texto">Débito: ${taxaMdrDebitoConcorrencia.toFixed(2)}%</p>
<p class="resultados__texto">1x: ${taxa[1][0].toFixed(2)}%</p>
<p class="resultados__texto">2x: ${taxa[1][1].toFixed(2)}%</p>
<p class="resultados__texto">3x: ${taxa[1][2].toFixed(2)}%</p>
<p class="resultados__texto">4x: ${taxa[1][3].toFixed(2)}%</p>
<p class="resultados__texto">5x: ${taxa[1][4].toFixed(2)}%</p>
<p class="resultados__texto">6x: ${taxa[1][5].toFixed(2)}%</p>
<p class="resultados__texto">7x: ${taxa[1][6].toFixed(2)}%</p>
<p class="resultados__texto">8x: ${taxa[1][7].toFixed(2)}%</p>
<p class="resultados__texto">9x: ${taxa[1][8].toFixed(2)}%</p>
<p class="resultados__texto">10x: ${taxa[1][9].toFixed(2)}%</p>
<p class="resultados__texto">11x: ${taxa[1][10].toFixed(2)}%</p>
<p class="resultados__texto">12x: ${taxa[1][11].toFixed(2)}%</p>
<p class="resultados__texto">13x: ${taxa[1][12].toFixed(2)}%</p>
<p class="resultados__texto">14x: ${taxa[1][13].toFixed(2)}%</p>
<p class="resultados__texto">15x: ${taxa[1][14].toFixed(2)}%</p>
<p class="resultados__texto">16x: ${taxa[1][15].toFixed(2)}%</p>
<p class="resultados__texto">17x: ${taxa[1][16].toFixed(2)}%</p> 
<p class="resultados__texto">18x: ${taxa[1][17].toFixed(2)}%</p> 
`;
}

function ocultar() {
    const oculta = document.getElementById('calculadora');
    oculta.classList.add('oculto');
    const ocultaLogo = document.getElementById('logo');
    ocultaLogo.classList.add('oculto');
    const mostra = document.getElementById('Voltar');
    mostra.classList.remove('oculto');
    const ocultaTaxa = document.getElementById('taxa-concorrencia');
    ocultaTaxa.classList.add('oculto');
    const ocultaConcorrencia = document.getElementById('calculadoraConcorrencia');
    ocultaConcorrencia.classList.add('oculto');
}

function mostrar() {
    location.reload();
}

function mostraBotaoConcorrencia() {
    const botaoComparar = document.getElementById('botaoComparar');
    const ocultaTaxa = document.getElementById('calculadoraConcorrencia');
    const corpo = document.getElementById('corpo');
    const resultados = document.getElementById('resultados');
    const resultadosConcorrencia = document.getElementById('resultadosConcorrencia');
    const itens = document.getElementById('itens');
    if (botaoComparar.style.display == "none") {
        botaoComparar.style.display = "flex"
        const oculta = document.getElementById('calculadora');
        oculta.classList.remove('oculto')
        ocultaTaxa.classList.add('oculto');
        corpo.classList.remove('concorrencia');
        itens.classList.remove('concorrencia');
        resultados.style.display = "flex";
        resultadosConcorrencia.style.display = "none"
    }
    else {
        botaoComparar.style.display = "none"
        const oculta = document.getElementById('calculadora');
        oculta.classList.add('oculto');
        ocultaTaxa.classList.remove('oculto');
        corpo.classList.add('concorrencia');
        itens.classList.add('concorrencia');
        resultados.style.display = "none";
        resultadosConcorrencia.style.display = "flex"
    }
}
function mostraBotaoCalcular() {
    const calcular = document.getElementById('botaoCalcular');
    const continuar = document.getElementById('botaoContinuar');
    const resultadosConcorrencia = document.getElementById('resultadosConcorrencia');
    if (calcular.style.display == "none") {
        calcular.style.display = "block"
        continuar.style.display = "none"
        resultadosConcorrencia.style.display = "none";
    }
    else {
        calcular.style.display = "none"
        continuar.style.display = "block"
        resultadosConcorrencia.style.display = "flex"

    }
}
function continuar() {
    const oculta = document.getElementById('calculadora');
    oculta.classList.add('oculto');
    const mostra = document.getElementById('calculadoraConcorrencia');
    mostra.classList.remove('oculto');
    const corpo = document.getElementById('corpo');
    corpo.classList.add('concorrencia');
    const itens = document.getElementById('itens');
    itens.classList.add('concorrencia')
    const ocultaTaxa = document.getElementById('taxa-concorrencia');
    ocultaTaxa.classList.add('oculto');

}

function clickMenu() {
    const itens = document.getElementById('itens');
    const menu = document.getElementById('menuHamburguer')

    if (itens.style.display == "block"){
        itens.style.display = "none"
        menu.style.color = "#FFFFFF"
    }
    else{
        itens.style.display = "block";
        menu.style.color = "#000000"

    }
}
function escondeMenu() {

    const itens = document.getElementById('itens');
    const menu = document.getElementById('menuHamburguer')

    if (itens.style.display == "block"){
        itens.style.display = "none"
        menu.style.color = "#FFFFFF"
    }
}
function calcularProgramada() {
    const resultados = document.getElementById('resultadosAntecipacaoProgramada')
    var d = document.getElementById('dataVenda').value;
    var [ano, mes, dia] = d.split('-').map(Number);
    resultados.innerHTML = '<p>Ano escolhido: ' + ano + '</p> <br>' + '<p> Mês escolhido: ' + mes + '</p> <br>' + '<p> Dia escolhido: ' + dia + '</p> <br>';
}
function calcularTaxaProgramada() {
    const resultados = document.getElementById('resultadosAntecipacaoProgramada')
    const contadorChecked = document.querySelectorAll('.dias-semana__botao:checked').length;
    var ravResultante, diaProporcional;
    var datasProgramadas = new Array(contadorChecked);
    var d = document.getElementById('dataVenda').value;
    var [ano, mes, dia] = d.split('-').map(Number);
    var contador = 0;
    const taxaRav = parseFloat(document.getElementById('taxaAntecipacao').value);
    resultados.innerHTML = '';
    for (var i = 1; i < 31; i++) {

        if (document.getElementById('diasSemana' + i + '').checked) {
            datasProgramadas[contador] = i;
            contador++;
        }
    }

    for (let j = 0; j <= contadorChecked - 1; j++) {
        if (dia < datasProgramadas[j]) {
            diaProporcional = 31 - (datasProgramadas[j] - dia);
            if (diaProporcional < 0) {
                diaProporcional = 0;
            }
            ravResultante = (taxaRav / 30) * (diaProporcional);
            j = contadorChecked;
        }


    }
    if (dia >= datasProgramadas[contadorChecked - 1]) {
        if (mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10 || mes == 12) {
            diaProporcional = 30 - (31 - dia + datasProgramadas[0]);
            if (diaProporcional < 0) {
                diaProporcional = 0;
            }
            ravResultante = (taxaRav / 30) * diaProporcional;

        }
        else {
            if (ano % 4 == 0 && mes == 1) {
                diaProporcional = 30 - (29 - dia + datasProgramadas[0]);
                if (diaProporcional < 0) {
                    diaProporcional = 0;
                }
                ravResultante = (taxaRav / 30) * diaProporcional;

            }
            else {
                if (ano % 4 !== 0 && mes == 1) {
                    diaProporcional = 30 - (28 - dia + datasProgramadas[0]);
                    if (diaProporcional < 0) {
                        diaProporcional = 0;
                    }
                    ravResultante = (taxaRav / 30) * diaProporcional;
                }
            }
            if (mes == 4 || mes == 6 || mes == 9 || mes == 11) {
                diaProporcional = 30 - (30 - dia + datasProgramadas[0]);
                if (diaProporcional < 0) {
                    diaProporcional = 0;
                }
                ravResultante = (taxaRav / 30) * diaProporcional;

            }
        }
    }

    var taxa = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]];
    const taxaMdrDebito = parseFloat(document.getElementById('taxaMdrDebito').value);
    const taxaMdrCreditoAvista = parseFloat(document.getElementById('taxaMdrCreditoAvista').value);
    const taxaMdrCredito2a6 = parseFloat(document.getElementById('taxaMdrCredito2a6').value);
    const taxaMdrCredito7a18 = parseFloat(document.getElementById('taxaMdrCredito7a18').value);
    var somatorio = 0

    for (var l = 0; l < 18; l++) {
        somatorio += ravResultante + taxaRav*l
        if (l == 0) {
            Mdr = taxaMdrCreditoAvista;

        }
        else {
            if (l > 0 && l < 6) {

                Mdr = taxaMdrCredito2a6;


            }
            else {
                Mdr = taxaMdrCredito7a18;
            }

        }
        taxa[l] = ((100 - Mdr) / (l + 1))*somatorio/100 + Mdr;


    }

    resultados.innerHTML = `
<h2 class="resultados__titulo"> Stone </h2>
<p class="resultados__texto">Débito: ${taxaMdrDebito.toFixed(2)}%</p>
<p class="resultados__texto">1x: ${taxa[0].toFixed(2)}%</p>
<p class="resultados__texto">2x: ${taxa[1].toFixed(2)}%</p>
<p class="resultados__texto">3x: ${taxa[2].toFixed(2)}%</p>
<p class="resultados__texto">4x: ${taxa[3].toFixed(2)}%</p>
<p class="resultados__texto">5x: ${taxa[4].toFixed(2)}%</p>
<p class="resultados__texto">6x: ${taxa[5].toFixed(2)}%</p>
<p class="resultados__texto">7x: ${taxa[6].toFixed(2)}%</p>
<p class="resultados__texto">8x: ${taxa[7].toFixed(2)}%</p>
<p class="resultados__texto">9x: ${taxa[8].toFixed(2)}%</p>
<p class="resultados__texto">10x: ${taxa[9].toFixed(2)}%</p>
<p class="resultados__texto">11x: ${taxa[10].toFixed(2)}%</p>
<p class="resultados__texto">12x: ${taxa[11].toFixed(2)}%</p>
<p class="resultados__texto">13x: ${taxa[12].toFixed(2)}%</p>
<p class="resultados__texto">14x: ${taxa[13].toFixed(2)}%</p>
<p class="resultados__texto">15x: ${taxa[14].toFixed(2)}%</p>
<p class="resultados__texto">16x: ${taxa[15].toFixed(2)}%</p>
<p class="resultados__texto">17x: ${taxa[16].toFixed(2)}%</p> 
<p class="resultados__texto">18x: ${taxa[17].toFixed(2)}%</p> 
`;
}
function simular() {
    const taxaPraticada = document.getElementById('taxaPraticada').value;
    const valorReceber = document.getElementById('valorReceber').value;
    const resultados = document.getElementById('resultadosSimulador')
    const valorCobrado = (valorReceber/ (1 - taxaPraticada/100));
    resultados.innerHTML ='Valor a ser Cobrado: ' + valorCobrado.toFixed(2) + ' Reais';
}
