/* global ILIB_MOONSTONE_PATH */
import ResBundle from '@enact/i18n/ilib/lib/ResBundle';

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
		loadParams: {
			root: ILIB_MOONSTONE_PATH
		},
		...options
	};

	if (!opts.onLoad) return;

	// eslint-disable-next-line no-new
	new ResBundle({
		...opts,
		onLoad: (bundle) => {
			opts.onLoad(bundle || null);
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

export {
	createResBundle,
	getResBundle,
	setResBundle
};
