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
import {setResBundleLocale} from '../src/resBundle';

/**
 * Tell whether or not the given locale is considered a non-Latin locale for webOS purposes. This
 * controls which fonts are used in various places to show the various languages. An undefined spec
 * parameter means to test the current locale.
 *
 * @memberof i18n/locale
 * @param {ilib.Locale|string|undefined} spec locale specifier or locale object of the locale to
 *	test, or undefined to test the current locale
 * @returns {Boolean} `true` if non-Latin locale
 */
function isNonLatinLocale (spec) {
	const li = new LocaleInfo(spec),
		locale = li.getLocale();

	// We use the non-latin fonts for these languages (even though their scripts are technically
	// considered latin)
	const nonLatinLanguageOverrides =  ['vi', 'en-JP'];
	// We use the latin fonts (with non-Latin fallback) for these languages (even though their
	// scripts are non-latin)
	const latinLanguageOverrides = ['ko', 'ha'];

	return (
		(
			// the language actually is non-latin
			li.getScript() !== 'Latn' ||
			// the language is treated as non-latin
			nonLatinLanguageOverrides.indexOf(locale.getLanguage()) !== -1 ||
			// the combination of language and region is treated as non-latin
			nonLatinLanguageOverrides.indexOf(locale.toString()) !== -1
		) && (
			// the non-latin language should be treated as latin
			latinLanguageOverrides.indexOf(locale.getLanguage()) < 0
		)
	);
}

/**
 * Returns `true` if current locale is a right-to-left locale
 *
 * @memberof i18n/locale
 * @returns {Boolean} `true` if current locale is a right-to-left locale
 */
function isRtlLocale () {
	const li = new LocaleInfo();
	const scriptName = li.getScript();
	const script = new ScriptInfo(scriptName);
	return script.getScriptDirection() === 'rtl';
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
	// load any external ilib data
	ilib.data = global.ilibData || ilib.data;
	// ilib handles falsy values and automatically uses local locale when encountered which
	// is expected and desired
	ilib.setLocale(locale);
	const newLocale = ilib.getLocale();
	// we supply whatever ilib determined was actually the locale based on what was passed in
	setResBundleLocale(newLocale);
	// Recreate the case mappers to use the just-recently-set locale
	initCaseMappers();

	return newLocale;
};

export {
	isNonLatinLocale,
	isRtlLocale,
	updateLocale
};
