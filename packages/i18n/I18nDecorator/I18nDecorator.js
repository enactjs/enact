/**
 * Exports the {@link i18n/I18nDecorator.I18nDecorator} component and
 * {@link i18n/I18nDecorator.contextTypes} validation rules.
 *
 * @module i18n/I18nDecorator
 */
import ilib from '../ilib/lib/ilib';
import hoc from '@enact/core/hoc';
import {on, off} from '@enact/core/dispatcher';
import React from 'react';

import '../src/glue';
import {isRtlLocale, getI18nClasses, updateLocale} from '../src/locale';

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
	rtl: React.PropTypes.bool,
	updateLocale: React.PropTypes.func
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
		static childContextTypes = contextTypes
		static propTypes = /** @lends i18n/I18nDecorator.I18nDecorator */ {
			className: React.PropTypes.string,
			locale: React.PropTypes.string
		}

		getChildContext () {
			return {
				rtl: isRtlLocale(),
				updateLocale: this.updateLocale
			};
		}

		constructor (props) {
			super(props);
			const locale = props.locale && props.locale !== ilib.locale ? updateLocale(props.locale) : ilib.locale;

			this.state = {
				locale: locale
			};
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
