import IString from '../ilib/lib/IString';
import ResBundle from '../ilib/lib/ResBundle';

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
 * @returns {Promise|ResBundle} Resolves with a new ilib.ResBundle
 */
function createResBundle (options) {
	const opts = {
		type: 'html',
		name: 'strings',
		lengthen: true,		// if pseudo-localizing, this tells it to lengthen strings
		...options
	};

	if (!opts.onLoad) return;

	// eslint-disable-next-line no-new
	new ResBundle({
		...opts,
		onLoad: (bundle) => {
			if (bundle) {
				opts.onLoad(bundle);
			}

			opts.onLoad();
		}
	});
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
 * Retrieves an IString from a resource bundle by key.
 *
 * If the bundle doesn't exist, the key is returned wrapped by IString.
 *
 * @param {String|Object} str Key for localized string
 * @param {ResBundl} rb ilib resource bundle
 * @returns	{IString} The string value wrapped by an IString
 */
function getIStringFromBundle (str, rb) {
	const isObject = typeof str === 'object';
	if (rb) {
		return isObject ? rb.getString(str.value, str.key) : rb.getString(str);
	}

	return new IString(isObject ? str.value : str);
}

export {
	clearResBundle,
	createResBundle,
	getIStringFromBundle,
	getResBundle,
	setResBundle
};
