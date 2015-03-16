var Logger = function(){};

Logger.prototype.log = console.log;
Logger.prototype.error = console.log;

module.exports = Logger;
