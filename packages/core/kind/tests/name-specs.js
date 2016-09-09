/* globals describe, it, expect */

import name from '../name';

describe('name', () => {

	it('Should assign name to displayName of render method', function () {
		const render = () => {};
		const cfg = 'MyComponent';

		name(cfg, render);

		const expected = cfg;
		const actual = render.displayName;

		expect(actual).to.equal(expected);
	});

});
