const BTN_APAGAR = document.getElementById("btn_apagar");
const TABELA = document.getElementById("tabela");

BTN_APAGAR.onclick = function(){
	if(confirm("Tem certeza que deseja apagar os jogadores do localStorage?")){
		localStorage.clear();
		/*Essa solução simplesmente apaga a tabela criada 
		automaticamente que está dentro da 
		div com id = tabela. Me parece ser a melhor opção. Outra solução seria usar ajax, 
		porém não sei fazer isso nesse momento.*/
		$("#tabela").empty();
		
		/*
		Essa solução funciona, porém recarrega toda a página, fazendo um nova requisição.
			location.reload();*/
		/*
		A solução usando a linha abaixo não funciona.
			tabela.appendChild(criarTabela(itensTabelaLocalStorage()));*/
		console.log("localStorage: " + localStorage);
	}else{
		console.log("Clicou no botão CANCELAR");
	}
}

window.onload = function(){
  TABELA.appendChild(criarTabela(itensTabelaLocalStorage()));
}

function criarTabela(conteudo) {
	var tabela = document.createElement("table");
	var thead = document.createElement("thead");
	var tbody=document.createElement("tbody");
	var thd=function(i){
		return (i == 0) ? "th" : "td";
	};
	for (var i = 0; i < conteudo.length; i++) {
		var tr = document.createElement("tr");
		for(var o = 0; o < conteudo[i].length; o++){
			var t = document.createElement(thd(i));
			var texto = document.createTextNode(conteudo[i][o]);
			t.appendChild(texto);
			tr.appendChild(t);
		}
		(i == 0) ? thead.appendChild(tr) : tbody.appendChild(tr);
	}
	tabela.appendChild(thead);
	tabela.appendChild(tbody);
	return tabela;
}

/**
Essa função retorna uma matriz, como a matriz de exemplo abaixo.
@return [
			["nome", "pontuacao"],
			["matheus",  16],
			["cristian", 16],
			["pedro",    10],
			["henrique", 10]
		];
*/
function itensTabelaLocalStorage(){
	var jogadores = [];
	var placar = [];
	var jsonJogadores = localStorage.getItem("jogadores");
	if(jsonJogadores != null){
		jogadores = JSON.parse(jsonJogadores);
		jogadores.sort(comparePontuacao);
		placar[0] = Object.keys(jogadores[0]);
		for(var l = 0; l < jogadores.length; l++){
			placar[l+1] = Object.values(jogadores[l]);
		}		
	}
	return placar;
}

function comparePontuacao(a,b) {
  if (a.pontuacao < b.pontuacao)
     return 1;
  if (a.pontuacao > b.pontuacao)
    return -1;
  return 0;
}