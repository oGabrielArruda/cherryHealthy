var UsuarioDao = require('../app/usuario-dao');
var conexao = require('../config/custom-mssql');

module.exports = (app) => {

    if (typeof localStorage === "undefined" || localStorage === null) {
        var LocalStorage = require('node-localstorage').LocalStorage;
        localStorage = new LocalStorage('./scratch');
    }
    var path = require('path');
    
    const crypto = require('crypto');
    
    const DADOS_CRIPTOGRAFAR = {
        algoritmo: "aes256",
        codificacao: "utf8",
        segredo: "chaves",
        tipo: "hex"
    };
    
    function criptografar(senha) {
        const cipher = crypto.createCipher(DADOS_CRIPTOGRAFAR.algoritmo, DADOS_CRIPTOGRAFAR.segredo);
        cipher.update(senha);
        return cipher.final(DADOS_CRIPTOGRAFAR.tipo);
    }
    

    function execSQL(sql, resposta) {
        global.conexao.request()
            .query(sql)
            .then(resultado => resposta.json(resultado.recordset))
            .catch(erro => resposta.json(erro));
    }


    // Páginas sem estar logado   
    app.get('/', function (req, res) {
        res.sendFile('home.html', { root: path.join(__dirname, '../paginas') });
    });

    app.get('/login.html', function (req, res) {
        res.sendFile('login.html', { root: path.join(__dirname, '../paginas') });
    });

    app.get('/signup.html', function (req, res) {
        res.sendFile('signup.html', { root: path.join(__dirname, '../paginas') });
    });

    app.get('/noticias.html', function (req, res) {
        res.sendFile("noticias.html", { root: path.join(__dirname, '../paginas') });
    });

    // Páginas que necessitam estar logado para ter acesso, então verifica-se se há um login
    app.get('/welcome.html', function (req, res) {
        if (!logado())
            res.redirect("/login.html");
        res.sendFile("welcome.html", { root: path.join(__dirname, '../paginas/AreaLogada') });
    });

    app.get('/perfil.html', function (req, res) {
        if (!logado())
            res.redirect("/login.html");
        res.sendFile("perfil.html", { root: path.join(__dirname, '../paginas/AreaLogada') });
    });

    app.get('/nutricionista.html', function (req, res) {
        if (!logado())
            res.redirect("/login.html");
        res.sendFile("nutricionista.html", { root: path.join(__dirname, '../paginas/AreaLogada') });
    });

    app.get('/dieta.html', function (req, res) {
        if (!logado())
            res.redirect("/login.html");
        res.sendFile("dieta.html", { root: path.join(__dirname, '../paginas/AreaLogada') });
    });

    app.get('/avancos.html', function (req, res) {
        if (!logado())
            res.redirect("/login.html");
        res.sendFile("avancos.html", { root: path.join(__dirname, '../paginas/AreaLogada') });
    });

    app.get('/logout', function (req, res) {
        localStorage.removeItem('codUsuario');
        localStorage.removeItem('codNutri');
        res.redirect("/");
    });


    // ROTAS NO BANCO DE DADOS
    app.post('/cadastro', function (req, res) {
        const usuarioDao = new UsuarioDao(conexao);
        var err = false;        
        usuarioDao.adiciona(req.body, function(erro){
            if(erro)
            {
                console.log("Erro na inclusão");
                err = true;
            }
        });
        if(!err)
            res.redirect('/login.html');
    });

    app.post('/login', async function (req, res) {
        var email = req.body.email;
        var senha = req.body.senha;
        senha = criptografar(senha);

        var sqlQry1 = "select * from Usuario where email = '" + email + "' ";
        let resultados = await global.conexao.request().query(sqlQry1);
        resultados.recordset.forEach(function (item) {
            if (senha == item.senha) {
                res.redirect('/welcome.html');
                localStorage.setItem("codUsuario", item.codUsuario);
                localStorage.setItem("codNutri", item.codNutricionista);
            }
            else {
                res.redirect('/login.html');
            }
        });
    });


    app.get('/usuarioPerfil', (requisicao, resposta) => {
        let filtro = ' WHERE codUsuario=' + parseInt(localStorage.getItem("codUsuario"));
        execSQL('SELECT * from Usuario' + filtro, resposta);
    });

    app.get('/dieta', function (req, res) {
        let filtro = ' WHERE codUsuario= ' + parseInt(localStorage.getItem("codUsuario"));
        execSQL('SELECT * from Dieta' + filtro, res);
    });

    app.get("/infoNutri", function (req, res) {
        execSQL('Select * from Nutricionista where codNutricionista= ' + parseInt(localStorage.getItem("codNutri")), res);
    });

    app.post("/alterarPeso", async function (req, res) {
        var pesoAntigo, altura, pontuacao;

        var sqlQry = "select Pontuação, peso, altura from Usuario where codUsuario = " + parseInt(localStorage.getItem("codUsuario"));
        let resultados = await global.conexao.request().query(sqlQry);
        resultados.recordset.forEach(function (item) {            
            pesoAntigo = item.peso;
            pesoNovo = req.body.peso;
            altura = item.altura;
            pontuacao = item.Pontuação;            
        });

        if(pesoAntigo != pesoNovo)
        {
            var difImcAntigo = pesoAntigo / (altura*altura) - 21.7; // calcula-se o modulo da diferenca entre o imc antigo e o ideal
            if(difImcAntigo < 0)
                difImcAntigo = -difImcAntigo;
        

            var difImcNovo = pesoNovo / (altura*altura) - 21.7; // calcula-se o modulo da diferenca entre o imc novo e o ideal
            if(difImcNovo < 0)
                difImcNovo = -difImcNovo; 
            if(difImcNovo < difImcAntigo) // se com a alteração, o usuario ficou mais proximo do imc ideal
                pontuacao += Math.round(difImcNovo*10); // adiciona-se a pontuação
            else
                pontuacao -= Math.round(difImcNovo*10); // se com a alteração, o usuário ficou mais longe do imc ideal, tira-se pontos
        }

        execSQL('update Usuario set peso = ' + req.body.peso + ', Pontuação =' + pontuacao + 'where codUsuario = ' + parseInt(localStorage.getItem("codUsuario")), res);
        res.redirect('avancos.html');
    });

    app.post("/alterarDados", function (req, res) {
        const usuarioDao = new UsuarioDao(conexao);
        var err = false;

        usuarioDao.alterar(parseInt(localStorage.getItem("codUsuario")), req.body, function(erro){
            if(erro){
                err = true;
            }
        });

        if(!err)
            res.redirect("perfil.html");
    });

    function logado() {
        if (localStorage.getItem("codUsuario") == null || localStorage.getItem("codNutri") == null)
            return false;
        return true;
    }
}