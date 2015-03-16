var JSONEditor = module.exports = function(req, contents){
	this.req = req;
	this.template = 'edit-json';
	this.contents = contents ? JSON.parse(contents) : "";

	//GET THIS SCHEMA FROM DEFAULT SETTINGS + PLUGIN SETTINGS
	this.schema = {
		'type' : 'object',
		'properties' : {
			'template' : {'type' : 'string'},
			'metadata' : {
				'type' : 'object',
				'properties' : {
					'title' : {'type' : 'string'},
				}
			}
		},
	};
};

JSONEditor.prototype.render = function(cb){
	var context = {
		json: this.getData(),
		layout: false,
	};
	this.req.app.render(this.getTemplate(), context, cb);
};

JSONEditor.prototype.getTemplate = function(){
	return this.template;
};

JSONEditor.prototype.getData = function(){
	return {
		schema: this.schema,
		data  : this.contents,		
	};
};

JSONEditor.prototype.setData = function(data){
	//use data.meta since we are using the yaml-front-end editor
	this.contents = JSON.stringify(data.meta, null, '\t');
};

JSONEditor.prototype.getFileContents = function(){
	return this.contents;
};
