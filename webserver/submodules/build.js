var express = require('express');
var serveStatic = require('serve-static');
var app = module.exports = express();

app.use('/', serveStatic(__dirname + '/../../content/build/'));
