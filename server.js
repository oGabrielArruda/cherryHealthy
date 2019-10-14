var express = require('express');
var path = require('path');
var app = express();
app.use(express.static('public'));

//--------------------------------------//


const bodyParser = require('body-parser');
const porta = 3000; // PORTA PADRAÕ
const sql = require('mssql');
const conexaoStr = "Server=regulus;Database=BD19170;User Id=BD19170;Password=BD19170;";




// conexao com BD
sql.connect(conexaoStr)
.then(conexao => global.conexao = conexao)
.catch(erro => console.log(erro));


// configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

function execSQL(sql, resposta) {
    global.conexao.request()
    .query(sql)
    .then(resultado => resposta.json(resultado.recordset))
    .catch(erro => resposta.json(erro));
}

// ROTAS DE PAGINAS

app.get('/', function(req,res){
    res.sendFile('home.html', {root: path.join(__dirname, './paginas')});
});

app.get('/login.html', function(req, res){
    res.sendFile('login.html', {root: path.join(__dirname, './paginas')});
});

app.get('/signup.html', function(req,res){
    res.sendFile('signup.html', {root: path.join(__dirname, './paginas')});
});



// ROTAS NO BANCO DE DADOS
app.post('/cadastro', function(req, res){
    var nomeUm = req.body.nome_um;
    var nomeDois = req.body.nome_dois;
    var nomeComp = nomeUm + ' ' + nomeDois;
    var cpf = req.body.cpf;
    var email = req.body.email;
    var tel = req.body.tel;

    var senha = req.body.senha;
    //-- cripto

    var peso = req.body.peso;
    var altura = req.body.altura;
    var codNutri = req.body.codNutri;

    execSQL(`INSERT INTO Usuario(nome, cpf, email, telefone, senha, peso, altura, codNutricionista, Pontuação)
    VALUES('${nomeComp}','${cpf}','${email}','${tel}', '${senha}', ${peso}, ${altura}, ${codNutri}, 0)`, res);

});

app.listen(3000, function(){
    console.log('executando');
});


