class UsuarioDao{
    constructor(db) {
        this._db = new db.Request();
    }

    lista(callback){
        this._db.query("select * from Usuario", function(err,recordset){
            callback(err, recordset);
        });
    }

    adiciona(usuario, callback){
        var nomeComp = usuario.nome_um + ' ' + usuario.nome_dois;
        var cpf = usuario.cpf;
        var email = usuario.email;
        var tel = usuario.tel;

        var senha = usuario.senha;
        senha = criptografar(senha);

        var peso = usuario.peso;
        var altura = usuario.altura;
        var codNutri = usuario.codNutri;

        var pontuacao = peso / (altura*altura) - 21.7;
        pontuacao = Math.round(pontuacao);

        this._db.query(`INSERT INTO Usuario(nome, cpf, email, telefone, senha, peso, altura, codNutricionista, Pontuação)
        VALUES('${nomeComp}','${cpf}','${email}','${tel}', '${senha}', ${peso}, ${altura}, ${codNutri}, ${pontuacao})`, 
        (err)=>{
            if(err)
            {
                console.log("Erro na inserção de usuário " + err)
                callback(err);
            }
        });
    }

    alterar(codigo, usuario, callback){
        var nome = usuario.nome;
        var cpf = usuario.cpf;
        var email = usuario.email;
        var telefone = usuario.telefone;
        var peso = usuario.peso;
        var altura = usuario.altura;

        this._db.query("update Usuario set nome='" + nome +
        "', cpf = '" + cpf +
        "', email ='" + email +
        "', telefone = '" + telefone +
        "', peso = " + peso +
        ", altura = " + altura +
        " where codUsuario = " + codigo, (err)=>{
            if(err)
            {
                console.log("Erro ao alterar usuário");
                callback(err);
            }
        });
       
    }

    selecionarPeloCodigo(codigo, callback){
        this._db.query("select * from Usuario where codUsuario = " + codigo, function(err, recordset){
            callback(err, recordset);
        });
    }

    selecionarPorEmail(email, callback){
        this._db.query("select * from Usuario where email = '" + email + "'", function(err, recordset){
            callback(err, recordset);
        });
    }
}


const crypto = require('crypto');
var path = require('path');

const DADOS_CRIPTOGRAFAR = {
    algoritmo: "aes256",
    codificacao: "utf8",
    segredo: "chaves",
    tipo: "hex"
};

function criptografar(senha) {
    const cipher = crypto.createCipher(DADOS_CRIPTOGRAFAR.algoritmo, DADOS_CRIPTOGRAFAR.segredo);
    cipher.update(senha);
    return cipher.final(DADOS_CRIPTOGRAFAR.tipo);
}

function descriptografar(senha) {
    const decipher = crypto.createDecipher(DADOS_CRIPTOGRAFAR.algoritmo, DADOS_CRIPTOGRAFAR.segredo);
    decipher.update(senha, DADOS_CRIPTOGRAFAR.tipo);
    return decipher.final();
    
}
module.exports = UsuarioDao;