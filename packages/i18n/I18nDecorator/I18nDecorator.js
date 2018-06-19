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

import ilib from '../src/index.js';
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
const IntlHoc = hoc((config, Wrapped) => {
	return class I18nDecorator extends React.Component {
		static propTypes = /** @lends i18n/I18nDecorator.I18nDecorator.prototype */ {
			className: PropTypes.string,
			locale: PropTypes.string
		}

		static contextTypes = stateContextTypes
		static childContextTypes = {...contextTypes, ...stateContextTypes}

		constructor (props) {
			super(props);
			const ilibLocale = ilib.getLocale();
			const locale = props.locale && props.locale !== ilibLocale ? updateLocale(props.locale) : ilibLocale;

			this.state = {
				locale: locale
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
			this.setState({locale});
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

			delete props.locale;

			return (
				<Wrapped {...props} className={classes} />
			);
		}
	};
});

export default IntlHoc;
export {IntlHoc as I18nDecorator, contextTypes};
