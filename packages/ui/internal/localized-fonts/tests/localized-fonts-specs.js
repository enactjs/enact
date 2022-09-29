import {generateFontRules, generateFontOverrideRules, addLocalizedFont, removeLocalizedFont} from '../localized-fonts.js';

describe('localized-fonts', () => {
	test('generateFontRules', () => {
		generateFontRules('gu');
	});

	test('generateFontRules negative', () => {
		expect(generateFontRules()).toBe(undefined);
	});

	test('generateFontOverrideRules', () => {
		generateFontOverrideRules('ar-SA');
	});

	test('generateFontOverrideRules negative', () => {
		expect(generateFontOverrideRules()).toBe(undefined);
	});

	test('addLocalizedFont', () => {
		addLocalizedFont('custom', {custom: 'LG Custom UI'});
	});

	test('addLocalizedFont negative', () => {
		expect(addLocalizedFont('', null)).toBe(undefined);
	});

	test('removeLocalizedFont', () => {
		removeLocalizedFont('bn');
	});

	test('removeLocalizedFont negative', () => {
		expect(removeLocalizedFont('')).toBe(undefined);
	});
});
