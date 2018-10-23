import {isNonLatinLocale, isRtlLocale} from '../locale';
import LocaleInfo from '../ilib/lib/LocaleInfo';

const base = 'enact-locale-';

// Callback-friendly version of Promise.all()
function all (fns, callback) {
	const result = [];
	let complete = 0;

	const done = (index) => (value) => {
		result[index] = value;
		complete++;

		if (complete === fns.length) {
			callback(result);
		}
	};

	fns.forEach((fn, index) => fn(done(index)));
}

function getClassesForLocale (li, options) {
	const locale = li.getLocale();

	all([
		// allow enact to define other fonts for non-Latin languages, or for certain
		// Latin-based languages where the characters with some accents don't appear in the
		// regular fonts, creating a strange 'ransom note' look with a mix of fonts in the
		// same word. So, treat it like a non-Latin language in order to get all the characters
		// to display with the same font.
		(done) => isNonLatinLocale(locale, {
			...options,
			onLoad: (isNonLatin) => done(isNonLatin ? base + 'non-latin' : '')
		}),
		// allow enact to apply right-to-left styles to the app and widgets if necessary
		(done) => isRtlLocale({
			...options,
			onLoad: (isRtl) => done(isRtl ? base + 'right-to-left' : '')
		})
	], function (classes) {
		const scriptName = li.getScript();
		if (scriptName !== 'Latn' && scriptName !== 'Cyrl' && scriptName !== 'Grek') {
			// GF-45884: allow enact to avoid setting italic fonts for those scripts that do not
			// commonly use italics
			classes.push(base + 'non-italic');
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

		options.onLoad(classes.filter(Boolean).join(' '));
	});
}

/*
 * A function that returns locale in class name.
 *
 * @memberof i18n/I18nDecorator
 * @param {options.sync} Perform a synchronous request for the classes
 * @param {options.onLoad} Called with a string of i18n classes
 * @private
 */
function getI18nClasses (options = {}) {
	const {sync, onLoad} = options;
	if (!onLoad) return;

	// eslint-disable-next-line no-new,no-undefined
	new LocaleInfo(undefined, {
		sync,
		onLoad: (li) => getClassesForLocale(li, {
			...options,
			onLoad
		})
	}); // for the current locale
}

export default getI18nClasses;
