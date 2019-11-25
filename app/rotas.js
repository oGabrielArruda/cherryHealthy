var UsuarioDao = require('../app/usuario-dao');
var conexao = require('../config/custom-mssql');

module.exports = (app) => {

    if (typeof localStorage === "undefined" || localStorage === null) {
        var LocalStorage = require('node-localstorage').LocalStorage;
        localStorage = new LocalStorage('./scratch');
    }
    var path = require('path'); 
    
    const crypto = require('crypto'); // modulo de criptografia
    
    const DADOS_CRIPTOGRAFAR = { // dados para criptografia em json
        algoritmo: "aes256",
        codificacao: "utf8",
        segredo: "chaves",
        tipo: "hex"
    };
    
    // Criptografa a senha do parâmetro
    function criptografar(senha) { 
        const cipher = crypto.createCipher(DADOS_CRIPTOGRAFAR.algoritmo, DADOS_CRIPTOGRAFAR.segredo);
        cipher.update(senha);
        return cipher.final(DADOS_CRIPTOGRAFAR.tipo);
    }
    

    function execSQL(sql, resposta) { // funcao para executar a query passada como parametro
        global.conexao.request() // acessa a conexao
            .query(sql) // realiza o comando 
            .then(resultado => resposta.json(resultado.recordset)) // retorna o restultado
            .catch(erro => resposta.json(erro)); // exibe o erro
    }


    // Páginas sem estar logado   
    app.get('/', function (req, res) { // rota principal
        res.sendFile('home.html', { root: path.join(__dirname, '../paginas') }); // exibe a página principal
    });

    app.get('/login.html', function (req, res) { // rota de login
        res.sendFile('login.html', { root: path.join(__dirname, '../paginas') }); // exibe a página de login
    });

    app.get('/signup.html', function (req, res) { // rota de cadastro
        res.sendFile('signup.html', { root: path.join(__dirname, '../paginas') }); // exibe a página de cadastro
    });   

    // Páginas que necessitam estar logado para ter acesso, então verifica-se se há um login
    app.get('/welcome.html', function (req, res) { 
        if (!logado())
            res.redirect("/login.html");
        res.sendFile("welcome.html", { root: path.join(__dirname, '../paginas/AreaLogada') });// exibe página de bem vindo para o usuário logado
    });

    app.get('/perfil.html', function (req, res) { 
        if (!logado())
            res.redirect("/login.html");
        res.sendFile("perfil.html", { root: path.join(__dirname, '../paginas/AreaLogada') }); // exibe a página de login
    });

    app.get('/nutricionista.html', function (req, res) {
        if (!logado())
            res.redirect("/login.html");
        res.sendFile("nutricionista.html", { root: path.join(__dirname, '../paginas/AreaLogada') }); // exibe a página de seu nutricionista
    });

    app.get('/dieta.html', function (req, res) {
        if (!logado())
            res.redirect("/login.html");
        res.sendFile("dieta.html", { root: path.join(__dirname, '../paginas/AreaLogada') }); // exibe a página de dieta
    });

    app.get('/avancos.html', function (req, res) {
        if (!logado())
            res.redirect("/login.html");
        res.sendFile("avancos.html", { root: path.join(__dirname, '../paginas/AreaLogada') }); // exibe a página de avanços
    });

    app.get('/logout', function (req, res) { // rota 'para' sair da página
        localStorage.removeItem('codUsuario'); // apaga a key do seu código de usuário no local storage
        localStorage.removeItem('codNutri'); // apaga a key do seu código de nutricionista 
        res.redirect("/"); // redireciona para a página principal
    });


    // ROTAS NO BANCO DE DADOS
    app.post('/cadastro', function (req, res) { // rota de cadastro
        const usuarioDao = new UsuarioDao(conexao); // instância o dao de usuário
        var err = false;        
        usuarioDao.adiciona(req.body, function(erro){ // chama o método adiciona no dao, passando as informacoes recebidas
            if(erro)
            {
                console.log("Erro na inclusão");
                err = true;
            }
        });
        if(!err) // se o cadastro ocorreu sem erros
            res.redirect('/login.html'); // redireciona para a página de login
        else
            res.redirect('/signup.html'); // se ocorreram erros, redireciona para a página de cadastro novamente
    });

    app.post('/login', async function (req, res) { // rota para login
        var email = req.body.email;
        var senha = req.body.senha;
        senha = criptografar(senha); // criptografa a senha

       var usuarioDao = new UsuarioDao(conexao); // 
        await usuarioDao.selecionarPorEmail(email, function(erro, resultados){ // seleciona o usuario pelo seu email
            if(resultados.recordset.length == 0){ // se não houver usuários com este email
                res.redirect('/login.html'); // redireciona para a área de login
            }

            resultados.recordset.forEach(function (item) { // pra cada resultado, no caso será somente 1
                if (senha == item.senha) { //se a senha recebida for igual a do select
                    res.redirect('/welcome.html'); // redireciona para a aba de boas vindas
                    localStorage.setItem("codUsuario", item.codUsuario); // seta a key código de usuário como o código do usuário selecionado
                    localStorage.setItem("codNutri", item.codNutricionista); // seta a key código de nutricionista como o código do nutricionista
                                                                            // do usuário selecionado
                }
                else { // caso a senha esteja errada
                    res.redirect('/login.html'); // redireciona para a aba de login
                }
            });
        });
    });


    app.get('/usuarioPerfil', (requisicao, resposta) => { // retorna as informações do usuário conectado em json
        let codigo =  parseInt(localStorage.getItem("codUsuario")); // código do usuário logado

        var usuarioDao = new UsuarioDao(conexao); //instância o dao
        usuarioDao.selecionarPeloCodigo(codigo, function(err, resultados){ // seleciona o usuário com esse código
            if(err) 
                console.log("Erro ao pegar informações");
            else // se não teve erro
                resposta.json(resultados.recordset); // exibe os resultados em formato json
        });
    });

    app.get('/dieta', function (req, res) { // rota para selecionar as dietas do usuário
        let filtro = ' WHERE codUsuario= ' + parseInt(localStorage.getItem("codUsuario")); // filttro para o select, com o código do usuário
        execSQL('SELECT * from Dieta' + filtro, res); // realiza o select da tabela
    });

    app.get("/infoNutri", function (req, res) { // rota para pegar as informações do nutricionista
        execSQL('Select * from Nutricionista where codNutricionista= ' + parseInt(localStorage.getItem("codNutri")), res); // realiza o select com o código do nutricionista
                                                                                                                           // do usuário logado
    });

    app.post("/alterarPeso", async function (req, res) { // rota para alterar o peso do usuário
        var pesoAntigo, altura, pontuacao;

        // select em que vamos pegar o peso. a altura, e a pontuacao atual do usuários 
        var sqlQry = "select Pontuação, peso, altura from Usuario where codUsuario = " + parseInt(localStorage.getItem("codUsuario"));
        let resultados = await global.conexao.request().query(sqlQry);
        resultados.recordset.forEach(function (item) {            
            pesoAntigo = item.peso;
            pesoNovo = req.body.peso;
            altura = item.altura;
            pontuacao = item.Pontuação;            
        });

        if(pesoAntigo != pesoNovo) // cálculo da pontuação
        {
            var difImcAntigo = pesoAntigo / (altura*altura) - 21.7; // calcula-se o modulo da diferenca entre o imc antigo e o ideal
            if(difImcAntigo < 0)
                difImcAntigo = -difImcAntigo;
        

            var difImcNovo = pesoNovo / (altura*altura) - 21.7; // calcula-se o modulo da diferenca entre o imc novo e o ideal
            
            if(difImcNovo < 0)
                difImcNovo = -difImcNovo;
            if(difImcAntigo < 0)
                difImcAntigo = -difImcAntigo;

            if(difImcNovo < difImcAntigo) // se com a alteração, o usuario ficou mais proximo do imc ideal
                pontuacao += Math.round(difImcNovo*10); // adiciona-se a pontuação
            else
                pontuacao -= Math.round(difImcNovo*10); // se com a alteração, o usuário ficou mais longe do imc ideal, tira-se pontos

            if(pontuacao < 0)
            	pontuacao = 0;
        }

        // update no peso do usuário
        execSQL('update Usuario set peso = ' + req.body.peso + ', Pontuação =' + pontuacao + 'where codUsuario = ' + parseInt(localStorage.getItem("codUsuario")), res);
        res.redirect('avancos.html'); // redireciona para a aba de avanços
    });

    app.post("/alterarDados", function (req, res) { // rota para alterar os dados
        const usuarioDao = new UsuarioDao(conexao); //instância o dao
        var err = false;

        usuarioDao.alterar(parseInt(localStorage.getItem("codUsuario")), req.body, function(erro){ // chama o método de alterar, passando as novas informações
            if(erro){
                err = true;
            }
        });

        if(!err) // se não ocorreu erros
            res.redirect("perfil.html"); // redireciona para a parte de login
    });

    function logado() { // função responsável por ver se o usuário está logado
        if (localStorage.getItem("codUsuario") == null || localStorage.getItem("codNutri") == null) // se alguma key do localstorage estiver vazia
            return false; // retorna falso, pois quer dizer que não foi feito nenhum login
        return true; // retorna true, pois foi efetuado login
    }
}