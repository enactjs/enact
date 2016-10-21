var
	path = require('path'),
	WebOSMetaPlugin = require('webos-meta-webpack-plugin'),
	storybookWebpack = require('../.storybook/webpack.config.js');

storybookWebpack.plugins[storybookWebpack.plugins.length-1] = new WebOSMetaPlugin({path:path.join(__dirname, 'webos-meta')});

module.exports = storybookWebpack;
