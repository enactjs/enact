/**
 * Adds Internationalization (I18N) support to an application using ilib.
 *
 * @module i18n/I18nDecorator
 * @exports I18nDecorator
 * @exports I18nContextDecorator
 */

import {on, off} from '@enact/core/dispatcher';
import hoc from '@enact/core/hoc';
import {Job} from '@enact/core/util';
import PropTypes from 'prop-types';
import React from 'react';

import {isRtlLocale, updateLocale} from '../locale';
import ilib from '../src/index.js';
import {createResBundle, setResBundle} from '../src/resBundle';
import wrapIlibCallback from '../src/wrapIlibCallback';

import getI18nClasses from './getI18nClasses';

const join = (a, b) => a && b ? a + ' ' + b : (a || b || '');

const contextTypes = {
	rtl: PropTypes.bool,
	updateLocale: PropTypes.func
};

const I18nContext = React.createContext(null);

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
	 * @public null
	 * @memberof i18n/I18nDecorator.I18nDecorator.defaultConfig
	 */
	nonLatinLanguageOverrides: null,

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
 * A higher-order component that is used to wrap the root element in an app. It provides an `rtl` member on the
 * context of the wrapped component, allowing the children to check the current text directionality as well as
 * an `updateLocale` method that can be used to update the current locale.
 *
 * There are no configurable options on this HOC.
 *
 * @class I18nDecorator
 * @memberof i18n/I18nDecorator
 * @hoc
 * @public
 */
const I18nDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {latinLanguageOverrides, nonLatinLanguageOverrides, sync} = config;

	return class extends React.Component {
		static displayName = 'I18nDecorator'

		static propTypes = /** @lends i18n/I18nDecorator.I18nDecorator.prototype */ {
			/**
			 * Classname for a root app element.
			 *
			 * @type {String}
			 * @public
			 */
			className: PropTypes.string,

			/**
			 * A string with a {@link https://tools.ietf.org/html/rfc5646|BCP 47 language tag}.
			 *
			 * The system locale will be used by default.
			 *
			 * @type {String}
			 * @public
			 */
			locale: PropTypes.string
		}

		static childContextTypes = {...contextTypes}

		constructor (props) {
			super(props);
			const ilibLocale = ilib.getLocale();
			const locale = props.locale && props.locale !== ilibLocale ? props.locale : ilibLocale;

			this.loadResourceJob = new Job(this.setState.bind(this));
			this.state = this.getDerivedStateForLocale(locale);
		}

		getChildContext () {
			return {
				rtl: this.state.rtl,
				updateLocale: this.updateLocale
			};
		}

		componentDidMount () {
			if (typeof window === 'object') {
				on('languagechange', this.handleLocaleChange, window);
			}

			this.loadResources(this.state.locale);
		}

		componentWillReceiveProps (nextProps) {
			if (this.props.locale !== nextProps.locale) {
				const state = this.getDerivedStateForLocale(nextProps.locale);
				if (sync) {
					this.setState(state);
				} else {
					this.loadResources(nextProps.locale);
				}
			}
		}

		componentWillUnmount () {
			this.loadResourceJob.stop();
			if (typeof window === 'object') {
				off('languagechange', this.handleLocaleChange, window);
			}
		}

		getDerivedStateForLocale (spec) {
			const locale = updateLocale(spec);

			const state = {
				locale,
				resourcesLoaded: sync
			};

			if (sync) {
				const options = {locale, sync};
				state.rtl = wrapIlibCallback(isRtlLocale, options);
				state.classes = wrapIlibCallback(getI18nClasses, {
					...options,
					latinLanguageOverrides,
					nonLatinLanguageOverrides
				});

				const bundle = wrapIlibCallback(createResBundle, options);
				setResBundle(bundle);
			}

			return state;
		}

		loadResources (locale) {
			const options = {sync, locale};
			const resources = Promise.all([
				wrapIlibCallback(isRtlLocale, options),
				wrapIlibCallback(getI18nClasses, {
					...options,
					latinLanguageOverrides,
					nonLatinLanguageOverrides
				}),
				// move updating into a new method with call to setState
				wrapIlibCallback(createResBundle, options)
			]).then(([rtl, classes, bundle]) => {
				setResBundle(bundle);

				return {
					locale,
					classes,
					rtl,
					resourcesLoaded: true
				};
			});
			// TODO: Resolve how to handle failed resource resquests
			// .catch(...);

			this.loadResourceJob.promise(resources);
		}

		handleLocaleChange = () => {
			this.updateLocale();
		}

		/**
		 * Updates the locale for the application. If `newLocale` is omitted, the locale will be
		 * reset to the device's default locale.
		 *
		 * @param	{String}	newLocale	Locale identifier string
		 *
		 * @returns	{undefined}
		 * @public
		 */
		updateLocale = (newLocale) => {
			const state = this.getDerivedStateForLocale(newLocale);

			if (sync) {
				this.setState(state);
			} else {
				this.loadResources(newLocale);
				this.setState({resourcesLoaded: false});
			}
		}

		render () {
			const props = Object.assign({}, this.props);
			delete props.locale;

			props.className = join(this.state.classes, this.props.className);

			const value = {
				locale: this.state.locale,
				rtl: this.state.rtl,
				loaded: this.state.resourcesLoaded,
				updateLocale: this.updateLocale
			};

			return (
				<I18nContext.Provider value={value}>
					<Wrapped {...props} />
				</I18nContext.Provider>
			);
		}
	};
});

const contextDefaultConfig = {
	localeProp: null,
	rtlProp: null,
	updateLocaleProp: null
};

const I18nContextDecorator = hoc(contextDefaultConfig, (config, Wrapped) => {
	const {localeProp, rtlProp, updateLocaleProp} = config;

	// eslint-disable-next-line no-shadow
	return function I18nContextDecorator (props) {
		return (
			<I18nContext.Consumer>
				{(i18nContext) => {

					if (i18nContext) {
						const {locale, rtl, updateLocale: update} = i18nContext;

						props = Object.assign({}, props);
						if (localeProp) {
							props[localeProp] = locale;
						}

						if (rtlProp) {
							props[rtlProp] = rtl;
						}

						if (updateLocaleProp) {
							props[updateLocaleProp] = update;
						}
					}

					return (
						<Wrapped {...props} />
					);
				}}
			</I18nContext.Consumer>
		);
	};
});

export default I18nDecorator;
export {
	contextTypes,
	I18nContext,
	I18nContextDecorator,
	I18nDecorator
};
