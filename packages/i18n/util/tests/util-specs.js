import {isRtlText, toCapitalized, toLowerCase, toUpperCase, toWordCase} from '../util';

describe('util', () => {
	describe('isRtlText', () => {
		test('should return `true` for a RTL text', () => {
			const expected = true;
			const actual = isRtlText('نحن اسم المواضيع بعد الأحجار الكريمة');

			expect(actual).toEqual(expected);
		});

		test('should return `false` for a LTR text', () => {
			const expected = false;
			const actual = isRtlText('Hello');

			expect(actual).toEqual(expected);
		});

		test('should return `false` for a non string value', () => {
			const expected = false;
			const actual = isRtlText(123);

			expect(actual).toEqual(expected);
		});
	});

	describe('toCapitalized', () => {
		test('should capitalize the first letter of given string', () => {
			const expected = 'Hello';
			const actual = toCapitalized('hello');

			expect(actual).toEqual(expected);
		});
	});

	describe('toLowerCase', () => {
		test('should convert a string to lower case', () => {
			const expected = 'hello';
			const actual = toLowerCase('HELLO');

			expect(actual).toEqual(expected);
		});
	});

	describe('toUpperCase', () => {
		test('should convert a string to upper case', () => {
			const expected = 'HELLO';
			const actual = toUpperCase('hello');

			expect(actual).toEqual(expected);
		});
	});

	describe('toWordCase', () => {
		test('should capitalize every word in a string', () => {
			const expected = 'The Quick Brown Fox Jumped Over The Lazy Dog.';
			const actual = toWordCase('the quick brown fox jumped over the lazy dog.');

			expect(actual).toEqual(expected);
		});
	});
});
