var express = require('express');
var path = require('path');
var app = express();
app.use(express.static('public'));



app.get('/', function(req,res){
    res.sendFile('home.html', {root: path.join(__dirname, './paginas')});
});

app.get('/login.html', function(req, res){
    res.sendFile('login.html', {root: path.join(__dirname, './paginas')});
});

app.get('/signup.html', function(req,res){
    res.sendFile('signup.html', {root: path.join(__dirname, './paginas')});
});

app.listen(3000, function(){
    console.log('executando');
});