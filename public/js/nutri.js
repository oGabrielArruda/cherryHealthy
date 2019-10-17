$(document).ready(function(){
    exibir();
});

function exibir(){
    var url = 'http://localhost:3000/infoNutri';
    $.getJSON(url, function(result){
        var arr = result;
        $("#cod").val(arr[0].codNutricionista);
        $("#name").val(arr[0].nome);
        $("#email").val(arr[0].email);
        $("#telefone").val(arr[0].telefone);
    });
}