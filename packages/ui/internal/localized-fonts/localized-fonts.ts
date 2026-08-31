interface FontConfig {
	name: string;
	weight?: number;
	localName?: string | string[];
	unicodeRange?: string;
}

interface LocaleFontEntry {
	regular?: string | string[];
	light?: string | string[];
	semibold?: string | string[];
	bold?: string | string[];
	unicodeRange?: string;
}

type LocaleFontMap = Record<string, LocaleFontEntry>;

const fontMap: Record<string, LocaleFontMap> = {};
let currentLocale: string | null = null;

// Generate a single font-face rule
const buildFont = function (config: FontConfig): string {
	if (!config && !(config as any).name) {
		return '';
	}
	let strOut = '@font-face { \n' +
		`  font-family: "${config.name}";\n`;

	if (config.weight) {
		strOut += `  font-weight: ${config.weight};\n`;
	}
	if (config.localName) {
		// Accept a string or an array. If it's a string convert it into an array
		if (typeof config.localName === 'string') {
			config.localName = [config.localName];
		}
		// Take our array and update each of its elements to be CSS "local()" strings
		const localNames = config.localName.map(f => `local("${f}")`);
		// Join all our strings together with a comma, so it's a valid CSS `src` rule
		strOut += `  src: ${localNames.join(', ')};\n`;
	}
	if (config.unicodeRange) {
		strOut += `  unicode-range: ${config.unicodeRange};\n`;
	}
	strOut += '} \n';
	return strOut;
};

// Generate a collection of font-face rules, in multiple font-variants
const buildFontSet = function (fontName: string, fonts: LocaleFontMap, strLang: string, bitDefault?: boolean): string {
	let strOut = '',
		name = (bitDefault) ? fontName : fontName + ' ' + strLang;

	if (fonts[strLang].regular) {
		// Build Regular
		strOut += buildFont({
			name,
			localName: fonts[strLang].regular,
			unicodeRange: fonts[strLang].unicodeRange
		});

		// Build Light
		strOut += buildFont({
			name,
			localName: (fonts[strLang].light || fonts[strLang].regular),
			weight: 300,
			unicodeRange: fonts[strLang].unicodeRange
		});

		// Build SemiBold
		strOut += buildFont({
			name,
			localName: (fonts[strLang].semibold || fonts[strLang].bold || fonts[strLang].regular),
			weight: 600,
			unicodeRange: fonts[strLang].unicodeRange
		});

		// Build Bold
		strOut += buildFont({
			name,
			localName: (fonts[strLang].bold || fonts[strLang].regular),
			weight: 700,
			unicodeRange: fonts[strLang].unicodeRange
		});
	}
	return strOut;
};

const buildFontDefinitionCss = function (locale: string, buildOverrides?: boolean): string {
	const
		matchLang = locale.match(/\b([a-z]{2})\b/),
		language = matchLang && matchLang[1],
		matchScript = locale.match(/\b([a-z]{4})\b/i),
		script = matchScript && matchScript[1],
		matchReg = locale.match(/\b([A-Z]{2}|[0-9]{3})\b/),
		region = matchReg && matchReg[1];

	let fontDefinitionCss = '';

	// Build all the fonts so they could be explicitly called
	for (let fontName in fontMap) {
		const fonts = fontMap[fontName];

		for (let lang in fonts) {
			if (!buildOverrides) {
				fontDefinitionCss += buildFontSet(fontName, fonts, lang);
			} else {
				// Set up the override for locale-specific font.
				// la = language, sc = script, re = region; `la-RE` or `zh-Hans-HK`
				let [la, sc, re] = lang.split('-');

				// if script is not specified, fall back to second part representing region
				if (!re && sc && sc.length === 2) {
					re = sc;
					sc = '';
				}

				const matchesRegion = re ? re === region : true;
				const matchesScript = sc ? sc === script : true;
				if (la === language && matchesRegion && matchesScript) {
					fontDefinitionCss += buildFontSet(fontName, fonts, lang, true);
				}
			}
		}
	}

	return fontDefinitionCss;
};

const insertFontDefinitionCss = function (styleId: string, fontDefinitionCss: string): string | undefined {
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
};

function fontGenerator (locale: string): string | undefined {
	const styleId = 'localized-fonts';

	if (typeof document !== 'undefined' && document.getElementById(styleId)) {
		return;
	}

	return insertFontDefinitionCss(styleId, buildFontDefinitionCss(locale));
}

function fontOverrideGenerator (locale: string): string | undefined {
	return insertFontDefinitionCss('localized-fonts-override', buildFontDefinitionCss(locale, true));
}

/**
 * Generates locale-specific font rules allowing any locale to have its own custom font. Each
 * locale-font from the configuration block (defined in this file) is generated at run-time. If the
 * locale you're currently in is in the locale-font list an additional `@font-face` rule will be
 * generated that will override the standard font.
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
 * 	font-family: 'Custom Font ur';
 * 	font-weight: 500;
 * 	src: local('CustomFont_Urdu');
 * 	unicode-range: U+0600-U+06FF, U+FE70-U+FEFE, U+FB50-U+FDFF;
 * }
 * &#64;font-face {
 * 	font-family: 'Custom Font ur Bold';
 * 	font-weight: 700;
 * 	src: local('CustomFont_Urdu');
 * 	unicode-range: U+0600-U+06FF, U+FE70-U+FEFE, U+FB50-U+FDFF;
 * }
 * &#64;font-face {
 * 	font-family: 'Custom Font ur Light';
 * 	font-weight: 300;
 * 	src: local('CustomFont_Urdu');
 * 	unicode-range: U+0600-U+06FF, U+FE70-U+FEFE, U+FB50-U+FDFF;
 * }
 * ```
 *
 * @param {String} locale Locale string in the format
 * @returns {String} An HTML fragment of the `<style>` when prerendering
 *
 * @public
 */
function generateFontRules (locale: string): string | undefined {
	if (!locale || locale === currentLocale) {
		return;
	}

	currentLocale = locale;

	return fontGenerator(locale);
}

function generateFontOverrideRules (locale: string): string | undefined {
	if (!locale) {
		return;
	}

	return fontOverrideGenerator(locale);
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
function addLocalizedFont (name: string, fonts: LocaleFontMap): void {
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
function removeLocalizedFont (name: string): void {
	delete fontMap[name];

	if (currentLocale) {
		fontGenerator(currentLocale);
	}
}

export default generateFontRules;
export {
	generateFontRules,
	generateFontOverrideRules,
	addLocalizedFont,
	removeLocalizedFont
};
