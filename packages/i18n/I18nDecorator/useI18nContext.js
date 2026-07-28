import {createContext, useContext} from 'react';

const I18nContext = createContext(null);

/**
 * Object returned by `useI18nContext`
 *
 * @typedef {Object} useI18nContextInterface
 * @memberof i18n/I18nDecorator
 * @property {Boolean}  loaded       `true` when external resource files have been loaded
 * @property {Boolean}  rtl          `true` for locales with right-to-left reading order
 * @property {Function} updateLocale Updates the locale
 * @property {String}   locale       Current locale
 * @private
 */

/**
 * Retrieves the current locale and a method to update the current locale
 *
 * @returns {useI18nContextInterface}
 * @private
 */
function useI18nContext () {
	// This isn't adding much value but does allow a layer of abstraction so we don't have to export
	// the I18nContext object and can add private API if needed later.
	return useContext(I18nContext);
}

export default useI18nContext;
export {
	useI18nContext,
	I18nContext
};
