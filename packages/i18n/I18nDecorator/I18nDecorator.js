/**
 * Adds Internationalization (I18N) support to an application using ilib.
 *
 * @module i18n/I18nDecorator
 * @exports I18nDecorator
 * @exports I18nContextDecorator
 */

import hoc from '@enact/core/hoc';
import PropTypes from 'prop-types';

import '../src/glue';

import useI18n from './useI18n';
import {useI18nContext, I18nContext} from './useI18nContext';

const join = (a, b) => a && b ? a + ' ' + b : (a || b || '');

/**
 * Default config for `I18nDecorator`.
 *
 * @memberof i18n/I18nDecorator.I18nDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Array of locales that should be treated as latin regardless of their script.
	 *
	 * @type {String[]}
	 * @default	null
	 * @public
	 * @memberof i18n/I18nDecorator.I18nDecorator.defaultConfig
	 */
	latinLanguageOverrides: null,

	/**
	 * Array of locales that should be treated as non-latin regardless of their script.
	 *
	 * @type {String[]}
	 * @default null
	 * @public
	 * @memberof i18n/I18nDecorator.I18nDecorator.defaultConfig
	 */
	nonLatinLanguageOverrides: null,

	/**
	 * Array of resource loaders to be invoked after a locale change.
	 *
	 * Each loader must be a function which accepts an object and returns either the resource when
	 * `options.sync` is `true` or a `Promise` for the resource when `options.sync` is `false`.
	 *
	 * ```
	 * resources: [
	 *   (options) => new Promise((resolve, reject) => {
	 *     fetchResource({onLoad: resolve, onError: reject});
	 *   })
	 * ]
	 * ```
	 *
	 * If you need to handle the resource in some way on load, you can pass an object with an
	 * `onLoad` member that will be called once all resources have been loaded. This should be used
	 * if loading a resource has side effects that should only be applied once all loading has
	 * completed.
	 *
	 * ```
	 * resources: [
	 *   {resource: (options) => { ... fetch ... }, onLoad: (res) => { ... apply side effect ... }}
	 * ]
	 * ```
	 *
	 * @type {Array<Function|Object>}
	 * @default null
	 * @public
	 * @memberof i18n/I18nDecorator.I18nDecorator.defaultConfig
	 */
	resources: null,

	/**
	 * Retrieve i18n resource files synchronously
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 * @memberof i18n/I18nDecorator.I18nDecorator.defaultConfig
	 */
	sync: false
};

/**
 * A higher-order component that is used to wrap the root element in an app. It provides an `rtl`
 * member on the context of the wrapped component, allowing the children to check the current text
 * directionality as well as an `updateLocale` method that can be used to update the current locale.
 *
 * There are no configurable options on this HOC.
 *
 * Note: This HoC passes `className` to the wrapped component. It must be passed to the main DOM
 * node.
 *
 * @class I18nDecorator
 * @memberof i18n/I18nDecorator
 * @hoc
 * @public
 */
const I18nDecorator = hoc(defaultConfig, (config, Wrapped) => {
	// eslint-disable-next-line no-shadow
	function I18nDecorator (props) {
		const {locale, ...rest} = props;
		const {className: i18nClassName, ...i18n} = useI18n({
			locale,
			...config
		});

		const className = join(i18nClassName, props.className);

		return (
			<I18nContext.Provider value={i18n}>
				<Wrapped {...rest} className={className} />
			</I18nContext.Provider>
		);
	}

	I18nDecorator.propTypes = /** @lends i18n/I18nDecorator.I18nDecorator.prototype */ {
		/**
		 * Classes to apply to the wrapped component.
		 *
		 * @type {String}
		 * @public
		 */
		className: PropTypes.string,

		/**
		 * The locale to use.
		 *
		 * A string with a {@link https://tools.ietf.org/html/rfc5646|BCP 47 language tag}. The
		 * system locale will be used by default.
		 *
		 * @type {String}
		 * @public
		 */
		locale: PropTypes.string
	};

	return I18nDecorator;
});

const contextDefaultConfig = {
	localeProp: null,
	rtlProp: null,
	updateLocaleProp: null
};

const I18nContextDecorator = hoc(contextDefaultConfig, (config, Wrapped) => {
	const {loadedProp, localeProp, rtlProp, updateLocaleProp} = config;

	// eslint-disable-next-line no-shadow
	return function I18nContextDecorator (props) {
		const i18nContext = useI18nContext();

		if (i18nContext) {
			const {loaded, locale, rtl, updateLocale} = i18nContext;

			props = {...props};
			if (loadedProp) {
				props[loadedProp] = loaded;
			}

			if (localeProp) {
				props[localeProp] = locale;
			}

			if (rtlProp) {
				props[rtlProp] = rtl;
			}

			if (updateLocaleProp) {
				props[updateLocaleProp] = updateLocale;
			}
		}

		return (
			<Wrapped {...props} />
		);
	};
});

export default I18nDecorator;
export {
	I18nContext,
	I18nContextDecorator,
	I18nDecorator,
	useI18n,
	useI18nContext
};
