/**
 * Exports the {@link i18n/I18nDecorator.I18nDecorator} component and
 * {@link i18n/I18nDecorator.contextTypes} validation rules.
 *
 * @module i18n/I18nDecorator
 */

import hoc from '@enact/core/hoc';
import {on, off} from '@enact/core/dispatcher';
import React from 'react';
import PropTypes from 'prop-types';
import {Publisher, contextTypes as stateContextTypes} from '@enact/core/internal/PubSub';

import UnitFmt from '../ilib/lib/UnitFmt';
import Charset from '../ilib/lib/Charset';
import Charmap from '../ilib/lib/Charmap';
import Country from '../ilib/lib/Country';
import DateFmt from '../ilib/lib/DateFmt';
import IString from '../ilib/lib/IString';
import LocaleInfo from '../ilib/lib/LocaleInfo';
import ilibPromise from '../src/promise';
import {isRtlLocale, updateLocale} from '../locale';

import getI18nClasses from './getI18nClasses';

/**
 * `contextTypes` is an object that exports the default context validation rules. These must be applied
 * to any child components that wish to receive the i18n context.
 *
 * ```
 * import {contextTypes} from '@enact/i18n/I18nDecorator';
 * ...
 * myComponent.contextTypes = contextTypes;
 * ```
 *
 * @memberof i18n/I18nDecorator
 * @public
 */
const contextTypes = {
	rtl: PropTypes.bool,
	updateLocale: PropTypes.func
};

const defaultConfig = {
	loader: null,
	preloadResources: false
};

/**
 * {@link i18n/I18nDecorator.I18nDecorator} is a Higher Order Component that is used to wrap
 * the root element in an app. It provides an `rtl` member on the context of the wrapped component, allowing
 * the children to check the current text directionality as well as an `updateLocale` method that can be
 * used to update the current locale.
 *
 * There are no configurable options on this HOC.
 *
 * @class I18nDecorator
 * @memberof i18n/I18nDecorator
 * @hoc
 * @public
 */
const IntlHoc = hoc(defaultConfig, (config, Wrapped) => {
	const {loader, preloadResources} = config;

	const shouldPreloadResource = (name) => {
		return preloadResources === true || (
			Array.isArray(name) && preloadResources.indexOf(name) >= 0
		);
	};

	return class I18nDecorator extends React.Component {
		static contextTypes = stateContextTypes
		static childContextTypes = {...contextTypes, ...stateContextTypes}
		static propTypes = /** @lends i18n/I18nDecorator.I18nDecorator.prototype */ {
			className: PropTypes.string,
			locale: PropTypes.string
		}

		constructor (props) {
			super(props);

			this.updateLocale(props.locale);

			this.state = {
				classes: '',
				locale: null,
				rtl: false
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
				shouldPreloadResource('charset') ? ilibPromise(Charset, [], {name: 'US-ASCII'}).then(() => {
					return ilibPromise(Charmap);
				}) : null,
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

			const [rtl, classes] = await Promise.all([
				isRtlLocale(),
				getI18nClasses(),
				this.preloadResources()
			]);

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
				<Wrapped {...props} className={classes} />
			);
		}
	};
});

export default IntlHoc;
export {IntlHoc as I18nDecorator, contextTypes};
