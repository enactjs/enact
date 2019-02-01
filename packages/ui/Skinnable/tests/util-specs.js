import {objectify, preferDefined} from '../util';

describe('Skinnable/util/objectify Specs', () => {

	test('should convert a plain string to an object with one key and value true', () => {
		const subject = 'string1';

		const expected = {string1: true};
		const actual = objectify(subject);

		expect(actual).toEqual(expected);
	});

	test('should convert a string with spaces into an object with 2 keys both with value true', () => {
		const subject = 'string1 string2';

		const expected = {string1: true, string2: true};
		const actual = objectify(subject);

		expect(actual).toEqual(expected);
	});

	test('should convert an array with one element into an object with one key and value true', () => {
		const subject = ['array1'];

		const expected = {array1: true};
		const actual = objectify(subject);

		expect(actual).toEqual(expected);
	});

	test('should convert an array with two elements into an object with 2 keys both with value true', () => {
		const subject = ['array1', 'array2'];

		const expected = {array1: true, array2: true};
		const actual = objectify(subject);

		expect(actual).toEqual(expected);
	});

	test('should leave a hash with one key unaltered', () => {
		const subject = {array1: false};

		const expected = {array1: false};
		const actual = objectify(subject);

		expect(actual).toEqual(expected);
	});

	test('should leave a hash with two keys unaltered', () => {
		const subject = {array1: false, array2: false};

		const expected = {array1: false, array2: false};
		const actual = objectify(subject);

		expect(actual).toEqual(expected);
	});

	test('should return an empty object if the argument is falsy', () => {
		const subject = '';

		const expected = {};
		const actual = objectify(subject);

		expect(actual).toEqual(expected);
	});

});

describe('Skinnable/util/preferDefined Specs', () => {

	test('should return the first element if it is a normal string', () => {
		const subject = ['string1', 'string2'];

		const expected = 'string1';
		const actual = preferDefined.apply(this, subject);

		expect(actual).toEqual(expected);
	});

	test('should return the first element if even if it is an empty string', () => {
		const subject = ['', 'string2'];

		const expected = '';
		const actual = preferDefined.apply(this, subject);

		expect(actual).toEqual(expected);
	});

	test('should return the first element if it is a true boolean', () => {
		const subject = [true, 'string2'];

		const expected = true;
		const actual = preferDefined.apply(this, subject);

		expect(actual).toEqual(expected);
	});

	test('should return the first element if it is a false boolean', () => {
		const subject = [false, 'string2'];

		const expected = false;
		const actual = preferDefined.apply(this, subject);

		expect(actual).toEqual(expected);
	});

	test('should return the second element if the first is null', () => {
		const subject = [null, 'string2'];

		const expected = 'string2';
		const actual = preferDefined.apply(this, subject);

		expect(actual).toEqual(expected);
	});

	test('should return the second element if the first is undefined', () => {
		const subject = [void 0, 'string2'];

		const expected = 'string2';
		const actual = preferDefined.apply(this, subject);

		expect(actual).toEqual(expected);
	});

});
