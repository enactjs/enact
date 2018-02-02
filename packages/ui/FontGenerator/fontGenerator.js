const fontMap = {};
let currentLocale = null;

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
const buildFontSet = function (fontName, fonts, strLang, bitDefault) {
	let strOut = '',
		name = (bitDefault) ? fontName : fontName + ' ' + strLang;

	if (fonts[strLang].regular) {
		// Build Regular
		strOut += buildFont({
			name,
			localName: fonts[strLang].regular,
			weight: 400,
			unicodeRange: fonts[strLang].unicodeRange
		});

		// Build Bold
		strOut += buildFont({
			name,
			localName: (fonts[strLang].bold || fonts[strLang].regular), // fallback to regular
			weight: 700,
			unicodeRange: fonts[strLang].unicodeRange
		});

		// Build Light
		strOut += buildFont({
			name,
			localName: (fonts[strLang].light || fonts[strLang].regular), // fallback to regular
			weight: 300,
			unicodeRange: fonts[strLang].unicodeRange
		});
	}
	return strOut;
};

function fontGenerator (locale) {
	const
		matchLang = locale.match(/\b([a-z]{2})\b/),
		language = matchLang && matchLang[1],
		matchReg = locale.match(/\b([A-Z]{2}|[0-9]{3})\b/),
		region = matchReg && matchReg[1],
		styleId = 'enact-localization-font-override';

	let fontDefinitionCss = '';

	// Build all the fonts so they could be explicitly called
	for (let fontName in fontMap) {
		const fonts = fontMap[fontName];

		for (let lang in fonts) {
			fontDefinitionCss += buildFontSet(fontName, fonts, lang);

			// Set up the override so "Moonstone LG Display" becomes the local-specific font.
			// la = language, re = region; `la-RE`
			const [la, re] = lang.split('-');
			if (la === language) {
				if (!re || (re && re === region)) {
					fontDefinitionCss += buildFontSet(fontName, fonts, lang, true);
				}
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
	} else {
		const tag = `<style type="text/css" id="${styleId}">${fontDefinitionCss}</style>`;

		// We're rendering without the DOM; return the font definition stylesheet element string.
		return tag;
	}
}

/**
 * Generates locale-specific font rules allowing any locale to have its own custom font. Each
 * locale-font from the configuration block (defined in this file) is generated at run-time. If the
 * locale you're currently in is in the locale-font list an additional `@font-face` rule will be
 * generated that will override the standard "Moonstone LG Display" font.
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
 * @param {String} locale Locale string in the format
 * @returns {String} An HTML fragment of the `<style>` when prerendering
 *
 * @public
 */
function generateFontRules (locale) {
	if (!locale || locale === currentLocale) {
		return;
	}

	currentLocale = locale;

	return fontGenerator(locale);
}

/**
 * Adds a localed font to the font map
 *
 * ```
 * addLocalizedFont('My Theme Font', {
 *   'ur': {
 *      regular: 'My Theme Urdu',
 *      unicodeRange:
 *        'U+600-6FF,' +
 *        'U+FE70-FEFE,' +
 *        'U+FB50-FDFF'
 *    }
 * })
 * ```
 *
 * @param {String} name  Name of the font
 * @param {Object} fonts Object mapping font names and unicode ranges to locales
 *
 * @public
 */
function addLocalizedFont (name, fonts) {
	fontMap[name] = fonts;

	if (currentLocale) {
		fontGenerator(currentLocale);
	}
}

/**
 * Removes a localized font from the font map
 *
 * @param   {String} name Name of the font
 *
 * @public
 */
function removeLocalizedFont (name) {
	delete fontMap[name];

	if (currentLocale) {
		fontGenerator(currentLocale);
	}
}

export default generateFontRules;
export {
	addLocalizedFont,
	generateFontRules,
	removeLocalizedFont
};
