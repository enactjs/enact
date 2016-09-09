/* globals describe, it, expect */

import propTypes from '../propTypes';

describe('propTypes', () => {

	it('Should assign propTypes to propTypes of render method', function () {
		const render = () => {};
		const cfg = {
			count: () => true
		};

		propTypes(cfg, render);

		const expected = true;
		const actual = render.propTypes.count();

		expect(actual).to.equal(expected);
	});

});
