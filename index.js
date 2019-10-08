const express = require('express');
const app = express();
app.use(express.static('public'));
const bodyParser = require('body-parser');
const porta = 3000; // PORTA PADRAÕ
const sql = require('mssql');
const conexaoStr = "Server=regulus;Database=BD19170;User Id=BD19170;Password=BD19170;";

var fs = require('fs');


// conexao com BD
sql.connect(conexaoStr)
.then(conexao => global.conexao = conexao)
.catch(erro => console.log(erro));


// configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());


//definindo as rotas
const rota = express.Router();
rota.get('/', function(req, res){
    fs.readFile('./index-html/home.html', function(err,data){
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(data);
        res.end();
    });
});

app.use('/', rota);


//inicia servidor
app.listen(porta);
console.log('API Funcionando!');


function execSQL(sql, resposta) {
    global.conexao.request()
    .query(sql)
    .then(resultado => resposta.json(resultado.recordset))
    .catch(erro => resposta.json(erro));
    }

    rota.get('/medico', (requisicao, resposta) =>{
    execSQL('SELECT * FROM Medico', resposta);
    });


