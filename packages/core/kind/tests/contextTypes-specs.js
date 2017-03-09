/* globals describe, it, expect */

import contextTypes from '../contextTypes';

describe('contextTypes', () => {

	it('should assign contextTypes to contextTypes of render method', function () {
		const render = () => {};
		const cfg = {
			foo: () => true
		};

		contextTypes(cfg, render);

		const expected = true;
		const actual = render.contextTypes.foo();

		expect(actual).to.equal(expected);
	});

});
