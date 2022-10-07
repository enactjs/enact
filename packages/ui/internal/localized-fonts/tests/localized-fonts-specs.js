import '@testing-library/jest-dom';

import {addLocalizedFont, generateFontRules, generateFontOverrideRules} from '../localized-fonts';

describe('localized-fonts', () => {
	beforeEach(() => {
		const fontName = 'Enact';
		const fonts = {
			'ja': {
				regular: 'LG Smart UI JP'
			},
			'ur': {
				regular: ['LG Smart UI Urdu', 'LGSmartUIUrdu'] // This needs 2 references because the "full name" differs from the "family name". To target this font file directly in all OSs we must also include the "postscript name" in addition to the "full name".
			}
		};

		addLocalizedFont(fontName, fonts);
	});

	test('should add \'ja\' font rules when calling generateFontRules', () => {
		generateFontRules('ja');

		const innerHTMLString = document.head.innerHTML.toString();
		const expected1 = innerHTMLString.includes("id=\"localized-fonts\"");
		const expected2 = innerHTMLString.includes('Enact ja');

		expect(expected1).toBeTruthy();
		expect(expected2).toBeTruthy();
	});

	test('should add \'localized-fonts-override\' styles when calling generateFontOverrideRules', () => {
		generateFontOverrideRules('ur');
		const innerHTMLString = document.head.innerHTML.toString();

		const expected = innerHTMLString.includes("id=\"localized-fonts-override\"");

		expect(expected).toBeTruthy();
	});
});
