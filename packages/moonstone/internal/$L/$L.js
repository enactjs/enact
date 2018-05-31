/* global ILIB_MOONSTONE_PATH */

import ResBundle from '@enact/i18n/ilib/lib/ResBundle';
import Locale from '@enact/i18n/ilib/lib/Locale';

// The ilib.ResBundle for the active locale used by $L
let resBundle;

/**
 * Creates a new ilib.ResBundle for string translation
 *
 * @returns {ilib.ResBundle} New ilib.ResBundle
 */
function getResBundle () {
	let currLoc = new Locale();
	console.log("**********************************************");
	console.log(ILIB_MOONSTONE_PATH);
	if (typeof ILIB_MOONSTONE_PATH === 'string' && (!resBundle ||
			currLoc.getSpec() !== resBundle.getLocale().getSpec())) {
		resBundle = new ResBundle({
			loadParams: {
				root: ILIB_MOONSTONE_PATH
			}
		});
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


/**
* Localized internal Moonstone strings from iLib translations.
*
* @param {String} str - String to be localized.
* @returns {String} Localized string.
*/
function $L (str) {
	const rb = getResBundle();
	const isObject = typeof str === 'object';
	if (!rb) {
		return isObject ? str.value : str;
	}
	return isObject ? rb.getString(str.value, str.key).toString() : rb.getString(str).toString();
}

export default $L;
export {
	$L,
	getResBundle,
	clearResBundle
};
