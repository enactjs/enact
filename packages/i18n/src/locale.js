import ilib from '../ilib/lib/ilib';
import LocaleInfo from '../ilib/lib/LocaleInfo';
import ScriptInfo from '../ilib/lib/ScriptInfo';

import {initCaseMappers} from './case';
import {setLocale} from './$L';

/*
 * Tell whether or not the given locale is considered a non-Latin locale for webOS purposes. This
 * controls which fonts are used in various places to show the various languages. An undefined spec
 * parameter means to test the current locale.
 *
 * @param {ilib.Locale|string|undefined} spec locale specifier or locale object of the locale to
 *	test, or undefined to test the current locale
 */
function isNonLatinLocale (spec) {
	const li = new LocaleInfo(spec),
		locale = li.getLocale();

	// We use the non-latin fonts for these languages (even though their scripts are technically
	// considered latin)
	const nonLatinLanguageOverrides = ['ha', 'hu', 'vi', 'en-JP'];
	// We use the latin fonts (with non-Latin fallback) for these languages (even though their
	// scripts are non-latin)
	const latinLanguageOverrides = ['ko'];

	/* eslint-disable operator-linebreak */
	return (
		(
			// the language actually is non-latin
			li.getScript() !== 'Latn' ||
			// the language is treated as non-latin
			locale.getLanguage().indexOf(nonLatinLanguageOverrides) !== -1 ||
			// the combination of language and region is treated as non-latin
			locale.toString().indexOf(nonLatinLanguageOverrides) !== -1
		) && (
			// the non-latin language should be treated as latin
			locale.getLanguage().indexOf(latinLanguageOverrides) < 0
		)
	);
	/* eslint-enable operator-linebreak */
}

function isRtlLocale () {
	const li = new LocaleInfo();
	const scriptName = li.getScript();
	const script = new ScriptInfo(scriptName);
	return script.getScriptDirection() === 'rtl';
}

function getI18nClasses () {
	const li = new LocaleInfo(); // for the current locale
	const locale = li.getLocale();
	const base = 'enact-locale-';
	const classes = [];

	if (isNonLatinLocale(locale)) {
		// allow enyo to define other fonts for non-Latin languages, or for certain
		// Latin-based languages where the characters with some accents don't appear in the
		// regular fonts, creating a strange 'ransom note' look with a mix of fonts in the
		// same word. So, treat it like a non-Latin language in order to get all the characters
		// to display with the same font.
		classes.push(base + 'non-latin');
	}

	const scriptName = li.getScript();
	if (scriptName !== 'Latn' && scriptName !== 'Cyrl' && scriptName !== 'Grek') {
		// GF-45884: allow enyo to avoid setting italic fonts for those scripts that do not
		// commonly use italics
		classes.push(base + 'non-italic');
	}

	// allow enyo to apply right-to-left styles to the app and widgets if necessary
	if (isRtlLocale()) {
		classes.push(base + 'right-to-left');
	}

	// allow enyo or the apps to give CSS classes that are specific to the language, country, or script
	if (locale.getLanguage()) {
		classes.push(base + locale.getLanguage());
		if (locale.getScript()) {
			classes.push(base + locale.getLanguage() + '-' + locale.getScript());
			if (locale.getRegion()) {
				classes.push(base + locale.getLanguage() + '-' + locale.getScript() + '-' + locale.getRegion());
			}
		} else if (locale.getRegion()) {
			classes.push(base + locale.getLanguage() + '-' + locale.getRegion());
		}
	}
	if (locale.getScript()) {
		classes.push(base + locale.getScript());
	}
	if (locale.getRegion()) {
		classes.push(base + locale.getRegion());
	}

	return classes.join(' ');
}

/**
 * This Enact hook lets us know that the system locale has changed and gives
 * us a chance to update the iLib locale before Enact broadcasts its
 * `onlocalechange` signal.
 * Provide an locale string, like 'en-US' or 'ja-JP', to conveniently set
 * that locale immediately. Provide nothing, and reset the locale back to the
 * browser's default language.
 *
 * @param {String} locale Locale identifier
 * @returns {undefined}
 */
const updateLocale = function (locale) {
	// blow away the cache to force it to reload the manifest files for the new app
	// eslint-disable-next-line no-undefined
	if (ilib._load) ilib._load.manifest = undefined;
	// ilib handles falsy values and automatically uses local locale when encountered which
	// is expected and desired
	ilib.setLocale(locale);
	const newLocale = ilib.getLocale();
	// we supply whatever ilib determined was actually the locale based on what was passed in
	setLocale(newLocale);
	// Recreate the case mappers to use the just-recently-set locale
	initCaseMappers();

	return newLocale;
};

export {updateLocale, isRtlLocale, getI18nClasses};
