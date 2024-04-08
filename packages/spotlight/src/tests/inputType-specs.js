import {getInputType, setInputType} from '../inputType';

describe('inputType', () => {
	test('should have a default input type as \'key\'', () => {
		const expected = 'key';
		const actual = getInputType();

		expect(actual).toBe(expected);
	});

	test('should ignore input type in internal variable when invalid type is set', () => {
		setInputType('none');

		const expected = 'key';
		const actual = getInputType();

		expect(actual).toBe(expected);
	});

	test('should set input type properly in internal variable', () => {
		setInputType('touch');

		const expected = 'touch';
		const actual = getInputType();

		expect(actual).toBe(expected);
	});
});
