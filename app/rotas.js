var fs = require('fs');

module.exports = (app) => {
    app.get('/', function(req, res){
        fs.readFile('./index-html/home.html', function(err,data){
            res.writeHead(200, {'Content-Type':'text/html'});
            res.write(data);
            res.end();
        });     
    });
}