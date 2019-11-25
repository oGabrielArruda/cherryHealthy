class UsuarioDao{ 
    constructor(db) {
        this._db = new db.Request(); // seta o adributo com a conexao
    }

    lista(callback){ // lista os usuarios
        this._db.query("select * from Usuario", function(err,recordset){ //seleciona todos usuários
            callback(err, recordset); // retorna o o erro (se existir), e a lista
        });
    }

    adiciona(usuario, callback){ // adiciona um usuário
        // seta os valores em variáveis
        var nomeComp = usuario.nome_um + ' ' + usuario.nome_dois;
        var cpf = usuario.cpf;
        var email = usuario.email;
        var tel = usuario.tel;

        var senha = usuario.senha;
        senha = criptografar(senha); // criptografa a senha

        var peso = usuario.peso;
        var altura = usuario.altura;
        var codNutri = usuario.codNutri;

        var pontuacao = peso / (altura*altura) - 21.7;
        pontuacao = Math.round(pontuacao);

        // realiza a inserção
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

    // altera o usuário
    alterar(codigo, usuario, callback){
        var nome = usuario.nome;
        var cpf = usuario.cpf;
        var email = usuario.email;
        var telefone = usuario.telefone;
        var peso = usuario.peso;
        var altura = usuario.altura;

        //realiza o update
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

    // retorna o usuário que tem o código passado como parâmetro
    selecionarPeloCodigo(codigo, callback){
        this._db.query("select * from Usuario where codUsuario = " + codigo, function(err, recordset){
            callback(err, recordset); // retorna o o erro (se existir), e o usuário
        });
    }

    // seleciona o usuário do email passado como parâmetro
    selecionarPorEmail(email, callback){
        this._db.query("select * from Usuario where email = '" + email + "'", function(err, recordset){
            callback(err, recordset); // retorna o o erro (se existir), e o usuário
        });
    }
}


const crypto = require('crypto'); // modulo de criptografia
var path = require('path');

const DADOS_CRIPTOGRAFAR = { // dados para criptografia em json
    algoritmo: "aes256",
    codificacao: "utf8",
    segredo: "chaves",
    tipo: "hex"
};

 // Criptografa a senha do parâmetro
function criptografar(senha) {
    const cipher = crypto.createCipher(DADOS_CRIPTOGRAFAR.algoritmo, DADOS_CRIPTOGRAFAR.segredo);
    cipher.update(senha);
    return cipher.final(DADOS_CRIPTOGRAFAR.tipo);
}
 // Descriptografa a senha do parâmetro
function descriptografar(senha) {
    const decipher = crypto.createDecipher(DADOS_CRIPTOGRAFAR.algoritmo, DADOS_CRIPTOGRAFAR.segredo);
    decipher.update(senha, DADOS_CRIPTOGRAFAR.tipo);
    return decipher.final();
    
}
module.exports = UsuarioDao;