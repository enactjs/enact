import {forwardRef, memo, lazy} from 'react';

import {mapAndFilterChildren, memoize, isRenderable} from '../util';

describe('util', () => {
	describe('isRenderable', () => {
		test('should return {true} for function', () => {
			const expected = true;
			const view = isRenderable(function () {});

			expect(view).toEqual(expected);
		});

		test('should return {true} for string', () => {
			const expected = true;
			const view = isRenderable('div');

			expect(view).toEqual(expected);
		});

		test('should return {true} for React.forwardRef', () => {
			const expected = true;
			const view = isRenderable(forwardRef(() => {}));

			expect(view).toEqual(expected);
		});

		test('should return {true} for React.memo', () => {
			const expected = true;
			const view = isRenderable(memo(() => {}));

			expect(view).toEqual(expected);
		});

		test('should return {true} for React.lazy', () => {
			const expected = true;
			const view = isRenderable(lazy(() => {}));

			expect(view).toEqual(expected);
		});
	});

	describe('memoize', () => {
		test('should memoize function', () => {
			const obj = {},
				testMethod = key => {
					obj[key] = (obj[key] || 0) + 1;
				},
				memoizedTest = memoize(testMethod);

			expect(obj).not.toHaveProperty('a');
			memoizedTest('a');
			expect(obj).toHaveProperty('a', 1);
			memoizedTest('a');
			memoizedTest('a');
			expect(obj).toHaveProperty('a', 1);
		});

		test('should forward all args to memoized function', () => {
			const spy = jest.fn();
			const memoized = memoize(spy);
			memoized(1, 2);

			const expected = [1, 2];
			const actual = spy.mock.calls[0];

			expect(expected).toEqual(actual);
		});
	});

	describe('mapAndFilterChildren', () => {
		test('Returns null if null passed', () => {
			const expected = null;
			const actual = mapAndFilterChildren(null, val => val);

			expect(actual).toBe(expected);
		});

		test('Returns passed array if identity filter', () => {
			const children = [1, 2, 3];

			const expected = children;
			const actual = mapAndFilterChildren(children, val => val);

			expect(actual).toEqual(expected);
		});

		test('Returns passed array without nullish or false entries with identity filter', () => {
			// eslint-disable-next-line no-undefined
			const children = [1, 2, null, 3, undefined, false];

			const expected = [1, 2, 3];
			const actual = mapAndFilterChildren(children, val => val);

			expect(actual).toEqual(expected);
		});

		test('Does not call filter with nullish or false entries', () => {
			const spy = jest.fn();
			// eslint-disable-next-line no-undefined
			const children = [1, 2, null, 3, undefined, false];

			mapAndFilterChildren(children, spy);

			const expected = 3;
			const actual = spy.mock.calls.length;

			expect(actual).toBe(expected);
		});

		test('Returns without null entries from filter', () => {
			const children = [1, 2, 3];

			const expected = [1, 3];
			const actual = mapAndFilterChildren(children, val => val === 2 ? null : val);

			expect(actual).toEqual(expected);
		});

		test('Runs custom filter', () => {
			const children = [1, 2, 3];

			const expected = [1];
			const actual = mapAndFilterChildren(
				children,
				val => val === 2 ? null : val,
				(val) => val === 1
			);

			expect(actual).toEqual(expected);
		});

		test('should forward value and index to callback', () => {
			const spy = jest.fn();
			mapAndFilterChildren([1], spy);

			const expected = [
				1, // value
				0 // index
			];
			const actual = spy.mock.calls[0];

			expect(expected).toEqual(actual);
		});
	});
});
