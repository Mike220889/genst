var Logger = require('../../lib/logger.js');

var WebLogger = function(){};

WebLogger.prototype = new Logger;
WebLogger.prototype.constructor = WebLogger;

WebLogger.prototype.log = function(message){
	console.log("web logger");
	console.log(message);
};

WebLogger.prototype.error = function(error){
	console.log("web logger error");
	console.log(error);
};

module.exports = WebLogger;
