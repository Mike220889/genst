var fs = require('fs');
var path = require('path');

var MarkdownEditor = require('./editors/markdown.js');
var JSONEditor = require('./editors/json.js');

var getEditorObject = function(filepath){
	switch(path.extname(filepath)){
		case '.md':
			return MarkdownEditor;
			break;
		case '.json':
			return JSONEditor;
			break;
	}
}

module.exports.render = function(req, res, filepath, cb){
	//render a file editor (probably front-end will do the heavy lifting here)
	//see ajaxorg/ace editor
	//npm install brace (browserify-compatible ace)
	//.md - markdown with yaml front matter
	//.txt - text editor
	//.json - json edit
	fs.readFile(filepath, 'utf-8', function(err, contents){
		if(err) return res.sendStatus(404);

		var Editor = getEditorObject(filepath);
		var editor = new Editor(req, contents);

		editor.render(cb);
	});
};

module.exports.save = function(req, res, filepath){
	var Editor = getEditorObject(filepath);
	var editor = new Editor(req);
	editor.setData(req.body);
	var contents = editor.getFileContents();

	//save back to file
	fs.writeFile(filepath, contents, function(err, result){
		if(err) return req.sendStatus(500);

		res.send({'success' : true});
	});
};
