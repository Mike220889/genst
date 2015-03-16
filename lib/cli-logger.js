var Logger = require('./logger.js');

var CLILogger = function(){};

CLILogger.prototype = new Logger;
CLILogger.prototype.constructor = CLILogger;

CLILogger.prototype.log = console.log;

CLILogger.prototype.error = function(error, message){
	console.log("Error: " + message);
	console.error(error);
};

CLILogger.prototype.fatal = function(error, message){
	this.error(error, message);
	process.exit(1);
};

module.exports = CLILogger;
