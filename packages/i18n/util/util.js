/**
 * A collection of locale-aware text utility function.
 *
 * @module i18n/util
 * @exports isRtlText
 * @exports toCapitalized
 * @exports toLowerCase
 * @exports toUpperCase
 * @exports toWordCase
 */
import '../src/glue';
import {toLowerCase, toUpperCase} from '../src/case';

/*
 * This regex pattern is used by the [isRtlText()]{@link i18n/utils.isRtlText} function.
 *
 * Arabic: \u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFE
 * Hebrew: \u0590-\u05FF\uFB1D-\uFB4F
 *
 * @private
 */
const rtlPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFE\u0590-\u05FF\uFB1D-\uFB4F]/;

/**
 * Takes content `str` and determines whether or not it is [RTL]{@link /docs/developer-guide/glossary/#rtl}.
 *
 * @function
 * @memberof i18n/util
 * @param {String} str - A string to check the [RTL]{@link /docs/developer-guide/glossary/#rtl}-ness of.
 * @returns {Boolean} `true` if `str` should be RTL; `false` if not.
 * @public
 */
const isRtlText = function (str) {
	if (typeof str === 'string') {
		return rtlPattern.test(str);
	}

	return false;
};

/**
 * Capitalizes the first letter of a given string (locale aware).
 *
 * @function
 * @memberof i18n/util
 * @param {String} str - The string to capitalize.
 * @returns {String} The capitalized string.
 * @public
 */
const toCapitalized = function (str) {
	return toUpperCase(str.slice(0, 1)) + str.slice(1);
};

/**
 * Capitalizes every word in a string. Words are separated by spaces, not necessarily
 * word-breaks (locale aware).
 *
 * @function
 * @memberof i18n/util
 * @param {String} str - The string to capitalize.
 * @returns {String} The word-cased string.
 * @public
 */
const toWordCase = (str) => {
	return str.split(' ').map(toCapitalized).join(' ');
};

/**
 * Locale-safely convert a string to lower case.
 *
 * @name toLowerCase
 * @function
 * @memberof i18n/util
 * @param {String} inString String to convert to lower case
 * @returns {String} Lower-cased string
 * @public
 */

/**
 * Locale-safely convert a string to upper case.
 *
 * @name toUpperCase
 * @function
 * @memberof i18n/util
 * @param {String} inString String to convert to upper case
 * @returns {String} Upper-cased string
 * @public
 */

export {
	isRtlText,
	toCapitalized,
	toLowerCase,
	toUpperCase,
	toWordCase
};
