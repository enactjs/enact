import ResBundle from '../ilib/lib/ResBundle';
import Locale from '../ilib/lib/Locale';

// The ilib.ResBundle for the active locale used by $L
let resBundle;

/**
 * Returns the current ilib.ResBundle
 *
 * @returns {ilib.ResBundle} Current ResBundle
 */
function getResBundle () {
	console.error("src/resBundle.js getResBundle");
	return resBundle;
}

/**
 * Creates a new ilib.ResBundle for string translation
 *
 * @param  {ilib.Locale} locale Locale for ResBundle
 *
 * @returns {ilib.ResBundle} New ilib.ResBundle
 */
function createResBundle (locale) {
	console.error("src/resBundle.js createResBundle");
	resBundle = new ResBundle({
		locale: locale,
		type: 'html',
		name: 'strings',
		sync: true,
		lengthen: true		// if pseudo-localizing, this tells it to lengthen strings
	});

	return resBundle;
}

/**
 * Set the locale for the strings that $L loads. This may reload the
 * string resources if necessary.
 * @param {string} spec the locale specifier
 * @returns {undefined}
 */
function setResBundleLocale (spec) {
	console.error("src/resBundle.js setResBundleLocale");
	// Load any ResBundle external data into cache.
	ResBundle.strings = ResBundle.strings || {};
	ResBundle.strings.cache = global.resBundleData || ResBundle.strings.cache;
	// Get active bundle and if needed, (re)initialize.
	const locale = new Locale(spec);
	const rb = getResBundle();
	if (!rb || spec !== rb.getLocale().getSpec()) {
		createResBundle(locale);
	}
}

/**
 * Deletes the current bundle object of strings and clears the cache.
 * @returns {undefined}
 */
function clearResBundle () {
	console.error("src/resBundle.js clearResBundle");
	delete ResBundle.strings;
	delete ResBundle.sysres;
	resBundle = null;
}

export {
	getResBundle,
	setResBundleLocale,
	clearResBundle
};
