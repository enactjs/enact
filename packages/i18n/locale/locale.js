/**
 * Exports the {@link i18n/locale.isNonLatinLocale}, {@link i18n/locale.isRtlLocale} and
 * {@link i18n/locale.updateLocale} functions.
 *
 * @module i18n/locale
 * @private
 */

import ilib from '../ilib/lib/ilib';
import LocaleInfo from '../ilib/lib/LocaleInfo';
import ScriptInfo from '../ilib/lib/ScriptInfo';

import {initCaseMappers} from '../src/case';

// Returns `true` if a locale list is provided and it includes either the language (the first part
// of the spec e.g. ko) or the entire spec (e.g. ko-KR)
const includesLocale = (localeList, locale) => Array.isArray(localeList) && (
	localeList.includes(locale.getLanguage()) ||
	localeList.includes(locale.toString())
);

/**
 * Tell whether or not the given locale is considered a non-Latin locale for webOS purposes. This
 * controls which fonts are used in various places to show the various languages. An undefined spec
 * parameter means to test the current locale.
 *
 * @memberof i18n/locale
 * @param {ilib.Locale|string|undefined} spec locale specifier or locale object of the locale to
 *	test, or undefined to test the current locale
 * @param {Object} [options] An object configuring the request. Must include an `onLoad` member to
 *                           receive the result.
 */
function isNonLatinLocale (spec, options = {}) {
	const {onLoad, latinLanguageOverrides, nonLatinLanguageOverrides, ...rest} = options;

	if (!onLoad) return;
	console.log(`called for ${spec}`)

	// eslint-disable-next-line no-new
	new LocaleInfo(spec, {
		...rest,
		onLoad: (li) => {
			const locale = li.getLocale();
			console.log(li);
			console.log(li.getScript());

			onLoad(
				// the language actually is non-latin and should not be treated as latin
				(li.getScript() !== 'Latn' && !includesLocale(latinLanguageOverrides, locale)) ||
				// the language is latin but should be treated as non-latin
				includesLocale(nonLatinLanguageOverrides, locale)
			);
		}
	});
}

/**
 * Determines if current locale is a right-to-left locale.
 *
 * @memberof i18n/locale
 * @param {Object} [options] An object configuring the request. Must include an `onLoad` member to
 *                           receive the result.
 */
function isRtlLocale (options = {}) {
	const {onLoad, sync} = options;

	if (!onLoad) return;

	// eslint-disable-next-line no-new
	new LocaleInfo(ilib.getLocale(), {
		...options,
		onLoad: (li) => {
			const scriptName = li.getScript();
			// eslint-disable-next-line no-new
			new ScriptInfo(scriptName, {
				sync,
				onLoad: (script) => {
					onLoad(script.getScriptDirection() === 'rtl');
				}
			});
		}
	});
}

/**
 * This Enact hook lets us know that the system locale has changed and gives
 * us a chance to update the iLib locale before Enact broadcasts its
 * `onlocalechange` signal.
 * Provide a locale string, like 'en-US' or 'ja-JP', to conveniently set
 * that locale immediately. Provide nothing, and reset the locale back to the
 * browser's default language.
 *
 * @memberof i18n/locale
 * @param {String} locale Locale identifier
 * @returns {undefined}
 */
const updateLocale = function (locale) {
	// blow away the cache to force it to reload the manifest files for the new app
	// eslint-disable-next-line no-undefined
	if (ilib._load) ilib._load.manifest = undefined;
	// remove the cache of the platform name to allow transition between snapshot and browser
	delete ilib._platform;
	// load any external ilib/resbundle data
	ilib.data = global.ilibData || ilib.data;
	ilib.data.cache = ilib.data.cache || {};
	ilib.data.cache['ResBundle-strings'] = global.resBundleData || {};
	// ilib handles falsy values and automatically uses local locale when encountered which
	// is expected and desired
	ilib.setLocale(locale);
	const newLocale = ilib.getLocale();
	// Recreate the case mappers to use the just-recently-set locale
	initCaseMappers();

	return newLocale;
};

export {
	isNonLatinLocale,
	isRtlLocale,
	updateLocale
};
