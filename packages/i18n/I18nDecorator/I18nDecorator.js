/**
 * Adds Internationalization (I18N) support to an application using ilib.
 *
 * @module i18n/I18nDecorator
 * @exports I18nDecorator
 * @exports I18nContextDecorator
 */

import {on, off} from '@enact/core/dispatcher';
import hoc from '@enact/core/hoc';
import {Publisher, contextTypes as stateContextTypes} from '@enact/core/internal/PubSub';
import PropTypes from 'prop-types';
import React from 'react';

import ilib from '../src/index.js';
import {isRtlLocale, updateLocale} from '../locale';

import getI18nClasses from './getI18nClasses';

const contextTypes = {
	rtl: PropTypes.bool,
	updateLocale: PropTypes.func
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
const I18nDecorator = hoc((config, Wrapped) => {	// eslint-disable-line no-unused-vars
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

			this.state = {
				locale: locale,
				rtl: isRtlLocale(),
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
			this.publisher.publish({
				locale: this.state.locale,
				rtl: isRtlLocale()
			});
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
			const updated = {
				locale,
				rtl: isRtlLocale()
			};

			this.setState(updated);
			this.publisher.publish(updated);
		}

		render () {
			const props = Object.assign({}, this.props);
			let classes = getI18nClasses();
			if (this.props.className) {
				classes = this.props.className + ' ' + classes;
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
