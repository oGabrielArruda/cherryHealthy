$(document).ready(function(){
    exibir();
});

function exibir(){ // exibe as informacoes do nutricionista
    var url = 'http://localhost:3000/infoNutri';
    $.getJSON(url, function(result){ // pega o json com os dados do nutricionista
        var arr = result;   
        $("#cod").val(arr[0].codNutricionista); // exibe os valores do nutricionista nos inputs da página
        $("#name").val(arr[0].nome);
        $("#email").val(arr[0].email);
        $("#telefone").val(arr[0].telefone);
    });
}