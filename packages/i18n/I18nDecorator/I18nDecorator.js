/**
 * Adds Internationalization (I18N) support to an application using ilib.
 *
 * @module i18n/I18nDecorator
 * @exports I18nDecorator
 * @exports I18nContextDecorator
 * @exports I18nContext
 */

import {on, off} from '@enact/core/dispatcher';
import hoc from '@enact/core/hoc';
import {Publisher, contextTypes as stateContextTypes} from '@enact/core/internal/PubSub';
import PropTypes from 'prop-types';
import React from 'react';

import ilib from '../ilib/lib/ilib';
import Charset from '../ilib/lib/Charset';
import Country from '../ilib/lib/Country';
import DateFmt from '../ilib/lib/DateFmt';
import IString from '../ilib/lib/IString';
import LocaleInfo from '../ilib/lib/LocaleInfo';
import UnitFmt from '../ilib/lib/UnitFmt';
import {isRtlLocale, updateLocale} from '../locale';
import ilibPromise from '../src/promise';

import getI18nClasses from './getI18nClasses';

const hasLocaleChanged = (newLocale) => newLocale !== ilib.getLocale();

const contextTypes = {
	rtl: PropTypes.bool,
	updateLocale: PropTypes.func
};

const decoratorDefaultConfig = {
	loader: null,
	preloadResources: false
};

const I18nContext = React.createContext(null);

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
const I18nDecorator = hoc(decoratorDefaultConfig, (config, Wrapped) => {
	const {loader, preloadResources} = config;

	const shouldPreloadResource = (name) => {
		return preloadResources === true || (
			Array.isArray(preloadResources) && preloadResources.indexOf(name) >= 0
		);
	};

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

		static contextTypes = stateContextTypes
		static childContextTypes = {...contextTypes, ...stateContextTypes}

		constructor (props) {
			super(props);

			this.updateLocale(props.locale || ilib.getLocale());

			this.state = {
				classes: '',
				locale: null,
				rtl: false,
				updateLocale: this.updateLocale
			};
		}

		getChildContext () {
			return {
				Subscriber: this.publisher.getSubscriber(),
				rtl: isRtlLocale(),
				updateLocale: this.updateLocale
			};
		}

		componentWillMount () {
			this.publisher = Publisher.create('i18n', this.context.Subscriber);

			const {rtl, locale} = this.state;
			if (locale) {
				this.publisher.publish({
					locale,
					rtl
				});
			}
		}

		componentDidMount () {
			if (typeof window === 'object') {
				on('languagechange', this.handleLocaleChange, window);
			}
		}

		componentWillReceiveProps (newProps) {
			if (newProps.locale) {
				this.updateLocale(newProps.locale);
			}
		}

		componentWillUnmount () {
			if (typeof window === 'object') {
				off('languagechange', this.handleLocaleChange, window);
			}
		}

		handleLocaleChange = () => {
			this.updateLocale();
		}

		preloadResources () {
			if (!preloadResources) return;

			// Need to pass options as second arg and explicitly rely on the default behavior when
			// the first arg, locale, is unset
			// eslint-disable-next-line no-undefined
			return ilibPromise(LocaleInfo, [undefined]).then(() => Promise.all([
				shouldPreloadResource('unit') ? ilibPromise(UnitFmt) : null,
				shouldPreloadResource('country') ? ilibPromise(Country) : null,
				shouldPreloadResource('date') ? ilibPromise(DateFmt) : null,
				shouldPreloadResource('charset') ? ilibPromise(Charset, [], {name: 'US-ASCII'}) : null,
				shouldPreloadResource('string') ? new Promise(resolve => {
					return IString.loadPlurals(false, null, null, resolve);
				}) : null,
				loader ? loader() : null
			]));
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
		updateLocale = async (newLocale) => {
			const locale = await updateLocale(newLocale);

			if (hasLocaleChanged(newLocale)) return;

			const [rtl, classes] = await Promise.all([
				isRtlLocale(),
				getI18nClasses(),
				this.preloadResources()
			]);

			if (hasLocaleChanged(newLocale)) return;

			this.setState({
				classes,
				locale,
				rtl
			});

			this.publisher.publish({
				locale,
				rtl
			});
		}

		render () {
			if (!this.state.locale) return null;

			const props = Object.assign({}, this.props);

			let classes = this.state.classes;
			if (this.props.className) {
				classes = this.props.className + ' ' + this.state.classes;
			}

			delete props.locale;

			return (
				<I18nContext.Provider value={this.state}>
					<Wrapped {...props} className={classes} />
				</I18nContext.Provider>
			);
		}
	};
});

const defaultConfig = {
	localeProp: null,
	rtlProp: null,
	updateLocaleProp: null
};

const I18nContextDecorator = hoc(defaultConfig, (config, Wrapped) => {
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
