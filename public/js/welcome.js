$(document).ready(function(){
	start();
});

function start() {
	var url = 'http://localhost:3000/usuarioPerfil/';
    $.getJSON(url, function (result) {
    var arr = result;      
	$("#welcome").text("Bem-vindo " + arr[0].nome + "!");
	});
}