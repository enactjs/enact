import {generateFontRules, generateFontOverrideRules, addLocalizedFont, removeLocalizedFont} from '../localized-fonts.js'

// const fontName = 'Sandstone';
// const fonts = {
// 	'bn': {
// 		regular: 'LG Smart UI Bengali'
// 	},
// 	'gu': {
// 		regular: 'LG Smart UI Gujarati'
// 	},
// 	'hi' : {
// 		regular: 'LG Smart UI Devanagari'
// 	},
// 	'ja': {
// 		regular: 'LG Smart UI JP'
// 	},
// 	'kn': {
// 		regular: 'LG Smart UI Kannada'
// 	},
// 	'pa': {
// 		regular: 'LG Smart UI Gurmukhi'
// 	},
// 	'ta': {
// 		regular: 'LG Smart UI Tamil'
// 	},
// 	'te': {
// 		regular: 'LG Smart UI Telugu'
// 	},
// 	'ur': {
// 		regular: ['LG Smart UI Urdu', 'LGSmartUIUrdu'] // This needs 2 references because the "full name" differs from the "family name". To target this font file directly in all OSs we must also include the "postscript name" in addition to the "full name".
// 	},
// 	'zh-Hans': {
// 		regular: 'LG Smart UI SC'
// 	}
// };

describe('localized-fonts', () => {
	// test('generateFontRules', () => {
	// 	// expect(generateFontRules('en-US')).toBe('en-US');
	// 	console.log(generateFontRules('bn'))
	// });

	test('generateFontRules negative', () => {
		expect(generateFontRules()).toBe(undefined);
	});
	//
	// test('generateFontOverrideRules', () => {
	// 	generateFontOverrideRules('ar-SA');
	// });
	//
	// test('generateFontOverrideRules negative', () => {
	// 	generateFontOverrideRules();
	// });

	// test('addLocalizedFont', () => {
	// 	let test = jest.fn(() => addLocalizedFont(fontName, fonts));
	// 	test()
	// 	console.log(test.mock.results)
	// 	expect(test).toHaveBeenCalled();
	// 	// addLocalizedFont('My Theme Font', {
	// 	// 	'ur': {
	// 	// 		regular: 'My Theme Urdu',
	// 	// 		unicodeRange:
	// 	// 			'U+600-6FF,' +
	// 	// 			'U+FE70-FEFE,' +
	// 	// 			'U+FB50-FDFF'
	// 	// 	}
	// 	// })
	// });

	test('addLocalizedFont negative', () => {
		expect(addLocalizedFont(null, null)).toBe(undefined);
	});

	// test('removeLocalizedFont', () => {
	// 	removeLocalizedFont('My Theme Font');
	// });

	test('removeLocalizedFont negative', () => {
		expect(removeLocalizedFont(null)).toBe(undefined);
	});
});
