/**
 * Provides functions to map to translated strings.
 *
 * Usage:
 * ```
 * import $L, {toIString} from '@enact/i18n/$L';
 * $L('Close');        // => "Close" in the current locale
 * toIString('Close'); // => an ilib IString representing "Close" in the current locale
 * ```
 *
 * @module i18n/$L
 * @exports $L
 * @exports $toIString
 */

import type IString from 'ilib/lib/IString';

import '../src/glue';
import {getIStringFromBundle, getResBundle} from '../src/resBundle';

/**
 * A source string with an explicit translation key.
 */
interface TranslatableString {
	key?: string;
	value: string;
}

/**
 * Maps a string or key/value object to a translated string for the current locale.
 *
 * @function
 * @memberof i18n/$L
 * @param  {String|Object} str Source string
 *
 * @returns {ilib.IString} The translated string
 */
function toIString (str: string | TranslatableString): IString {
	const rb = getResBundle();

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
function $L (str: string | TranslatableString): string {
	return String(toIString(str));
}

export default $L;
export {
	$L,
	toIString
};
export type {
	TranslatableString
};
