import {getResBundle} from '../i18n/resBundle';
import {getIStringFromBundle} from '@enact/i18n/src/resBundle';

function toIString (str) {
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
function $L (str) {
	return String(toIString(str));
}

export default $L;
export {
	$L
};
