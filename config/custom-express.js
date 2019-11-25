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

module.exports = app;