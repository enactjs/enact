/**
 * Exports the {@link i18n/$L.$L} function and {@link i18n/$L.toIString} function to map to
 * translated strings.
 *
 * ```
 * import $L, {toIString} from '@enact/i18n/$L';
 * $L('Close');        // => "Close" in the current locale
 * toIString('Close'); // => an ilib IString representing "Close" in the current locale
 * ```
 *
 * @module i18n/$L
 */

import '../src/glue';
import {getResBundle} from '../src/resBundle';
import IString from '../ilib/lib/IString';

/**
 * Maps a string or key/value object to a translated string for the current locale
 *
 * @memberof i18n/$L
 * @param  {String|Object} str Source string
 *
 * @returns {ilib.IString} The translated string
 */
function toIString (str) {
	console.error("$L toIString");
	const rb = getResBundle();
	const isObject = typeof str === 'object';
	if (rb) {
		return isObject ? rb.getString(str.value, str.key) : rb.getString(str);
	}

	return new IString(isObject ? str.value : str);
}

/**
 * Maps a string or key/value object to a translated string for the current locale
 *
 * @memberof i18n/$L
 * @param  {String|Object} str Source string
 *
 * @returns {String} The translated string.
 */
function $L (str) {
	console.error("$L $L");
	return String(toIString(str));
}

export default $L;
export {
	$L,
	toIString
};
