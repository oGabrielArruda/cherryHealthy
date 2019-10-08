var express = require('express');
var app = express();
app.use(express.static('public'));

var rotas = require('../app/rotas.js');
rotas(app);

module.exports = app;