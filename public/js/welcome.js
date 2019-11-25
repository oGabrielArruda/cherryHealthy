$(document).ready(function(){
	start();
});

function start() {
	var url = 'http://localhost:3000/usuarioPerfil/';
    $.getJSON(url, function (result) { // pega as informações do nutricionista
    var arr = result;      
	$("#welcome").text("Bem-vindo " + arr[0].nome + "!"); // exibe a mensagem de bem vindo com o nome do usuário
	});
}