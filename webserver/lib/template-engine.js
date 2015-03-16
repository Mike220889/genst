var Handlebars = require('handlebars');
var Swag = require('swag');

//Swag isn't browserify-friendly but does work in the browser
if(typeof window !== "undefined") Swag = window.Swag;

Swag.registerHelpers(Handlebars);

Handlebars.registerHelper('stringify', function(obj){
	return JSON.stringify(obj);
});

module.exports = Handlebars;
