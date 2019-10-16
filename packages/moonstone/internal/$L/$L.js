/* global ILIB_MOONSTONE_PATH */

import {getIStringFromBundle} from '@enact/i18n/src/resBundle';
import ResBundle from 'ilib/lib/ResBundle';
import ilib from 'ilib';

// The ilib.ResBundle for the active locale used by $L
let resBundle;

// The ilib.data cache object for moonstone ilib usage
let cache = {};

/**
 * Returns the current ilib.ResBundle
 *
 * @returns {ilib.ResBundle} Current ResBundle
 */
function getResBundle () {
	return resBundle;
}

/**
 * Creates a new ilib.ResBundle for string translation
 *
 * @param  {ilib.Locale} locale Locale for ResBundle
 *
 * @returns {Promise|ResBundle} Resolves with a new ilib.ResBundle
 */
function createResBundle (options) {
	let opts = options;

	if (typeof ILIB_MOONSTONE_PATH !== 'undefined') {
		opts = {
			loadParams: {
				// Deprecated; to be removed in future
				root: ILIB_MOONSTONE_PATH
			},
			basePath: ILIB_MOONSTONE_PATH,
			...options
		};
	}

	if (!opts.onLoad) return;

	// Swap out app cache for moonstone's
	const appCache = ilib.data;
	ilib.data = global.moonstoneILibCache || cache;

	// eslint-disable-next-line no-new
	new ResBundle({
		...opts,
		onLoad: (bundle) => {
			ilib.data = appCache;
			opts.onLoad(bundle || null);
		}
	});
}

/**
 * Deletes the current bundle object of strings and clears the cache.
 * @returns {undefined}
 */
function clearResBundle () {
	delete ResBundle.strings;
	delete ResBundle.sysres;
	cache = {};
	resBundle = null;
}

/**
 * Set the locale for the strings that $L loads. This may reload the
 * string resources if necessary.
 *
 * @param {string} spec the locale specifier
 * @returns {ilib.ResBundle} Current ResBundle
 */
function setResBundle (bundle) {
	return (resBundle = bundle);
}

function toIString (str) {
	let rb = getResBundle();

	if (!rb) {
		createResBundle({sync: true, onLoad: setResBundle});
	}

	return getIStringFromBundle(str, rb);
}

/**
 * Maps a string or key/value object to a translated string for the current locale.
 *
 * @function
 * @memberof i18n/$L
 * @param  {String|Object} str Source string
 *
 * @returns {String} The translated string
 */
function $L (str) {
	return String(toIString(str));
}

export default $L;
export {
	$L,
	clearResBundle,
	createResBundle,
	setResBundle
};
