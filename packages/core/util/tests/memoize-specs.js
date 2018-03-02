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
});
