import hoc from 'enyo-core/hoc';
import React from 'react';

import '../src/glue';
import {isRtl, getI18NClasses, updateLocale} from '../src/locale';

const contextTypes = {
	rtl: React.PropTypes.bool,
	updateLocale: React.PropTypes.func
};

const IntlHoc = hoc((config, Wrapped) => {
	return class I18NDecorator extends React.Component {
		static childContextTypes = contextTypes
		static propTypes = {
			className: React.PropTypes.string
		}

		getChildContext () {
			return {
				rtl: isRtl(),
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
			let classes = getI18NClasses();
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
export {IntlHoc as I18NDecorator, contextTypes};
