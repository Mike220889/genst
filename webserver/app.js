var fs = require('fs');
var express = require('express');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');

var app = module.exports = express();
var hbs = require('express-handlebars').create({
	layoutsDir: 'webserver/views/layouts',
	partialsDir: 'webserver/views/partials',
	defaultLayout: 'main',
	extname: '.hbs',
	handlebars: require('./lib/template-engine.js'),
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use('/static', serveStatic(__dirname + '/static'));
app.use(bodyParser.urlencoded({
	extended: true,
}));

app.get('/', function(req, res){
	//get source files
	fs.readdir('content/src', function(err, list){
		var files = [];
		list.forEach(function(file){
			//remove dot files
			if(!/^\./.test(file)){
				files.push({
					path: file,
					editLink : '/page?path=src/' + file,
				});
			}
		});
		res.render('index.hbs', {files: files});
	});
});

app.use('/page', require('./submodules/page.js'));
app.use('/review', require('./submodules/git.js'));

var logger = require('./lib/web-logger.js');
var generate = require('../lib/generator.js');

app.get('/generate', function(req, res){
	generate(new logger(), function(err){
		if(err) return res.send({status:"error", error: err.message});

		res.send({status:"success"});
	});
});

var Zip = require('adm-zip');
app.get('/export.zip', function(req, res){
	var zip = new Zip();
	zip.addLocalFolder(__dirname + '/../content/build');

	res.send(zip.toBuffer());
});

app.use('/build', require('./submodules/build.js'));
