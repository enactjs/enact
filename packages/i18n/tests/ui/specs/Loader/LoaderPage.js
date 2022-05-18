'use strict';
const {Page} = require('@enact/ui-test-utils/utils');

class LoaderPage extends Page {
	constructor () {
		super();
		this.title = 'Loader Test';
	}

	async loadState () {
		return await browser.$('#loaded').getText();
	}

	async locale () {
		return await browser.$('#locale').getText();
	}

	async textDirection () {
		return await browser.$('#dir').getText();
	}

	async text () {
		return await browser.$('#text').getText();
	}

	async open (opts) {
		const urlExtra = Object.keys(opts).reduce((v, key) => {
			return v + encodeURIComponent(key) + '=' + encodeURIComponent(opts[key]) + '&';
		}, '?');
		await super.open('Loader-View', urlExtra);
	}
}

module.exports = new LoaderPage();
