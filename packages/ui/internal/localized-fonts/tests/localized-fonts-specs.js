import {generateFontRules, generateFontOverrideRules, addLocalizedFont, removeLocalizedFont} from '../localized-fonts.js'

describe('localized-fonts', () => {
	test('generateFontRules', () => {
		generateFontRules('en-US');
	});

	test('generateFontRules negative', () => {
		generateFontRules();
	});

	test('generateFontOverrideRules', () => {
		generateFontOverrideRules('ar-SA');
	});

	test('generateFontOverrideRules negative', () => {
		generateFontOverrideRules();
	});

	test('addLocalizedFont', () => {
		addLocalizedFont('en-US', {regular: 'LG Smart UI Bengali'});
	});

	test('removeLocalizedFont', () => {
		removeLocalizedFont('en-US');
	});
});
