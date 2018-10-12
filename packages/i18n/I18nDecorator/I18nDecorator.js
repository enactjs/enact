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
import {Job} from '@enact/core/util';
import PropTypes from 'prop-types';
import React from 'react';

import {isRtlLocale, updateLocale} from '../locale';
import ilib from '../src/index.js';
import {setResBundleLocale} from '../src/resBundle';

import getI18nClasses from './getI18nClasses';

const contextTypes = {
	rtl: PropTypes.bool,
	updateLocale: PropTypes.func
};

const I18nContext = React.createContext(null);

/**
 * Default config for `ResolutionDecorator`.
 *
 * @memberof i18n/I18nDecorator.I18nDecorator
 * @hocconfig
 */
const defaultConfig = {
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
	const {sync} = config;

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
			const ilibLocale = ilib.getLocale();
			const locale = props.locale && props.locale !== ilibLocale ? updateLocale(props.locale) : ilibLocale;

			let rtl = false;

			if (sync) {
				isRtlLocale({
					onLoad: (isRtl) => {
						rtl = isRtl;
					}
				});
			} else {
				this.loadResourceJob = new Job(this.setState.bind(this))
			}

			this.state = {
				locale,
				rtl,
				resourcesLoaded: sync
			};

			setResBundleLocale(locale, sync);
		}

		getChildContext () {
			return {
				Subscriber: this.publisher.getSubscriber(),
				rtl: this.state.rtl,
				updateLocale: this.updateLocale
			};
		}

		componentDidMount () {
			this.publisher = Publisher.create('i18n', this.context.Subscriber);
			this.publisher.publish({
				locale: this.state.locale,
				rtl: this.state.rtl
			});

			if (typeof window === 'object') {
				on('languagechange', this.handleLocaleChange, window);
			}

			this.loadResources();
		}

		componentWillReceiveProps (newProps) {
			if (newProps.locale) {
				this.updateLocale(newProps.locale);
			}
		}

		componentWillUnmount () {
			this.loadResourceJob.stop();
			if (typeof window === 'object') {
				off('languagechange', this.handleLocaleChange, window);
			}
		}

		loadResources () {
			if (!this.state.resourcesLoaded) {
				this.loadResourceJob.promise(new Promise((resolve, reject) => {
					return isRtlLocale({sync, onLoad: rtl => resolve({rtl})})
				}));
			}
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
			const locale = updateLocale(newLocale);
			setResBundleLocale(locale, sync);

			this.setState({
				locale
			});

			this.publisher.publish({
				locale,
				rtl: isRtlLocale()
			});
		}

		render () {
			const props = Object.assign({}, this.props);
			let classes = getI18nClasses();
			if (this.props.className) {
				classes = this.props.className + ' ' + classes;
			}

			const value = {
				locale: this.state.locale,
				rtl: isRtlLocale(),
				updateLocale: this.updateLocale
			};

			delete props.locale;

			return (
				<I18nContext.Provider value={value}>
					<Wrapped {...props} className={classes} />
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
