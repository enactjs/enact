/* global ILIB_MOONSTONE_PATH */

import {createResBundle as ilibCreateBundle} from '@enact/i18n/src/resBundle';
import ResBundle from '@enact/i18n/ilib/lib/ResBundle';
import Locale from '@enact/i18n/ilib/lib/Locale';
import ilibPromise from '@enact/i18n/src/promise';
import {getIStringFromBundle} from '@enact/i18n/$L';

// The ilib.ResBundle for the active locale used by $L
let resBundle;

function createResBundle () {
	return ilibCreateBundle(null, {
		loadParams: {
			root: ILIB_MOONSTONE_PATH
		}
	}).then(bundle => {
		resBundle = bundle;
	});
}

/**
 * Creates a new ilib.ResBundle for string translation
 *
 * @returns {ilib.ResBundle} New ilib.ResBundle
 */
function getResBundle () {
	let currLoc = new Locale();
	if (typeof ILIB_MOONSTONE_PATH === 'string' && (
		!resBundle || currLoc.getSpec() !== resBundle.getLocale().getSpec()
	)) {
		createResBundle();

		return;
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

async function $$L (strings) {
	const rb = await getResBundle();
	return strings.reduce((result, str) => {
		result[str] = String(getIStringFromBundle(rb, str));
		return result;
	}, {});
}

export default $L;
export {
	$L,
	$$L,
	getResBundle,
	clearResBundle,
	createResBundle
};
