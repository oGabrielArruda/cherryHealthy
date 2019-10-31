var mssql = require('mssql');
const config = {
    user: 'BD19170',
    password: 'BD19170',
    server: 'regulus.cotuca.unicamp.br',
    database: 'BD19170'
};
mssql.connect(config)
    .then(conexao => global.conexao = conexao)
    .catch(erro => console.log(erro));

module.exports = mssql;