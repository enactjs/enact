/* eslint no-var: "off" */
var config = require('enyo-config');

module.exports = config.karma({
	files: [
		{pattern: 'resources/*.json', watched: true, served: true, included: false}
	],
	proxies: {
		'/resources/': '/base/resources/'
	},
	ri: {
		baseSize: 24
	}
});
