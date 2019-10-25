var express = require('express');
var app = express();
app.use(express.static('public'));


var request = require('request');
const rotas = require("../app/rotas.js");

//--------------------------------------//


const bodyParser = require('body-parser');
const porta = 3000; // PORTA PADRAÕ
const sql = require('mssql');
const conexaoStr = "Server=regulus.cotuca.unicamp.br;Database=BD19170;User Id=BD19170;Password=BD19170;";


// conexao com BD
sql.connect(conexaoStr)
    .then(conexao => global.conexao = conexao)
    .catch(erro => console.log(erro));


// configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



rotas(app);


module.exports = app;