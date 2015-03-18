var express = require('express');
var app = module.exports = express();

app.set('views', __dirname + '/../views');

var repo = require('gift')(__dirname + '/../../content');
var parseDiff = require('parse-diff');

app.get('/', function(req, res){
	repo.status(function(err, status){
		if(err) return res.send(err);
		repo.diff("HEAD", "", function(err, diffs){
			if(err) return res.send(err);

			for(var i=0; i<diffs.length; i++){
				var path = diffs[i].b_path;
				if(status.files[path]){
					status.files[path].diff = parseDiff(diffs[i].diff);
				}
			}

			for(var file in status.files){
				var that = status.files[file];
				status.files[file] = {
					'tracked'  : that.tracked,
					'staged'   : that.staged,
					'resetable': that.tracked && !that.staged,
					'diff'     : that.diff,
					'added'    : /A$/.test(that.type),
					'modified' : /M$/.test(that.type),
					'deleted'  : /D$/.test(that.type),
					'renamed'  : /R$/.test(that.type),
				};
			};

			res.render('review', {
				diffs : diffs,
				status: status,
			});
		});
	});
});

app.post('/', function(req, res){
	var message = req.body.message;
	var files = [];

	for(var file in req.body.files){
		files.push(file);
	}

	repo.add(files, function(err){
		if(err) return res.sendStatus(500);

		repo.commit(message, function(err){
			if(err) return res.sendStatus(500);

			res.redirect('/review');
		});
	});

});

app.post('/track', function(req, res){
	var filepath = req.body.path;
	var checked = (req.body.checked === 'true');
	var deleted = (req.body.deleted === 'true');
	if(!filepath) return res.sendStatus(404);

	if(checked){
		//track
		var action = deleted ? repo.remove : repo.add;

		action.call(repo, [filepath], function(err){
			if(err) return res.sendStatus(500);
			res.send({status: "success"});
		});
	}else{
		//un-track
		repo.reset("HEAD " + filepath, function(err){
			if(err) return res.sendStatus(500);
			res.send({status: "success"});
		});
	}
});

app.post('/reset', function(req, res){
	var filepath = req.body.path;
	if(!filepath) return res.sendStatus(404);

	repo.checkoutFile(filepath, function(err){
		if(err) return res.sendStatus(500);
		res.send({status: "success"});
	});
});
