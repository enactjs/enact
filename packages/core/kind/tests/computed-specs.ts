import computed from '../computed';
import type {CallbackObject} from '../../types';

describe('computed', () => {
	// `computed()` returns either the computed props or a render function depending on whether
	// props are passed. These tests always pass props so they always receive the props object.
	const applyComputed = (cfg: CallbackObject, props: CallbackObject) => computed(cfg, props) as CallbackObject;

	type Coordinates = {x: number; y: number; z: number};

	const exampleCfg = {
		sum: ({x, y, z}: Coordinates) => x + y + z,
		product: ({x, y, z}: Coordinates) => x * y * z
	};

	const exampleProps = {
		x: 2,
		y: 3,
		z: 4
	};

	test('should add new props to updated object', () => {
		const props = {
			value: true
		};
		const cfg = {
			count: () => 1
		};

		const updated = applyComputed(cfg, props);

		const expected = 1;
		const actual = updated.count;

		expect(actual).toBe(expected);
	});

	test('should overwrite properties with computed values', () => {
		const props = {
			value: true,
			count: 2
		};
		const cfg = {
			count: () => 1
		};

		const updated = applyComputed(cfg, props);

		const expected = 1;
		const actual = updated.count;

		expect(actual).toBe(expected);
	});

	test(
		'should not leak updated prop values into other computed props',
		() => {
			const props = {
				count: 1
			};
			const cfg = {
				value: ({count}: {count: number}) => count + 5,
				count: ({count}: {count: number}) => count + 1
			};

			const updated = applyComputed(cfg, props);

			const expected = 6;
			const actual = updated.value;
			expect(actual).toBe(expected);
		}
	);

	test('should work with its documented example - sum', () => {
		const updated = applyComputed(exampleCfg, exampleProps);

		const expected = 9;
		const actual = updated.sum;

		expect(actual).toBe(expected);
	});

	test('should work with its documented example - product', () => {
		const updated = applyComputed(exampleCfg, exampleProps);

		const expected = 24;
		const actual = updated.product;

		expect(actual).toBe(expected);
	});

});
