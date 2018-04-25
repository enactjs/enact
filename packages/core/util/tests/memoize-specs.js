import sinon from 'sinon';

import {memoize} from '..';

describe('memoize', function () {
	it('should memoize function', function () {
		const obj = {},
			testMethod = key => {
				obj[key] = (obj[key] || 0) + 1;
			},
			memoizedTest = memoize(testMethod);

		expect(obj).not.to.have.property('a');
		memoizedTest('a');
		expect(obj).to.have.property('a', 1);
		memoizedTest('a');
		memoizedTest('a');
		expect(obj).to.have.property('a', 1);
	});

	it('should forward all args to memoized function', function () {
		const spy = sinon.spy();
		const memoized = memoize(spy);
		memoized(1, 2);

		const expected = [1, 2];
		const actual = spy.firstCall.args;

		expect(expected).to.deep.equal(actual);
	});
});
