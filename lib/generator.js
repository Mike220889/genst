var metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var templates = require('metalsmith-templates');
var collections = require('metalsmith-collections');
var navigation = require('metalsmith-navigation');
var assets = require('metalsmith-assets');
var Handlebars = require('handlebars');

Handlebars.registerHelper('stringify', function(obj){
	return JSON.stringify(obj);
});

module.exports = function(logger, cb){
	cb || (cb = function(){})

	try{
		var settings = require('../content/settings.json');
	}catch(e){
		logger.fatal(e, "the settings file is malformed or unreadable");
	}

	var contentDir = __dirname + '/../content';

	var workflow = metalsmith(contentDir)
		.clean(true)
		.metadata(settings.metadata || {});

	workflow.use(function(files, meta, cb){
		//remove dotfiles
		for(file in files){
			if(/^\./.test(file)){
				delete files[file];
			}
		}

		cb();
	});

/* TODO
	workflow.use(collections({

	}));
*/

	workflow.use(markdown());
	workflow.use(function(files, meta, cb){
		//set all pages as 'all' navigation items
		for(var file in files){
			var group = files[file].nav_group;
			if(group instanceof Array && group.indexOf('all') < 0){
				group.push('all');
			}else if(typeof group === 'String' && group !== 'all'){
				group = [group, 'all'];
			}else{
				group = ['all'];
			}

			files[file].nav_group = group;
		}
		cb();
	});
	workflow.use(navigation({
		all: {
			filterProperty : 'nav_group',
			filterValue : 'all',
		}
	}));
	workflow.use(templates({
		'engine' : 'handlebars',
		'default': settings.template,
	}));

	workflow.use(function(files, metadata, cb){
		for(var file in files){
			//logger.log("processing file: " + file);
		};
		cb();
	});

	workflow.use(assets({
		source: './stylesheets',
		destination: './stylesheets',
	}));

	workflow.use(assets({
		source: './javascript',
		destination: './javascript',
	}));

	workflow.build(function(err){
		if(err){
			logger.error(err, "There was an error while building");
		}else{
			logger.log("finished building");
		}
		cb(err);
	});
};
