const FUNDO_TELA = document.querySelector('#fundo_tela');
const CONTEINER_VENCEU = document.querySelector('.conteiner_venceu');
const BTN_REINICIAR = document.querySelector('.reiniciar');
const BTN_REGISTRAR_JOGADOR = document.getElementById("btn_registrarJogador");
const NUMERO_PONTOS = document.getElementById("numeroPontos");
const TEXTO_PROGRESS_BAR = document.getElementById("textoProgressBar");
const PROGRESSO = document.getElementById("progresso");
const BARRA_PROGRESSO_CONTAINER = document.getElementById("barra_progresso_container");
const TEXTO_PROGRESSO = document.getElementById("textoProgresso");
const COR_BRANCO = '#FFFFFF';
const CORES = ['#FF0000', '#0000FF', '#FFFF00', '#00FF00', '#800080', '#FFC0CB'];
const TAMANHO_NOME = 15;
const MAX_PONTOS = 1000;

var nivelDificuldade = [10,10,10,10,10];
var pontos = 0;
var sequencia = [];
var indice = 0;

window.onload = function(){
  console.log("carregou...");
  sequencia = geraSeguenciaEmbaralhada();
  pontos = MAX_PONTOS;
  reinicia();
  CONTEINER_VENCEU.style.display = 'none';
}

BTN_REINICIAR.onclick = function(){
    CONTEINER_VENCEU.style.display = 'none';
	BARRA_PROGRESSO_CONTAINER.style.display = 'initial';
	TEXTO_PROGRESSO.style.display = 'initial';
	BTN_REGISTRAR_JOGADOR.style.display = 'initial';
    resetarNivelDificuldade();
    pontos = MAX_PONTOS;
	reinicia();
	sequencia = geraSeguenciaEmbaralhada();
	NUMERO_PONTOS.innerHTML = pontos;
	try{
	    Android.androidToast("Jogo Reiniciado!");
	}catch(err){
	}
}

function botaoFunction(numButton){
	botao = document.querySelector('#btn_' + numButton);
	if (numButton == sequencia[indice]) {
		mudaCorFundoTela(CORES[numButton-1]);
		botao.style.display = 'none';
		indice += 1;
		configuraProgresso(indice);
	}else{
	    console.log("indice: " + indice);
	    pontos = pontos - (nivelDificuldade[indice] * (indice + 1));
		NUMERO_PONTOS.innerHTML = pontos;
		aumentaPerdaDePontos(indice);
		reinicia();

        if(pontos <= 0){
            alert("O Jogo será Reiniciado, pontuação mínima atingida.");
            BTN_REINICIAR.click();
        }
		console.log(pontos);
	}

	if(indice == 6){
		console.log("Venceu... Pontos: " + pontos);
		BARRA_PROGRESSO_CONTAINER.style.display = 'none';
        TEXTO_PROGRESSO.style.display = 'none';
        CONTEINER_VENCEU.style.display = 'initial';
	}
}

function calculaProgresso(acertos){
	return (((acertos) * 100) / 6).toFixed(2);
}

function configuraProgresso(acertos){
	progress = calculaProgresso(acertos)
	PROGRESSO.style.width = progress + "%";
	TEXTO_PROGRESS_BAR.innerHTML = progress + "%";
}

function geraSeguenciaEmbaralhada() {
	const sequencia = [1,2,3,4,5,6];
    for (var i = sequencia.length - 1; i > 0; i--) {
        var p = Math.floor(Math.random() * (i + 1));
        var temp = sequencia[i];
        sequencia[i] = sequencia[p];
        sequencia[p] = temp;
    }
    console.log(sequencia);
    return sequencia;
}

function coresBotoes(){
	for (var i = 1; i <= 6 ; i++) {
		btn = document.querySelector('#btn_' + i);
        btn.style.backgroundColor = CORES[i-1];
	}
}

function mudaCorFundoTela(cor){
	FUNDO_TELA.style.backgroundColor = cor;
}

function exibirBotoes(){
	for (var i = 1; i <= 6 ; i++) {
		botao = document.querySelector('#btn_'+ i);
        botao.style.display = 'initial';
	}
}

function reinicia(){
	mudaCorFundoTela(COR_BRANCO);
	coresBotoes();
	exibirBotoes();
	indice = 0;
	configuraProgresso(indice);
	console.log(sequencia);
}

function resetarNivelDificuldade(){
    for(var i =0; i < nivelDificuldade.length; i++) {
        nivelDificuldade[i] = 10;
        console.log("jogoDaMemoria.js - resetarNivelDificuldade(): " + i + ", " + nivelDificuldade[i]);
    }
}

function aumentaPerdaDePontos(indice){
    nivelDificuldade[indice] = nivelDificuldade[indice] + 10;
}

function registrarJogadorFunction(){
    console.log("Clicou no botao registrar jogador");

    var nomeJogador = prompt("Digite o nome do jogador.","");
    //var nomeJogador = Android.androidAlertDialog("Novo Jogador", "Digite o nome do jogador", "Registrar", "Cancelar");

    //Verifica se clicou no botão CANCELAR
    if (nomeJogador == null) {
        console.log("Clicou no botão CANCELAR: " + nomeJogador);
    }else if(nomeJogador.length == 0){
        console.log("Campo vazio");
        alert("Campo vazio. Tente novamente!");
    }else if(nomeJogador.length > TAMANHO_NOME){
		alert("O nome, não pode ter mais de " + TAMANHO_NOME + " caracteres. Tente novamente!");
	}else{
		nomeJogador = nomeJogador.toUpperCase();
        salvarJogadorNoLocalStorage(nomeJogador, pontos);
    }
}

function salvarJogadorNoLocalStorage(nomeJogador, pontos){
    var jogador = {'nome': nomeJogador, 'pontuacao': pontos};
    var jogadores = [];
    if(localStorage.getItem("jogadores") == null){
        jogadores[0] = jogador;
        localStorage.setItem("jogadores", JSON.stringify(jogadores));
        BTN_REGISTRAR_JOGADOR.style.display = 'none';
    }else{
        jogadores = JSON.parse(localStorage.getItem("jogadores"));
        if(buscaBinaria(jogadores, nomeJogador) != -1){
            alert("O nome - " + nomeJogador + " - já está em uso. Tente novamente!");
        }else{
            jogadores[jogadores.length] = jogador;
            jogadores.sort(compareNome);
            console.log("jogadores: " + jogadores);
            console.log("jogadores: " + jogadores[0]["nome"]);
            localStorage.setItem("jogadores", JSON.stringify(jogadores));
            BTN_REGISTRAR_JOGADOR.style.display = 'none';
        }
    }
}

/**
@return -1 se não encontrar o elementoBuscado na listaDeElementos, caso contrário,
 retorna a posição do elementoBuscado na listaDeElementos*/
function buscaBinaria(listaDeElementos, elementoBuscado){
	console.log("listaDeElementos: " + listaDeElementos);
	var primeiro = 0;
	var ultimo = listaDeElementos.length -1;	
	while(primeiro <= ultimo){
		console.log("primeiro: " + primeiro);
		console.log("ultimo: " + ultimo);
		var meio = Math.trunc((primeiro + ultimo)/2);
		console.log("meio: " + meio);
		if(listaDeElementos[meio]["nome"] == elementoBuscado){
			return meio;
		}else if(elementoBuscado < listaDeElementos[meio]["nome"]){
			ultimo = meio -1;
		}else{
			primeiro = meio + 1;
		}
	}
	return -1;
}

function compareNome(a,b) {
  if (a.nome < b.nome)
     return -1;
  if (a.nome > b.nome)
    return 1;
  return 0;
}