/* globals describe, it, expect */

// Removing the ref feature for now (or permanently)
/*
import ref from '../ref';

describe('ref', () => {

	it('should add a ref function to the provided props', function () {
		const props = ref()({count: 1});

		const expected = 'function';
		const actual = typeof props.ref;

		expect(actual).to.equal(expected);
	});

	it('should return unique capture functions for each call', function () {
		const props1 = ref()({count: 1});
		const props2 = ref()({count: 2});

		const expected = props1.ref;
		const actual = props2.ref;

		expect(actual).to.not.equal(expected);
	});

	it('should store a named reference', function () {
		const props = ref()({count: 1});
		props.ref('control1')({name: 'storedRef'});

		const expected = 'storedRef';
		const actual = props.ref.control1.name;

		expect(actual).to.equal(expected);
	});
});
*/
