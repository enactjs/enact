/*
 * This module loads Moonstone specific fonts. It only includes one function,
 * {@link moonstone/MoonstoneDecorator.fontGenerator} and is not intended to be directly
 * included by external developers.
 */
// eslint-disable-next-line no-var
var {addLocalizedFont, generateFontRules, generateFontOverrideRules} = require('@enact/ui/internal/localized-fonts');

const fontName = 'Moonstone Global';

// Locale Configuration Block
const fonts = {
	'NonLatin': {
		// Hacky solution to add support for full-name and postscript names of the same font (support for multiple different operating systems font handling)
		regular: 'LG Smart UI AR HE TH Regular"), local("LGSmartUIARHETH-Regular',
		bold:    'LG Smart UI AR HE TH SemiBold"), local("LGSmartUIARHETH-SemiBold'
	},
	'am': {
		regular: 'LG Display_Amharic'
	},
	// 'bn': {
	// 	regular: 'LG Display_Bengali'
	// },
	'en-JP': {
		regular: 'LG Display_JP'
	},
	// 'gu': {
	// 	regular: 'LG Display_Gujarati'
	// },
	'ja': {
		regular: 'LG Display_JP'
	},
	// 'kn': {
	// 	regular: 'LG Display_Kannada'
	// },
	// 'ks': {
	// 	regular: 'LG Display_Devanagari'
	// },
	'or': {
		regular: 'LG Display_Oriya'
	},
	'ml': {
		regular: 'LG Display_ML'
	},
	// 'ta': {
	// 	regular: 'LG Display_Tamil'
	// },
	// 'te': {
	// 	regular: 'LG Display_Telugu'
	// },
	'ur': {
		regular: 'LG Display_Urdu',
		unicodeRange:
			'U+600-6FF,' +
			'U+FE70-FEFE,' +
			'U+FB50-FDFF'
	},
	'zh-HK': {
		regular: 'LG Display GP4_HK',
		bold:    'LG Display GP4_HK',
		unicodeRange:
			'U+0-FF,' +
			'U+2E80-2EFF,' +
			'U+3000-303F,' +
			'U+3200-33FF,' +
			'U+3400-4DBF,' +
			'U+4E00-9FFF,' +
			'U+E000-FAFF,' +
			'U+FF00-FFEF'
	}
};

// Duplications and alternate locale names
fonts['zh-TW'] = fonts['zh-HK'];

addLocalizedFont(fontName, fonts);

module.exports = generateFontRules;
module.exports.fontGenerator = generateFontRules;
module.exports.fontOverrideGenerator = generateFontOverrideRules;
module.exports.generateFontRules = generateFontRules;
