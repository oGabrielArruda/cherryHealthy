var express = require('express');
var app = express();
app.use(express.static('public'));


var request = require('request');
const rotas = require("../app/rotas.js");

//--------------------------------------//


const bodyParser = require('body-parser');
const porta = 3000; // PORTA PADRAÕ
const sql = require('mssql');

// configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



rotas(app);

// Tratamento de erros
app.use(function (req, resp, next) {
    return resp.status(404).render('paginas/erro/notFound');
});
    app.use(function (erro, req, resp, next) {
    return resp.status(500).send('Página não encontrada!');
});

module.exports = app;