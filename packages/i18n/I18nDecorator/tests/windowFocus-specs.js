/* eslint-disable react/jsx-no-bind */

import {onWindowFocus} from '../windowFocus';

describe('windowFocus', () => {
	const dispatchFocus = () => window.dispatchEvent(new window.FocusEvent('focus'));
	const dispatchBlur = () => window.dispatchEvent(new window.FocusEvent('blur'));

	describe('at launch', () => {
		test('should invoke fn immediately', () => {
			const fn = jest.fn();
			onWindowFocus(fn);

			const expected = 1;
			const actual = fn.mock.calls.length;

			expect(actual).toEqual(expected);
		});
	});

	describe('when window focused', () => {
		beforeEach(dispatchFocus);
		afterEach(dispatchBlur);

		test('should invoke fn immediately', () => {
			const fn = jest.fn();
			onWindowFocus(fn);

			const expected = 1;
			const actual = fn.mock.calls.length;

			expect(actual).toEqual(expected);
		});
	});

	describe('when window blurred', () => {
		beforeEach(dispatchBlur);
		afterEach(dispatchFocus);

		test('should not invoke fn', () => {
			const fn = jest.fn();
			onWindowFocus(fn);

			const expected = 0;
			const actual = fn.mock.calls.length;

			expect(actual).toEqual(expected);
		});

		test('should invoke fn after focus', () => {
			const fn = jest.fn();
			onWindowFocus(fn);

			let expected = 0;
			let actual = fn.mock.calls.length;

			expect(actual).toEqual(expected);

			dispatchFocus();

			expected = 1;
			actual = fn.mock.calls.length;

			expect(actual).toEqual(expected);
		});

		test('should invoke fn only once after focus when queued multiple times', () => {
			const fn = jest.fn();
			onWindowFocus(fn);
			onWindowFocus(fn);
			onWindowFocus(fn);
			onWindowFocus(fn);

			dispatchFocus();

			const expected = 1;
			const actual = fn.mock.calls.length;

			expect(actual).toEqual(expected);
		});
	});
});
