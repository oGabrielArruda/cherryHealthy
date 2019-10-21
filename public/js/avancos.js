var url = "http://localhost:3000/usuarioPerfil/"

$(document).ready(function(){
    valorIMC();
    peso();
});


function valorIMC(){
    var peso;
    var altura;
    var imc;
    $.getJSON(url, function(result){
        var arr = result;
        peso = parseInt(arr[0].peso);
        altura = parseInt(arr[0].altura);

        var imc = peso / (altura*altura);
        var situacao;
        if(peso < 15.5)
            situacao = 'Muito abaixo do ideal';
        if(peso < 18.5)
            situacao = "Abaixo do ideal";
        if(imc < 24.9)
            situacao = 'Normal';
        else if(imc < 29.9)
            situacao = 'Levemente acima';
        else if(imc < 34.9)
            situacao = 'Obesidade grau I'
        else if(imc < 39.9)
            situacao = 'Obesidade grau II';
        else 
            situacao = 'Obesidade mórbida';

        var cor;
        if(imc < 15.5 || imc > 29.9 )
            cor = "#ff0000";
        else if(imc < 18.5 || imc > 24.9)
            cor = "#5ab4e8";
        else 
            cor = "#2ef21f";

        exibirSituacao(situacao, cor);
    });
}

function peso(){
    $.getJSON(url, function(result){
        var arr = result;
        $("#txtPeso").val(arr[0].peso);
    });
}

function exibirSituacao(situacao, cor){
    $(".valorIMC").html(situacao);

    var rgbaCol = 'rgba(' + parseInt(cor.slice(-6,-4),16)
    + ',' + parseInt(cor.slice(-4,-2),16)
    + ',' + parseInt(cor.slice(-2),16)
    +',0.5)';
    $('.imc').css('background-color', rgbaCol)
}