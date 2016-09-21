var config = require('enyo-config/src/common-config');

module.exports = config.common({
	ri: {
		baseSize: 24
	}
});

delete module.exports.entry;
delete module.exports.output;

for (var i = 0; i < module.exports.module.loaders.length; i++) {
	if (module.exports.module.loaders[i].test.toString() === /\.(c|le)ss$/.toString()) {
		module.exports.module.loaders[i].loader = 'style!css?modules&importLoaders=1!less';
	}
}

module.exports.plugins.splice(module.exports.plugins.length - 1, 1);
