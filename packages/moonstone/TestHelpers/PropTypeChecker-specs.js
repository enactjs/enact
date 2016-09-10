/* global console beforeEach afterEach*/
/* eslint no-console: ["error", { allow: ["error"] }] */

import {
	watchErrorAndWarnings,
	filterErrorAndWarnings,
	restoreErrorAndWarnings
} from 'enyo-console-spy';

beforeEach(watchErrorAndWarnings);

afterEach(function (done) {
	const actual = filterErrorAndWarnings(/(Invalid prop|Failed prop type|Unknown prop)/);
	const expected = 0;
	restoreErrorAndWarnings();
	if (actual.length > expected) {
		console.error(`PropType Failure: ${this.currentTest.parent.title} at "${this.currentTest.title}"`);
	}
	done();
	expect(actual).to.have.length(expected);
});
