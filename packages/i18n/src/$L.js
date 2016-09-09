import ResBundle from '../ilib/lib/ResBundle';
import Locale from '../ilib/lib/Locale';
import IString from '../ilib/lib/IString';

// The ilib.ResBundle for the active locale used by $L
let resBundle;

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
 * @returns {ilib.ResBundle} New ilib.ResBundle
 */
function createResBundle (locale) {
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
 * Maps a string or key/value object to a translated string for the current locale
 *
 * @param  {String|Object} str Source string
 *
 * @returns {ilib.IString} The translated string
 */
function toIString (str) {
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
 * @param  {String|Object} str Source string
 *
 * @returns {String} The translated string.
 */
function $L (str) {
	return String(toIString(str));
}

/**
 * Set the locale for the strings that $L loads. This may reload the
 * string resources if necessary.
 * @param {string} spec the locale specifier
 * @returns {undefined}
 */
function setLocale (spec) {
	const locale = new Locale(spec);
	const rb = getResBundle();
	if (!rb || spec !== rb.getLocale().getSpec()) {
		createResBundle(locale);
	}
}

export default $L;
export {$L, toIString, setLocale};
