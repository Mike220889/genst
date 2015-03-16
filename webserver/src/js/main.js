var fs = require('fs');
require('json-editor'); //window.JSONEditor becomes available
var $ = jQuery = require('./jquery.js');

window.jQuery = jQuery;
require('./bootstrap.js');

var Handlebars = require('../../lib/template-engine.js');
var alertTemplate = Handlebars.compile(fs.readFileSync(__dirname + '/../../views/partials/alert.hbs', 'utf-8'));

$(function(){
	$('#generate-button').on('click', function(){
		$('#alert-placeholder').html('');
		$.get('/generate', function(response){
			if(response.status === "success"){
				$('#alert-placeholder').append(alertTemplate({
					message: 'Generated! - <a href="/build/" target="_blank">preview site</a>',
					type: 'success'
				}));
			}else{
				$('#alert-placeholder').append(alertTemplate({
					message: 'Error! - ' + response.error,
					type: 'danger'
				}));
			}
		});
	});
});

$(function(){
	var json = JSON.parse(document.getElementById('json-data').value);

	var editor = new JSONEditor(document.getElementById('json-edit'), {
		schema: json.schema,
		disable_edit_json : true,
		disable_collapse : true,
		startval : json.data,
		theme: 'bootstrap3',
	});

	//hide the 'root' title
	$('div#json-edit > div > h3 > span').hide();

	$('#submit-form').on('click', function(){
		var data = {
			meta : editor.getValue(),
			body : $('textarea[name=content]').val(),
		}
		$.post(document.location.href, data, function(response){
			console.log(response);	
		});
	});
});
