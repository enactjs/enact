/* globals describe, it, expect */

import computed, {computedChain} from '../computed';

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

describe('computedChain', () => {

	it('Should chain the results of each computed prop to the next', function () {
		const cfg = {
			sum: ({x, y, z}) => x + y + z,
			product: ({sum, x}) => sum * x,
			result: ({product, label}) => `${label}: ${product}`
		};

		const props = {
			x: 2,
			y: 3,
			z: 4,
			label: 'Product'
		};

		const updated = computedChain(cfg, props);

		const expected = 'Product: 18';
		const actual = updated.result;

		expect(actual).to.equal(expected);
	});

	it('Should execute in the order defined by the cfg', function () {
		const cfg = {
			// should be NaN since sum won't have been defined yet
			product: ({sum, x}) => sum * x,
			sum: ({x, y, z}) => x + y + z
		};

		const props = {
			x: 2,
			y: 3,
			z: 4
		};

		const updated = computedChain(cfg, props);

		const expected = true;
		const actual = isNaN(updated.product);

		expect(actual).to.equal(expected);
	});
});
