import IString from 'ilib/lib/IString';
import ResBundle from 'ilib/lib/ResBundle';

import type {IlibCallbackOptions} from '../types/IlibCallbackOptions';
import type {TranslatableString} from '../types/TranslatableString';

interface CreateResBundleOptions extends IlibCallbackOptions<ResBundle | null> {
	/**
	 * Locale for the resource bundle
	 */
	locale?: string;
}

// The ilib.ResBundle for the active locale used by $L
let resBundle: ResBundle | null | undefined;

/**
 * Returns the current ilib.ResBundle
 *
 * @returns {ilib.ResBundle} Current ResBundle
 */
function getResBundle (): ResBundle | null | undefined {
	return resBundle;
}

/**
 * Creates a new ilib.ResBundle for string translation
 *
 * @param  {ilib.Locale} locale Locale for ResBundle
 *
 * @returns {Promise|ResBundle} Resolves with a new ilib.ResBundle
 */
function createResBundle (options: CreateResBundleOptions) {
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
			opts.onLoad!(bundle || null);
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
function setResBundle (bundle: ResBundle | null): ResBundle | null {
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
 * @param {ResBundle} rb ilib resource bundle
 * @returns	{IString} The string value wrapped by an IString
 */
function getIStringFromBundle (str: string | TranslatableString, rb?: ResBundle | null): IString {
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
export type {CreateResBundleOptions};
