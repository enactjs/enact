import {isNonLatinLocale, isRtlLocale} from '../locale';
import LocaleInfo from '../ilib/lib/LocaleInfo';

/**
 * A function that returns locale in class name.
 *
 * @memberof i18n/I18nDecorator
 * @returns {String} Class
 * @private
 */
function getI18nClasses () {
	const li = new LocaleInfo(); // for the current locale
	const locale = li.getLocale();
	const base = 'enact-locale-';
	const classes = [];

	if (isNonLatinLocale(locale)) {
		// allow enact to define other fonts for non-Latin languages, or for certain
		// Latin-based languages where the characters with some accents don't appear in the
		// regular fonts, creating a strange 'ransom note' look with a mix of fonts in the
		// same word. So, treat it like a non-Latin language in order to get all the characters
		// to display with the same font.
		classes.push(base + 'non-latin');
	}

	const scriptName = li.getScript();
	if (scriptName !== 'Latn' && scriptName !== 'Cyrl' && scriptName !== 'Grek') {
		// GF-45884: allow enact to avoid setting italic fonts for those scripts that do not
		// commonly use italics
		classes.push(base + 'non-italic');
	}

	// allow enact to apply right-to-left styles to the app and widgets if necessary
	if (isRtlLocale()) {
		classes.push(base + 'right-to-left');
	}

	// allow enact or the apps to give CSS classes that are specific to the language, country, or script
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

export default getI18nClasses;
