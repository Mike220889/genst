var fs = require('fs');
var express = require('express');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');

var fileEditor = require('./lib/editor.js');
var frontMatter = require('hexo-front-matter');

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
				files.push(file);
			}
		});
		res.render('index.hbs', {files: files});
	});
});

app.get('/edit', function(req, res){
	var filepath = 'content/' + req.query.path;
	console.log(filepath);

	fileEditor.render(req, res, filepath, function(err, html){
		res.render('edit', {
			editor: html,
			filepath: filepath
		});
	});
});

app.post('/edit', function(req, res){
	var filepath = 'content/' + req.query.path;

	fileEditor.save(req, res, filepath);
});

app.post('/page', function(req, res){
	//create a new page
	var path = req.body.path;

	fs.writeFile(__dirname + '/../content/' + path, "", function(err){
		if(err) return res.send({status:"error", error: err.message});
		res.send({status:"success"});
	});
});

app.delete('/page', function(req, res){
	var path = req.query.path;

	fs.unlink(__dirname + '/../content/' + path, function(err){
		if(err) return res.send({status:"error", error: err.message});
		res.send({status:"success"});
	});
});

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

//sub app to serve built html files
var build = express();
build.use('/', serveStatic(__dirname + '/../content/build/'));
app.use('/build', build);
