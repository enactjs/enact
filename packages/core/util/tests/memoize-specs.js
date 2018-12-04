import sinon from 'sinon';

import {memoize} from '..';

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
		const spy = sinon.spy();
		const memoized = memoize(spy);
		memoized(1, 2);

		const expected = [1, 2];
		const actual = spy.firstCall.args;

		expect(expected).toEqual(actual);
	});
});
