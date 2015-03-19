var express = require('express');
var app = module.exports = express();

var content = require('../../lib/content.js');

app.post('/', function(req, res, next){
	content.setupDefault({
		title  : req.body.title,
		theme  : req.body.theme,
		layout : req.body.layout,
	}, function(err){
		if(err) return next(err);
		res.redirect('/');
	});
});
