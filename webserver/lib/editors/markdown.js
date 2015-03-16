var frontMatter = require('hexo-front-matter');
var templateEngine = require('../template-engine.js');

//MARKDOWN
var MarkdownEditor = module.exports = function(req, contents){
	console.log("markdownEditor");
	this.req = req;
	this.template = 'edit-md';
	if(contents){
		this.contents = contents;

		var data = frontMatter.parse(contents);
		this.yaml = data;
		this.body = data._content;
		//remove _content reference from yaml
		delete this.yaml._content;
	}

	//GET THIS SCHEMA FROM DEFAULT SETTINGS + PLUGIN SETTINGS
	this.schema = {
		'type' : 'object',
		'properties' : {
			'title' : {
				'type' : 'string',
				'required' : false,
			},
			'layout' : {
				'type' : 'string',
				'required' : true,
				'enum' : [
					'main',
					'layout1',
				],
			},
		},
	};
};

MarkdownEditor.prototype.render = function(cb){
	var context = this.getData();
	context.layout = false;

	this.req.app.render(this.getTemplate(), context, cb);
};

MarkdownEditor.prototype.getTemplate = function(){
	return this.template;
};

MarkdownEditor.prototype.getData = function(){
	return {
		yaml: {
			schema : this.schema,
			data : this.yaml,
		},
		contents: this.body,
	};
};

MarkdownEditor.prototype.setData = function(data){
	if(!data.meta || !data.body){
		throw new Error("invalid post data");
	}

	this.yaml = data.meta;
	this.body = data.body;

	var data = this.yaml;
	data._content = this.body;

	//re-assemble yaml front matter
	this.contents = frontMatter.stringify(data, {
		prefixSeparator: true,	
	});
};

MarkdownEditor.prototype.getFileContents = function(){
	return this.contents;
};
