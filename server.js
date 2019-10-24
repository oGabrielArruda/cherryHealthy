var express = require('express');
var path = require('path');
var app = express();
app.use(express.static('public'));


var request = require('request');

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}
//--------------------------------------//


const bodyParser = require('body-parser');
const porta = 3000; // PORTA PADRAÕ
const sql = require('mssql');
const conexaoStr = "Server=regulus.cotuca.unicamp.br;Database=BD19170;User Id=BD19170;Password=BD19170;";

const crypto = require('crypto');

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


// conexao com BD
sql.connect(conexaoStr)
    .then(conexao => global.conexao = conexao)
    .catch(erro => console.log(erro));


// configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function execSQL(sql, resposta) {
    global.conexao.request()
        .query(sql)
        .then(resultado => resposta.json(resultado.recordset))
        .catch(erro => resposta.json(erro));
}


// ROTAS DE PAGINAS

app.get('/', function (req, res) {
    res.sendFile('home.html', { root: path.join(__dirname, './paginas') });
});

app.get('/login.html', function (req, res) {
    res.sendFile('login.html', { root: path.join(__dirname, './paginas') });
});

app.get('/signup.html', function (req, res) {
    res.sendFile('signup.html', { root: path.join(__dirname, './paginas') });
});

app.get('/noticias.html', function (req, res) {
    res.sendFile("noticias.html", { root: path.join(__dirname, './paginas') });
});

app.get('/welcome.html', function (req, res) {
    res.sendFile("welcome.html", { root: path.join(__dirname, './paginas/AreaLogada') });
});

app.get('/perfil.html', function (req, res) {
    res.sendFile("perfil.html", { root: path.join(__dirname, './paginas/AreaLogada') });
});

app.get('/nutricionista.html', function (req, res) {
    res.sendFile("nutricionista.html", { root: path.join(__dirname, './paginas/AreaLogada') });
});

app.get('/dieta.html', function (req, res) {
    res.sendFile("dieta.html", { root: path.join(__dirname, './paginas/AreaLogada') });
});

app.get('/avancos.html', function (req, res) {
    res.sendFile("avancos.html", { root: path.join(__dirname, './paginas/AreaLogada') });
});

app.get('/logout', function (req, res) {	
	localStorage.clear();
	req.logout();
    res.sendFile('home.html', { root: path.join(__dirname, './paginas') });
	
});


// ROTAS NO BANCO DE DADOS
app.post('/cadastro', function (req, res) {
    var nomeUm = req.body.nome_um;
    var nomeDois = req.body.nome_dois;
    var nomeComp = nomeUm + ' ' + nomeDois;
    var cpf = req.body.cpf;
    var email = req.body.email;
    var tel = req.body.tel;

    var senha = req.body.senha;
    senha = criptografar(senha);

    var peso = req.body.peso;
    var altura = req.body.altura;
    var codNutri = req.body.codNutri;

    execSQL(`INSERT INTO Usuario(nome, cpf, email, telefone, senha, peso, altura, codNutricionista, Pontuação)
    VALUES('${nomeComp}','${cpf}','${email}','${tel}', '${senha}', ${peso}, ${altura}, ${codNutri}, 0)`, res);

    res.redirect('/login.html');
});

app.post('/login', async function (req, res) {
    var email = req.body.email;
    var senha = req.body.senha;
    senha = criptografar(senha);

    var sqlQry1 = "select * from Usuario where email = '" + email + "' ";
    let resultados = await global.conexao.request().query(sqlQry1);
    resultados.recordset.forEach(function (item) {
        if (senha == item.senha) {
            res.redirect('/welcome.html');
            localStorage.setItem("codUsuario", item.codUsuario);
            localStorage.setItem("codNutri", item.codNutricionista);
        }
        else {
            res.redirect('/login.html');
        }
    });
});


app.get('/usuarioPerfil', (requisicao, resposta) => {
    let filtro = ' WHERE codUsuario=' + parseInt(localStorage.getItem("codUsuario"));
    execSQL('SELECT * from Usuario' + filtro, resposta);
});

app.get('/dieta', function (req, res) {
    let filtro = ' WHERE codUsuario= ' + parseInt(localStorage.getItem("codUsuario"));
    execSQL('SELECT * from Dieta' + filtro, res);
});

app.get("/infoNutri", function (req, res) {
    execSQL('Select * from Nutricionista where codNutricionista= ' + parseInt(localStorage.getItem("codNutri")), res);
});

app.post("/alterarPeso", function (req, res) {
    execSQL('update Usuario set peso = ' + req.body.peso + ' where codUsuario = ' + parseInt(localStorage.getItem("codUsuario")), res);
    res.redirect('perfil.html');
});

app.post("/alterarDados", function (req, res) {
    execSQL("update Usuario set nome='" + req.body.nome +
        "', cpf = '" + req.body.cpf +
        "', email='" + req.body.email +
        "', telefone='" + req.body.telefone +
        "', peso = " + req.body.peso +
        ", altura = " + req.body.altura + " where codUsuario = " + parseInt(localStorage.getItem("codUsuario")), res);

    res.redirect("perfil.html");
});

app.listen(3000, function () {
    console.log('executando');
});


