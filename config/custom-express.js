var express = require('express');
var app = express();

var rotas = require('../app/rotas.js');
rotas(app);

module.exports = app;