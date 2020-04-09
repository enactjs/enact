'use strict';
const {Page} = require('@enact/ui-test-utils/utils');

class LoaderPage extends Page {
	constructor () {
		super();
		this.title = 'Loader Test';
	}

	get loadState () {
		return browser.$('#loaded').getText();
	}

	get locale () {
		return browser.$('#locale').getText();
	}

	get textDirection () {
		return browser.$('#dir').getText();
	}

	get text () {
		return browser.$('#text').getText();
	}

	open (opts) {
		const urlExtra = Object.keys(opts).reduce((v, key) => {
			return v + encodeURIComponent(key) + '=' + encodeURIComponent(opts[key]) + '&';
		}, '?');
		super.open('Loader-View', urlExtra);
	}
}

module.exports = new LoaderPage();
