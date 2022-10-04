import {generateFontRules, generateFontOverrideRules, addLocalizedFont, removeLocalizedFont} from '../localized-fonts';

describe('localized-fonts', () => {
	test('generateFontRules should return \'undefined\' when no locale is passed', () => {
		// eslint-disable-next-line no-undefined
		expect(generateFontRules()).toBe(undefined);
	});

	test('generateFontOverrideRules should return \'undefined\' when no locale is passed', () => {
		// eslint-disable-next-line no-undefined
		expect(generateFontOverrideRules()).toBe(undefined);
	});

	test('addLocalizedFont should return \'undefined\' when no locale is passed', () => {
		// eslint-disable-next-line no-undefined
		expect(addLocalizedFont('', null)).toBe(undefined);
	});

	test('removeLocalizedFont should return \'undefined\' when no locale is passed', () => {
		// eslint-disable-next-line no-undefined
		expect(removeLocalizedFont('')).toBe(undefined);
	});
});
