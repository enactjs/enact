import useClass from '@enact/core/useClass';
import {useState, useEffect} from 'react';

import ilib from '../iLibLink';

import I18n from './I18n';

/**
 * Configuration for `useI18n`
 *
 * @typedef {Object} useI18nConfig
 * @memberof i18n/I18nDecorator
 * @property {String[]}   [latinLanguageOverrides]    Locales that should be treated as latin
 * @property {String[]}   [nonLatinLanguageOverrides] Locales that should be treated as non-latin
 * @property {Function}   [onLoadResources]           Called when resources have been loaded after a
 *                                                    locale change
 * @property {Function[]} [resources]                 Additional resource callbacks to be invoked
 *                                                    during a locale change
 * @property {Boolean}    [sync = false]              Load the resources synchronously
 * @private
 */

/**
 * Object returned by `useI18n`
 *
 * @typedef {Object} useI18nInterface
 * @property {String}  className CSS classes that should be applied to the root node
 * @property {Boolean} loaded    Indicates if resources have been loaded
 * @property {String}  locale    Current locale
 * @property {Boolean} rtl       Indicates the current locale uses right-to-left text direction
 * @private
 */

/**
 * Adds internationalization support
 *
 * @param {useI18nConfig} config Configuration options
 * @returns {useI18nInterface}
 * @private
 */
function useI18n ({locale, ...config} = {}) {
	const ilibLocale = ilib.getLocale();
	locale = locale && locale !== ilibLocale ? locale : ilibLocale;

	const [state, setState] = useState({
		locale,
		loaded: Boolean(config.sync)
	});

	const i18n = useClass(I18n, config);
	i18n.setContext(locale, setState);

	// Add/remove listeners on mount/unmount
	useEffect(() => {
		i18n.load();

		return () => i18n.unload();
	}, [i18n]);

	return {
		...state,
		updateLocale: i18n.updateLocale
	};
}

export default useI18n;
export {
	useI18n
};
