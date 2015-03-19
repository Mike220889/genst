var fs = require('fs');
var path = require('path');
var settings = require('../settings.js');
var glob = require('glob');
var async = require('async');
var ncp = require('ncp').ncp;
var gift = require('gift');

var content = {};

var getDirectory = function(subdir){
	var root = path.join(__dirname, '/../', settings.contentDir);
	return subdir ? path.join(root, subdir) : root;
};

content.setupDefault = function(settings, callback){
	async.series([
		function(cb){
			//copy entire content.init directory
			ncp(path.join(__dirname, '/../content.init'), getDirectory(), {
				clobber: false,	
			}, cb);
		},
		function(cb){
			//write settings file
			fs.writeFile(getDirectory('settings.json'), JSON.stringify(settings, null, '\t'), cb);
		},
		function(cb){
			//create a git repo and commit all this to git
			gift.init(getDirectory(), cb);
		},
		function(cb){
			//add all files
			gift(getDirectory()).add("*", cb);
		},
		function(cb){
			//make initial commit
			gift(getDirectory()).commit("Setup default project structure", {all: true}, cb);
		},
	], function(err, results){
		callback(err, results);
	});
};

content.exists = function(cb){
	fs.exists(getDirectory(), function(exists){
		cb(exists);
	});
};

content.getSrcFiles = function(cb){
	glob('**/*', {
		nodir : true,
		cwd: getDirectory('src'),
	}, function(err, files){
		cb(err, files)
	});
};

module.exports = content;
