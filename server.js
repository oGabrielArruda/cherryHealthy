app = require('./config/custom-express.js');

const bodyParser = require('body-parser');
const porta = 3000;
const sql = require('mssql');
const conexaoStr = ""

app.listen(3000, function(){
    console.log('Servidor em execução');
});