function GracefulFsPlugin(options) {
	this.options = options || {writeFile:true};
}

module.exports = GracefulFsPlugin;
GracefulFsPlugin.prototype.apply = function(compiler) {
	var ops = ['mkdir', 'rmdir', 'unlink', 'writeFile'];
	var fs = require('graceful-fs');
	try {
		var NodeOutputFileSystem = require('webpack/lib/node/NodeOutputFileSystem');
		for(var i=0; i<ops.length; i++) {
			if(this.options[ops[i]] && NodeOutputFileSystem.prototype[ops[i]]) {
				NodeOutputFileSystem.prototype[ops[i]] = fs[ops[i]].bind(fs);
			}
		}
	} catch(e) {
		console.log('WARNING: GracefulFsPlugin will not function locally with a global Webpack context');
	}
};
