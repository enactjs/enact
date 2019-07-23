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
		regular: 'LG Smart UI Amharic'
	},
	'bn': {
		regular: 'LG Smart UI Bengali'
	},
	'gu': {
		regular: 'LG Smart UI Gujarati'
	},
	'ja': {
		regular: 'LG Smart UI JP',
		bold: 'LG Display_JP_Bold'
	},
	'kn': {
		regular: 'LG Smart UI Kannada'
	},
	'hi': {
		regular: 'LG Smart UI Devanagari'
	},
	'or': {
		regular: 'LG Smart UI Oriya'
	},
	'pa': {
		regular: 'LG Smart UI Gurmukhi'
	},
	'ml': {
		regular: 'LG Smart UI Malayalam'
	},
	'ta': {
		regular: 'LG Smart UI Tamil'
	},
	'te': {
		regular: 'LG Smart UI Telugu'
	},
	'ur': {
		regular: 'LG Smart UI Urdu',
		unicodeRange:
			'U+600-6FF,' +
			'U+FE70-FEFE,' +
			'U+FB50-FDFF'
	},
	'zh-HK': {
		regular: 'LG Smart UI TC',
		bold:    'LG Smart UI TC',
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
fonts['as'] = fonts['bn'];
fonts['en-JP'] = fonts['ja'];
fonts['mr'] = fonts['hi'];
fonts['zh-TW'] = fonts['zh-HK'];

addLocalizedFont(fontName, fonts);

module.exports = generateFontRules;
module.exports.fontGenerator = generateFontRules;
module.exports.fontOverrideGenerator = generateFontOverrideRules;
module.exports.generateFontRules = generateFontRules;
