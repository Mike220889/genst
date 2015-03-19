var Logger = require('./lib/cli-logger.js');
var logger = new Logger();
switch(process.argv[2]){
	case 'init':
		var content = require('./lib/content');
		content.setupDefault({}, function(err, result){
			if(err) return logger.error(err);

			logger.log("finished init setup");
		});
		break;
	case 'generate':
	case undefined:
		var generate = require('./lib/generator.js');
		generate(logger, function(err){
			//callback
		});
		break;
	default:
		logger.error(new Error(process.argv[2] + " is not a valid command"));
		break;
}
