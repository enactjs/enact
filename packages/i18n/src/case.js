// import CaseMapper from '../ilib/lib/CaseMapper';
import CaseMapper from 'ilib/lib/CaseMapper';

let toLowerCaseMapper, toUpperCaseMapper;

/**
 * Set CaseMapper object references to ilib's current locale (its most recently set, by default)
 *
 * @returns {undefined}
 */
function initCaseMappers () {
	toLowerCaseMapper = new CaseMapper({direction: 'tolower'});
	toUpperCaseMapper = new CaseMapper({direction: 'toupper'});
}

/**
 * Locale-safely convert a string to lower case.
 *
 * @function
 * @param {String} inString String to convert to lower case
 * @returns {String} Lower-cased string
 */
const toLowerCase = function (inString) {
	if (inString != null) {
		return toLowerCaseMapper.map(inString.toString());
	}
	return inString;
};

/**
 * Locale-safely convert a string to upper case.
 *
 * @function
 * @param {String} inString String to convert to upper case
 * @returns {String} Upper-cased string
 */
const toUpperCase = function (inString) {
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
