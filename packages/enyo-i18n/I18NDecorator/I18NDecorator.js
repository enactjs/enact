import React from 'react';

import '../src/glue';
import {isRtl, getI18NClasses, updateLocale} from '../src/locale';

const contextTypes = {
	rtl: React.PropTypes.bool,
	updateLocale: React.PropTypes.func
};

// Should be in enyo-core
const hoc = (defaultConfig, hawk) => (config, maybeWrapped) => {
	if (typeof config === 'function') {
		return hawk(defaultConfig, config);
	} else {
		const cfg = Object.assign({}, defaultConfig, config);
		if (typeof maybeWrapped === 'function') {
			return hawk(cfg, maybeWrapped);
		} else {
			return (Wrapped) => hawk(cfg, Wrapped);
		}
	}
};

const IntlHoc = hoc(null, (config, Wrapped) => {
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
