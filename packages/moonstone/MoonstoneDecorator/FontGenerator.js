/**
* This module loads Moonstone specific fonts. It only one function and is not inteded to be directly
* included by external developers.
*
* @private
* @module moonstone/MoonstoneDecorator/FontGenerator
*/

import ilib from '@enact/i18n';
import Locale from '@enact/i18n/ilib/lib/Locale';

let previousLocale = null;

/**
* `FontGenerator` is the locale-specific font generator, allowing any locale to have its own custom
* font. Each locale-font from the configuration block (defined in this file) is generated at
* run-time. If the locale you're currently in is in the locale-font list an additional
* `@font-face` rule will be generated that will override the standard "Moonstone LG Display"
* font.
*
* In addition to the standard override-font being generated, named region-specific fonts are also
* generated. This lets you incorporate language specific fonts when you're outside of one of those
* regions; useful in a language list context where you want the name of each language to be
* represented by that language's designated font.
*
* Below is example genarated-output of the Urdu ("ur") locale-font.
*
* ```css
* &#64;font-face {
* 	font-family: 'Moonstone LG Display ur';
* 	font-weight: 500;
* 	src: local('LG Display_Urdu');
* 	unicode-range: U+0600-U+06FF, U+FE70-U+FEFE, U+FB50-U+FDFF;
* }
* &#64;font-face {
* 	font-family: 'Moonstone LG Display ur Bold';
* 	font-weight: 700;
* 	src: local('LG Display_Urdu');
* 	unicode-range: U+0600-U+06FF, U+FE70-U+FEFE, U+FB50-U+FDFF;
* }
* &#64;font-face {
* 	font-family: 'Moonstone LG Display ur Light';
* 	font-weight: 300;
* 	src: local('LG Display_Urdu');
* 	unicode-range: U+0600-U+06FF, U+FE70-U+FEFE, U+FB50-U+FDFF;
* }
* ```
*
* @name International Fonts
* @public
*/

function funLocaleSpecificFonts (locale = ilib.getLocale()) {
	// If the locale is the same as the last time this ran, bail out and don't bother to recompile this again.
	if (locale === previousLocale) return;

	previousLocale = locale;
	const
		loc = new Locale(locale),
		language = loc.getLanguage(),
		region = loc.getRegion(),
		styleId = 'enyo-localization-font-override',
		// Locale Configuration Block
		fonts = {
			'NonLatin': {
				regular: 'LG Display-Light',
				bold:    'LG Display-Regular'
			},
			'ja': {
				regular: 'LG Display_JP'
			},
			'en-JP': {
				regular: 'LG Display_JP'
			},
			'ur': {
				regular: 'LG Display_Urdu',
				unicodeRanges:
					'U+600-6FF,' +
					'U+FE70-FEFE,' +
					'U+FB50-FDFF'
			},
			'zh-HK': {
				regular: 'LG Display GP4_HK-Light',
				bold:    'LG Display GP4_HK-Regular',
				unicodeRanges:
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

	let styleElem = document.getElementById(styleId),
		fontDefinitionCss = '';

	// Duplications and alternate locale names
	fonts['zh-TW'] = fonts['zh-HK'];

	// Generate a single font-face rule
	const buildFont = function (inOptions) {
		if (!inOptions && !inOptions.name) {
			return '';
		}
		let strOut = '@font-face { \n' +
			'  font-family: "' + inOptions.name + '";\n' +
			'  font-weight: ' + ( inOptions.weight || 'normal' ) + ';\n';

		if (inOptions.localName) {
			strOut += '  src: local("' + inOptions.localName + '");\n';
		}
		if (inOptions.unicodeRanges) {
			strOut += '  unicode-range: ' + inOptions.unicodeRanges + ';\n';
		}
		strOut += '} \n';
		return strOut;
	};

	// Generate a collection of font-face rules, in multiple font-variants
	const buildFontSet = function (strLang, bitDefault) {
		let strOut = '',
			name = (bitDefault) ? '' : ' ' + strLang;

		if (fonts[strLang].regular) {
			// Build Regular
			strOut += buildFont({
				name: 'Moonstone LG Display' + name,
				localName: fonts[strLang].regular,
				weight: 500,
				unicodeRanges: fonts[strLang].unicodeRanges
			});

			// Build Bold
			strOut += buildFont({
				name: 'Moonstone LG Display' + name,
				localName: fonts[strLang].bold || fonts[strLang].regular,
				weight: 700,
				unicodeRanges: fonts[strLang].unicodeRanges
			});

			// Build Light
			strOut += buildFont({
				name: 'Moonstone LG Display' + name,
				localName: fonts[strLang].light || fonts[strLang].regular,
				weight: 300,
				unicodeRanges: fonts[strLang].unicodeRanges
			});
		}
		return strOut;
	};

	if (!styleElem) {
		styleElem = document.createElement('style');
		styleElem.setAttribute('id', styleId);
		document.head.appendChild(styleElem);
	}

	// Build all the fonts so they could be explicitly called
	for (let lang in fonts) {
		fontDefinitionCss += buildFontSet(lang);
	}

	// Set up the override so "Moonstone LG Display" becomes the local-specific font.
	if (language === 'ja') {
		fontDefinitionCss += buildFontSet('ja', true);
	}	else if (language === 'en' && region === 'JP') {
		fontDefinitionCss += buildFontSet('en-JP', true);
	}	else if (language === 'ur') {
		fontDefinitionCss += buildFontSet('ur', true);
	}	else if (language === 'zh' && region === 'HK') {
		fontDefinitionCss += buildFontSet('zh-HK', true);
	}	else if (language === 'zh' && region === 'TW') {
		fontDefinitionCss += buildFontSet('zh-TW', true);
	}

	styleElem.innerHTML = fontDefinitionCss;
}

export default funLocaleSpecificFonts;
