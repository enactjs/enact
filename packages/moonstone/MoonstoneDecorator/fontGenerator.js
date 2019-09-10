/*
 * This module loads Moonstone's locale specific fonts.
 *
 * _This is not intended to be directly included by external developers._ The purpose of this is to
 * override the existing "Moonstone" font family with a new typeface, conditionally when the system
 * locale matches the corrosponding locale for the font (defined in this component's code).
 *
 */
let {addLocalizedFont, generateFontRules, generateFontOverrideRules} = require('@enact/ui/internal/localized-fonts');

const fontName = 'Moonstone';

// Locale Configuration Block
//
// "Shape" of the object below is as follows: [square brackets indicate optional elements]
// fonts = {
// 	locale|language|region: {
// 		regular: 'font name',
// 		[bold: 'font name',]
// 		[light: 'font name',]
// 		[unicodeRange: 'U+600-6FF,U+FE70-FEFE']
// 	},
// 	'ur': {
// 		regular: 'LG Smart UI Urdu',
// 		unicodeRange:
// 			'U+600-6FF,' +
// 			'U+FE70-FEFE,' +
// 			'U+FB50-FDFF'
// 	}
// };
const fonts = {
	'ja': {
		regular: 'LG Smart UI JP'
	},
	'zh-Hans': {
		regular: 'LG Smart UI SC'
	},
	'ur': {
		regular: 'LG Smart UI Urdu'
	}
};

// Duplications and alternate locale names
fonts['en-JP'] = fonts['ja'];

addLocalizedFont(fontName, fonts);

module.exports = generateFontRules;
module.exports.fontGenerator = generateFontRules;
module.exports.fontOverrideGenerator = generateFontOverrideRules;
module.exports.generateFontRules = generateFontRules;
