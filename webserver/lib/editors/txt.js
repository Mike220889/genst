var TxtEditor = module.exports = function(req, contents){
	this.req = req;
	if(contents){
		this.contents = contents;
	}
	this.template = 'edit-txt';
};

TxtEditor.prototype.render = function(cb){
	var context = this.getData();
	context.layout = false;

	this.req.app.render(this.getTemplate(), context, cb);
};

TxtEditor.prototype.getTemplate = function(){
	return this.template;
};

TxtEditor.prototype.getData = function(){
	return {
		contents: this.contents,
	}
};

TxtEditor.prototype.setData = function(data){
	this.contents = data.body;
};

TxtEditor.prototype.getFileContents = function(){
	return this.contents;
};
