var Handlebars = require('handlebars');
var Swag = require('swag');
//only add partials path in node mode
if(typeof window === "undefined") Swag.Config.partialsPath = __dirname + '/../views/partials/';

//Swag isn't browserify-friendly but does work in the browser
if(typeof window !== "undefined") Swag = window.Swag;

Swag.registerHelpers(Handlebars);

Handlebars.registerHelper('stringify', function(obj){
	return JSON.stringify(obj);
});

module.exports = Handlebars;
