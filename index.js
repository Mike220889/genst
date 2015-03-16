var generate = require('./lib/generator.js');
var Logger = require('./lib/cli-logger.js');

generate(new Logger(), function(err){
	//callback	
});
