import {generateFontRules, generateFontOverrideRules, addLocalizedFont, removeLocalizedFont} from '../localized-fonts';

describe('localized-fonts', () => {
	test('generateFontRules should return \'undefined\' when no locale is passed', () => {
		expect(generateFontRules()).toBe(undefined);
	});

	test('generateFontOverrideRules should return \'undefined\' when no locale is passed', () => {
		expect(generateFontOverrideRules()).toBe(undefined);
	});

	test('addLocalizedFont should return \'undefined\' when no locale is passed', () => {
		expect(addLocalizedFont('', null)).toBe(undefined);
	});

	test('removeLocalizedFont should return \'undefined\' when no locale is passed', () => {
		expect(removeLocalizedFont('')).toBe(undefined);
	});
});
