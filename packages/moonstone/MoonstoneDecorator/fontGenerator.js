/* global global */
/*
 * This module loads Moonstone specific fonts. It only includes one function,
 * {@link moonstone/MoonstoneDecorator.fontGenerator} and is not intended to be directly
 * included by external developers.
 */

let previousLocale = null;

/**
 * `fontGenerator` is the locale-specific font generator, allowing any locale to have its own custom
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
 * @name fontGenerator
 * @memberof moonstone/MoonstoneDecorator
 * @param {String} locale Locale string
 * @returns {undefined|String} In a non-browser environment, returns the style CSS tag, otherwise undefined.
 * @private
 */
function fontGenerator (locale) {
	// If the locale is the same as the last time this ran, bail out and don't bother to recompile this again.
	if (locale === previousLocale) return;

	previousLocale = locale;
	const
		matchLang = locale.match(/^(?:[^-]*-)*([a-z]{2})(?:-[^-]*)*$/),
		language = matchLang && matchLang[1],
		matchReg = locale.match(/^(?:[^-]*-)*([A-Z]{2}|[0-9]{3})(?:-[^-]*)*$/),
		region = matchReg && matchReg[1],
		styleId = 'enact-localization-font-override',
		// Locale Configuration Block
		fonts = {
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

	let fontDefinitionCss = '';

	// Duplications and alternate locale names
	fonts['zh-TW'] = fonts['zh-HK'];

	// Generate a single font-face rule
	const buildFont = function (inOptions) {
		if (!inOptions && !inOptions.name) {
			return '';
		}
		let strOut = '@font-face { \n' +
			`  font-family: "${inOptions.name}";\n` +
			`  font-weight: ${inOptions.weight || 'normal'};\n`;

		if (inOptions.localName) {
			strOut += `  src: local("${inOptions.localName}");\n`;
		}
		if (inOptions.unicodeRange) {
			strOut += `  unicode-range: ${inOptions.unicodeRange};\n`;
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
				weight: 400,
				unicodeRange: fonts[strLang].unicodeRange
			});

			// Build Bold
			strOut += buildFont({
				name: 'Moonstone LG Display' + name,
				localName: (fonts[strLang].bold || fonts[strLang].regular), // fallback to regular
				weight: 700,
				unicodeRange: fonts[strLang].unicodeRange
			});

			// Build Light
			strOut += buildFont({
				name: 'Moonstone LG Display' + name,
				localName: (fonts[strLang].light || fonts[strLang].regular), // fallback to regular
				weight: 300,
				unicodeRange: fonts[strLang].unicodeRange
			});
		}
		return strOut;
	};

	// Build all the fonts so they could be explicitly called
	for (let lang in fonts) {
		fontDefinitionCss += buildFontSet(lang);

		// Set up the override so "Moonstone LG Display" becomes the local-specific font.
		// la = language, re = region; `la-RE`
		const [la, re] = lang.split('-');
		if (la === language) {
			if (!re || (re && re === region)) {
				fontDefinitionCss += buildFontSet(lang, true);
			}
		}
	}

	if (typeof document !== 'undefined') {
		// Normal execution in a browser window
		let styleElem = document.getElementById(styleId);

		if (!styleElem) {
			styleElem = document.createElement('style');
			styleElem.setAttribute('id', styleId);
			styleElem.setAttribute('type', 'text/css');
			document.head.appendChild(styleElem);
		}

		styleElem.innerHTML = fontDefinitionCss;
	} else if (global && global.enactHooks && global.enactHooks.prerender) {
		// We're rendering without the DOM; temporarily support deprecated prerender hook.
		global.enactHooks.prerender({appendToHead: `<style type="text/css" id="${styleId}">${fontDefinitionCss}</style>`});
	} else {
		// We're rendering without the DOM; return the font definition stylesheet element string.
		return `<style type="text/css" id="${styleId}">${fontDefinitionCss}</style>`;
	}
}

module.exports = fontGenerator;
module.exports.fontGenerator = fontGenerator;
