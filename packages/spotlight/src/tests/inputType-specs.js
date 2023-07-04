import {getInputType, setInputType} from '../inputType';

describe('inputType', () => {
	test('should set input type properly in internal variable', () => {
		setInputType('touch');

		const expected = 'touch';
		const actual = getInputType();

		expect(actual).toBe(expected);
	});
});
