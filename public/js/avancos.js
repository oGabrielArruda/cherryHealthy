var url = "http://localhost:3000/usuarioPerfil/"

$(document).ready(function(){ // quando a página é carregada
    valorIMC(); // responsável por exibir a situação do imc na página
    peso(); // exibe o peso do usuário
    pontuacao(); // exibe a pontuação
});


function valorIMC(){
    var peso;
    var altura;
    var imc;
    $.getJSON(url, function(result){ // pega o json da rota 'usuarioPerfil'
        var arr = result;
        peso = parseFloat(arr[0].peso); // pega o peso
        altura = parseFloat(arr[0].altura); // pega a altura
 
        var imc = peso / (altura*altura); // cálculo do imc
        console.log(imc);
        var situacao;
        // pra diferentes valores do imc, seta a variavel situacao
        if(imc < 15.5)
            situacao = 'Muito abaixo do ideal';
        else if(imc < 18.5)
            situacao = "Abaixo do ideal";
        else if(imc < 24.9)
            situacao = 'Normal';
        else if(imc < 29.9)
            situacao = 'Levemente acima';
        else if(imc < 34.9)
            situacao = 'Obesidade grau I'
        else if(imc < 39.9)
            situacao = 'Obesidade grau II';
        else 
            situacao = 'Obesidade mórbida';

        // para diferentes valores, seta-se uma cor diferente, para ser exibida com a situacao
        // vermelha para uma situacao ruim, azul para um media, e verde para uma boa
        var cor;
        if(imc < 15.5 || imc > 29.9 )
            cor = "#ff0000";
        else if(imc < 18.5 || imc > 24.9)
            cor = "#5ab4e8";
        else 
            cor = "#2ef21f";

        exibirSituacao(situacao, cor); // exibe a situacao do imc com a string situacao e a cor
    });
}

function peso(){ // exibe o peso do usuário
    $.getJSON(url, function(result){ // pega o json do usuário logado
        var arr = result;
        $("#txtPeso").val(arr[0].peso); // coloca-se no input o valor de seu peso
    });
}

function exibirSituacao(situacao, cor){ // exibe a situação com as variáveis vindas do parâmetro
    $(".valorIMC").html(situacao); // exibe o texto da situacao

    var rgbaCol = 'rgba(' + parseInt(cor.slice(-6,-4),16) // exibe a cor
    + ',' + parseInt(cor.slice(-4,-2),16)
    + ',' + parseInt(cor.slice(-2),16)
    +',0.5)';
    $('.imc').css('background-color', rgbaCol)
}

function pontuacao(){ // exibe a pontuacao
    $.getJSON(url, function(result){   // seleciona-se o usuário
        var arr = result;
        $("#txtPonts").val(arr[0].Pontuação); // coloca-se no input o valor da sua pontuacao
    });
}