$(document).ready(function () {
    start();
    $(".btnSave").attr("disabled", true);

    $(".btnEdit").click(function(){
        $("#name").attr("readonly", false);
        $("#email").attr("readonly", false);
        $("#telefone").attr("readonly", false);
        $("#cpf").attr("readonly", false);
        $("#altura").attr("readonly", false);
        $("#peso").attr("readonly", false);
        $(".btnSave").attr("disabled", false);
    });
});

function start() {
    var url = 'http://localhost:3000/usuarioPerfil/';
    $.getJSON(url, function (result) {
        var arr = result;        
        $("#name").val(arr[0].nome);
        $("#email").val(arr[0].email);
        $("#telefone").val(arr[0].telefone);
        $("#cpf").val(arr[0].cpf);
        $("#peso").val(arr[0].peso);

        var altura = Math.round(arr[0].altura*100)/100;
        $("#altura").val(altura);

        
    });
}

function fMasc(objeto, mascara) {
    obj = objeto
    masc = mascara
    setTimeout("fMascEx()", 1)
}
function fMascEx() {
    obj.value = masc(obj.value)
}

function mTel(tel) {
    tel = tel.replace(/\D/g, "")
    tel = tel.replace(/^(\d)/, "($1")
    tel = tel.replace(/(.{3})(\d)/, "$1)$2")
    if (tel.length == 9) {
        tel = tel.replace(/(.{1})$/, "-$1")
    } else if (tel.length == 10) {
        tel = tel.replace(/(.{2})$/, "-$1")
    } else if (tel.length == 11) {
        tel = tel.replace(/(.{3})$/, "-$1")
    } else if (tel.length == 12) {
        tel = tel.replace(/(.{4})$/, "-$1")
    } else if (tel.length > 12) {
        tel = tel.replace(/(.{4})$/, "-$1")
    }
    return tel;
}

function mCPF(cpf) {
    cpf = cpf.replace(/\D/g, "")
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    return cpf
}
