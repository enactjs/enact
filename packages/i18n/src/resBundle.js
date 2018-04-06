import ResBundle from '../ilib/lib/ResBundle';
import Locale from '../ilib/lib/Locale';

import ilibPromise from './promise';

// The ilib.ResBundle for the active locale used by $L
let resBundle;

/**
 * Returns the current ilib.ResBundle
 *
 * @returns {Promise} Resolves with the current ResBundle
 */
function getResBundle () {
	return resBundle;
}

/**
 * Creates a new ilib.ResBundle for string translation
 *
 * @param  {ilib.Locale} locale Locale for ResBundle
 *
 * @returns {Promise} Resolves with a new ilib.ResBundle
 */
function createResBundle (locale, options) {
	return new Promise((resolve, reject) => {
		// eslint-disable-next-line no-new
		new ResBundle({
			locale: locale,
			type: 'html',
			name: 'strings',
			lengthen: true,		// if pseudo-localizing, this tells it to lengthen strings
			sync: false,
			...options,
			onLoad: (bundle) => {
				resBundle = bundle;

				if (bundle) {
					resolve(bundle);
				}

				reject();
			}
		});
	});
}

/**
 * Set the locale for the strings that $L loads. This may reload the
 * string resources if necessary.
 *
 * @param {string} spec the locale specifier
 * @returns {Promise} Resolves with a new ilib.ResBundle
 */
function setResBundleLocale (spec) {
	// Load any ResBundle external data into cache.
	ResBundle.strings = ResBundle.strings || {};
	ResBundle.strings.cache = global.resBundleData || ResBundle.strings.cache;
	// Get active bundle and if needed, (re)initialize.
	const locale = new Locale(spec);
	if (!resBundle || spec !== resBundle.getLocale().getSpec()) {
		resBundle = createResBundle(locale);
	}

	return resBundle;
}

/**
 * Deletes the current bundle object of strings and clears the cache.
 * @returns {undefined}
 */
function clearResBundle () {
	delete ResBundle.strings;
	delete ResBundle.sysres;
	resBundle = null;
}

export {
	getResBundle,
	setResBundleLocale,
	clearResBundle,
	createResBundle
};
