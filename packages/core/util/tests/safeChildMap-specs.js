import {safeChildMap} from '../util';


describe('safeChildMap', () => {
	test('Returns null if null passed', () => {
		const expected = null;
		const actual = safeChildMap(null, val => val);

		expect(actual).toBe(expected);
	});

	test('Returns passed array if identity filter', () => {
		const children = [1, 2, 3];

		const expected = children;
		const actual = safeChildMap(children, val => val);

		expect(actual).toEqual(expected);
	});

	test('Returns passed array without null entries with identity filter', () => {
		const children = [1, 2, null, 3];

		const expected = [1, 2, 3];
		const actual = safeChildMap(children, val => val);

		expect(actual).toEqual(expected);
	});

	test('Does not call filter with null entries', () => {
		const spy = jest.fn();
		const children = [1, 2, null, 3];

		safeChildMap(children, spy);

		const expected = 3;
		const actual = spy.mock.calls.length;

		expect(actual).toBe(expected);
	});

	test('Returns without null entries from filter', () => {
		const children = [1, 2, 3];

		const expected = [1, 3];
		const actual = safeChildMap(children, val => val === 2 ? null : val);

		expect(actual).toEqual(expected);
	});
});
