/**
 * Exports the {@link module:@enact/i18n/I18nDecorator~I18nDecorator} component and
 * {@link module:@enact/i18n/I18nDecorator~contextTypes} validation rules.
 *
 * @module @enact/i18n/I18nDecorator
 */

import hoc from '@enact/core/hoc';
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
 * @public
 */
const contextTypes = {
	rtl: React.PropTypes.bool,
	updateLocale: React.PropTypes.func
};

/**
 * {@link module:@enact/i18n/I18nDecorator~I18nDecorator} is a Higher Order Component that is used to wrap
 * the root element in an app. It provides an `rtl` member on the context of the wrapped component, allowing
 * the children to check the current text directionality as well as an `updateLocale` method that can be
 * used to update the current locale.
 *
 * There are no configurable options on this HOC.
 *
 * @class I18nDecorator
 * @public
 */
const IntlHoc = hoc((config, Wrapped) => {
	return class I18nDecorator extends React.Component {
		static childContextTypes = contextTypes
		static propTypes = {
			className: React.PropTypes.string
		}

		getChildContext () {
			return {
				rtl: isRtlLocale(),
				updateLocale: this.updateLocale
			};
		}

		updateLocale = (locale) => {
			const newLocale = updateLocale(locale);
			this.setState({
				locale: newLocale
			});
		}

		render () {
			let classes = getI18nClasses();
			if (this.props.className) {
				classes = this.props.className + ' ' + classes;
			}

			return (
				<Wrapped {...this.props} className={classes} />
			);
		}
	};
});

export default IntlHoc;
export {IntlHoc as I18nDecorator, contextTypes};
