/*
 * This module loads Moonstone specific fonts. It only includes one function,
 * {@link moonstone/MoonstoneDecorator.fontGenerator} and is not intended to be directly
 * included by external developers.
 */
import uiFontGenerator from '@enact/ui/FontGenerator';

const fontName = 'Moonstone LG Display';

// Locale Configuration Block
const fonts = {
	'NonLatin': {
		regular: 'LG Display-Light',
		bold:    'LG Display-Regular'
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

let previousLocale = null;

/**
 * @name fontGenerator
 * @memberof moonstone/MoonstoneDecorator
 * @param {String} locale Locale string
 * @returns {undefined|String} In a non-browser environment, returns the style CSS tag, otherwise undefined.
 * @private
 */
const fontGenerator = (locale) => {
	// If the locale is the same as the last time this ran, bail out and don't bother to recompile this again.
	if (locale === previousLocale) return;

	previousLocale = locale;
	return uiFontGenerator({fonts, fontName, locale});
};

module.exports = fontGenerator;
module.exports.fontGenerator = fontGenerator;
