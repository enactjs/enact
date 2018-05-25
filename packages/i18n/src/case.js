import CaseMapper from '../ilib/lib/CaseMapper';

let toLowerCaseMapper, toUpperCaseMapper;

/**
 * Set CaseMapper object references to ilib's current locale (its most recently set, by default)
 *
 * @returns {undefined}
 */
function initCaseMappers () {
	console.error("src/case.js initCaseMappers");
	toLowerCaseMapper = new CaseMapper({direction: 'tolower'});
	toUpperCaseMapper = new CaseMapper({direction: 'toupper'});
}

/**
 * Locale-safely convert a string to lower case.
 *
 * @param {String} inString String to convert to lower case
 * @returns {String} Lower-cased string
 */
const toLowerCase = function (inString) {
	console.error("src/case.js toLowerCase");
	if (inString != null) {
		return toLowerCaseMapper.map(inString.toString());
	}
	return inString;
};

/**
 * Locale-safely convert a string to upper case.
 *
 * @param {String} inString String to convert to upper case
 * @returns {String} Upper-cased string
 */
const toUpperCase = function (inString) {
	console.error("src/case.js toUpperCase");
	if (inString != null) {
		return toUpperCaseMapper.map(inString.toString());
	}
	return inString;
};

export {
	initCaseMappers,
	toLowerCase,
	toUpperCase
};
