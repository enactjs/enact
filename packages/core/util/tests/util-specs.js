import React from 'react';

import {memoize, isRenderable} from '../util';

describe('util', () => {
	describe('isRenderable', () => {
		test('should return {true} for function', () => {
			const expected = true;
			const actual = isRenderable(function () {});

			expect(actual).toEqual(expected);
		});

		test('should return {true} for string', () => {
			const expected = true;
			const actual = isRenderable('div');

			expect(actual).toEqual(expected);
		});

		test('should return {true} for React.forwardRef', () => {
			const expected = true;
			const actual = isRenderable(React.forwardRef(() => {}));

			expect(actual).toEqual(expected);
		});

		test('should return {true} for React.memo', () => {
			const expected = true;
			const actual = isRenderable(React.memo(() => {}));

			expect(actual).toEqual(expected);
		});

		test('should return {true} for React.lazy', () => {
			const expected = true;
			const actual = isRenderable(React.lazy(() => {}));

			expect(actual).toEqual(expected);
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
});
