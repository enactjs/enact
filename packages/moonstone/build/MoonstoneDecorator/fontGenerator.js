"use strict";

/*
 * This module loads Moonstone's locale specific fonts.
 *
 * _This is not intended to be directly included by external developers._ The purpose of this is to
 * override the existing "Moonstone" font family with a new typeface, conditionally when the system
 * locale matches the corrosponding locale for the font (defined in this component's code).
 *
 */
var _require = require('@enact/ui/internal/localized-fonts'),
    addLocalizedFont = _require.addLocalizedFont,
    generateFontRules = _require.generateFontRules,
    generateFontOverrideRules = _require.generateFontOverrideRules;

var fontName = 'Moonstone'; // Locale Configuration Block
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

var fonts = {
  'ja': {
    regular: 'LG Smart UI JP'
  },
  'ur': {
    regular: ['LG Smart UI Urdu', 'LGSmartUIUrdu'] // This needs 2 references because the "full name" differs from the "family name". To target this font file directly in all OSs we must also include the "postscript name" in addition to the "full name".

  },
  'zh-Hans': {
    regular: 'LG Smart UI SC'
  }
}; // Duplications and alternate locale names

fonts['en-JP'] = fonts['ja'];
addLocalizedFont(fontName, fonts);
module.exports = generateFontRules;
module.exports.fontGenerator = generateFontRules;
module.exports.fontOverrideGenerator = generateFontOverrideRules;
module.exports.generateFontRules = generateFontRules;