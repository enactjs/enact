/*
 * This module loads Moonstone-specific fonts. It exports a primary function,
 * [fontGenerator]{@link moonstone/MoonstoneDecorator.fontGenerator}, utility functions
 * to help with font loading scenarios of components:
 * [onFontsLoaded]{@link moonstone/MoonstoneDecorator.fontGenerator.onFontsLoaded}.
 * The default export, `fontGenerator`, is not intended to be used directly by external developers.
 */

import ilib from '@enact/i18n';
import Locale from '@enact/i18n/ilib/lib/Locale';

const debugFonts = false;
const pendingFontsLoadedCallbacks = [];

let previousLocale = null,
	fontsLoaded = false;

/**
 * The supplied callback will fire after the loading process for all generated fonts is complete.
 * This does not guarantee that each font has successfully loaded; some fonts may have failed to
 * load.  If the callback is requested after the fonts have already been loaded, this will fire
 * immediately, so do not count on this to fire asynchronously.
 *
 * @param  {Function} fn Callback function to run when fonts have loaded
 * @private
 */
const onFontsLoaded = (fn) => {
	if (fontsLoaded) {
		fn();
	} else {
		pendingFontsLoadedCallbacks.push(fn);
	}
};

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
 * @param {String} [locale] Locale string defaulting to the current locale
 * @returns {undefined}
 * @private
 */
function fontGenerator (locale = ilib.getLocale()) {
	// If document object is unavailable, bail out.
	if (typeof document === 'undefined') return;

	// If the locale is the same as the last time this ran, bail out and don't bother to recompile this again.
	if (locale === previousLocale) return;

	// eslint-disable-next-line no-console
	const dev = console;

	previousLocale = locale;
	const
		loc = new Locale(locale),
		language = loc.getLanguage(),
		region = loc.getRegion(),
		debugStyle = ' background-color: #444; padding: 0.25ex 0.5ex;',
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

	const fontDefinitions = [];
	const compiledLocalFontsList = [];

	// Duplications and alternate locale names
	fonts['zh-TW'] = fonts['zh-HK'];

	// Generate a single font-face rule
	const buildFont = function ({localName, name, ...rest}) {
		if (!name) {
			return;
		}
		const fontFace = new window.FontFace(name, 'local("' + localName + '")');
		compiledLocalFontsList.push(localName);
		if (debugFonts) dev.log('%cnew FontFace:', 'color:cyan;' + debugStyle, name, rest.weight, '"' + localName + '"');
		for (let prop in rest) {
			if (rest[prop] != null) fontFace[prop] = rest[prop];
		}
		return fontFace.load();
	};

	// Generate a collection of font-face rules, in multiple font-variants
	const buildFontSet = function (strLang, bitDefault) {
		const fontSet = [],
			name = (bitDefault) ? '' : ' ' + strLang;

		if (fonts[strLang].regular) {
			// Build Regular
			fontSet.push(buildFont({
				name: 'Moonstone LG Display' + name,
				localName: fonts[strLang].regular,
				weight: 400,
				unicodeRange: fonts[strLang].unicodeRange
			}));

			// Build Bold
			if (fonts[strLang].bold) {
				fontSet.push(buildFont({
					name: 'Moonstone LG Display' + name,
					localName: fonts[strLang].bold,
					weight: 700,
					unicodeRange: fonts[strLang].unicodeRange
				}));
			}

			// Build Light
			if (fonts[strLang].light) {
				fontSet.push(buildFont({
					name: 'Moonstone LG Display' + name,
					localName: fonts[strLang].light,
					weight: 300,
					unicodeRange: fonts[strLang].unicodeRange
				}));
			}
		}
		return fontSet;
	};

	// Build all the fonts so they could be explicitly called
	for (let lang in fonts) {
		const fs = buildFontSet(lang);
		fontDefinitions.push( ...fs );

		// Set up the override so "Moonstone LG Display" becomes the local-specific font.
		const [lo, re] = lang.split('-');
		if (lo === language) {
			if (!re || (re && re === region)) {
				if (debugFonts) dev.log('%cOverriding Font:', 'color:yellowgreen;' + debugStyle, lang);
				fontDefinitions.push( ...buildFontSet(lang, true) );
			}
		}
	}

	if (debugFonts) dev.log('%cLets make some fonts:', 'color:limegreen;' + debugStyle, fontDefinitions);
	const loadingErrors = [];
	Promise
		.all(fontDefinitions.map(p => p.catch(e => e)))
		.then(results => {
			results.forEach((loadedFontFace, i) => {
				if (loadedFontFace.message) {
					loadingErrors.push(i);
				} else {
					document.fonts.add(loadedFontFace);
				}
			});
			if (debugFonts) {
				document.fonts.forEach( function (font) {
					dev.log('%cFont Ready:', 'color:goldenrod;' + debugStyle, font.family, font.weight);
				});
			}
			fontsLoaded = true;
			if (loadingErrors.length) {
				dev.groupCollapsed(loadingErrors.length + ' Font(s) Failed to Load. (Not installed locally)');
				loadingErrors.forEach(fontIndex =>
					dev.warn('Font Failed: "' + compiledLocalFontsList[fontIndex] + '"')
				);
				dev.groupEnd();
			}
			pendingFontsLoadedCallbacks.forEach(cb => cb());
		})
		.catch(function (err) {
			dev.error('%cFont Loading Error:', err);
		});
}

/**
 * Check to see if the supplied node is assigned to use a font which has been fully loaded by the
 * browser.
 *
 * NOTE: This feature is under review as a work in progress. Use with caution as the API (inputs
 * outputs) may change in the future, as well as its capabilities.
 *
 * @param  {Node}  node The element to check
 *
 * @return {Boolean}      `true` for loaded, `false` for not loaded
 * @private
 */
function isFontReady (node) {
	if (node) {
		return document.fonts.check( window.getComputedStyle(node).getPropertyValue('font') );
	}
	return false;
}

export default fontGenerator;
export {fontGenerator, isFontReady, onFontsLoaded};
