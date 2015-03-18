var fs = require('fs');
var express = require('express');
var app = module.exports = express();

var fileEditor = require('../lib/editor.js');

app.set('views', __dirname + '/../views');

app.get('/', function(req, res){
	var filepath = 'content/' + req.query.path;
	if(!filepath) return res.sendStatus(404);

	fileEditor.render(req, res, filepath, function(err, html){
		res.render('edit', {
			editor: html,
			filepath: filepath
		});
	});
});

app.post('/', function(req, res){
	var filepath = 'content/' + req.query.path;
	if(!filepath) return res.sendStatus(404);

	fileEditor.save(req, res, filepath);
});

app.delete('/', function(req, res){
	var filepath = 'content/' + req.query.path;
	if(!filepath) return res.sendStatus(404);

	fs.unlink(__dirname + '/../../' + filepath, function(err){
		if(err) return res.send({status:"error", error: err.message});
		res.send({status:"success"});
	});
});

app.post('/new', function(req, res){
	//create a new page
	var path = req.body.path;

	fs.writeFile(__dirname + '/../../content/' + path, "", function(err){
		if(err) return res.send({status:"error", error: err.message});
		res.send({status:"success"});
	});
});
