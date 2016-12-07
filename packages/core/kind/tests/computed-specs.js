/* globals describe, it, expect */

import computed from '../computed';

describe('computed', () => {

	const exampleCfg = {
		sum: ({x, y, z}) => x + y + z,
		product: ({x, y, z}) => x * y * z
	};

	const exampleProps = {
		x: 2,
		y: 3,
		z: 4
	};

	it('Should add new props to updated object', function () {
		const props = {
			value: true
		};
		const cfg = {
			count: () => 1
		};

		const updated = computed(cfg, props);

		const expected = 1;
		const actual = updated.count;

		expect(actual).to.equal(expected);
	});

	it('Should overwrite properties with computed values', function () {
		const props = {
			value: true,
			count: 2
		};
		const cfg = {
			count: () => 1
		};

		const updated = computed(cfg, props);

		const expected = 1;
		const actual = updated.count;

		expect(actual).to.equal(expected);
	});

	it('should not leak updated prop values into other computed props', function () {
		const props = {
			count: 1
		};
		const cfg = {
			value: ({count}) => count + 5,
			count: ({count}) => count + 1
		};

		const updated = computed(cfg, props);

		const expected = 6;
		const actual = updated.value;
		expect(actual).to.equal(expected);
	});

	it('Should work with its documented example - sum', function () {
		const updated = computed(exampleCfg, exampleProps);

		const expected = 9;
		const actual = updated.sum;

		expect(actual).to.equal(expected);
	});

	it('Should work with its documented example - product', function () {
		const updated = computed(exampleCfg, exampleProps);

		const expected = 24;
		const actual = updated.product;

		expect(actual).to.equal(expected);
	});

});
