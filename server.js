app = require('./config/custom-express.js');

const bodyParser = require('body-parser');
const porta = 3000;
const sql = require('mssql');
const conexaoStr = "Server=regulus;Database=BD19170;User Id=BD19170;Password=BD19170; ";

// conexao com BD
sql.connect(conexaoStr)
.then(conexao => global.conexao = conexao)
.catch(erro => console.log(erro));


// configurando o body parser para pegar POSTS
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// permicao para o javascript acessar o banco
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    next();
});



app.listen(porta, function(){
    console.log('Servidor em execução');
});

