/**
 * Exports the {@link moonstone/MoonstoneDecorator.MoonstoneDecorator} HOC
 *
 * @module moonstone/MoonstoneDecorator
 */

import {addCancelHandler, removeCancelHandler} from '@enact/ui/Cancelable';
import {forKeyCode} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import I18nDecorator from '@enact/i18n/I18nDecorator';
import React from 'react';
import {ResolutionDecorator} from '@enact/ui/resolution';
import {SpotlightRootDecorator} from '@enact/spotlight';

import fontGenerator from './fontGenerator';
import screenTypes from './screenTypes.json';
import css from './MoonstoneDecorator.less';

const defaultConfig = {
	cancelHandler: forKeyCode(461),
	i18n: true,
	ri: {
		screenTypes
	},
	spotlight: true
};

/**
 * {@link moonstone/MoonstoneDecorator.MoonstoneDecorator} is a Higher-order Component that applies
 * Moonstone theming to an application. It also applies
 * [resolution independence]{@link ui/resolution.ResolutionDecorator},
 * [spotlight]{@link spotlight.SpotlightRootDecorator}, and
 * [internationalization support]{@link i18n/I18nDecorator.I18nDecorator}. It is meant to be applied to
 * the root element of an app.
 *
 * @class MoonstoneDecorator
 * @memberof moonstone/MoonstoneDecorator
 * @hoc
 * @public
 */
const MoonstoneDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {ri, i18n, spotlight, cancelHandler} = config;

	if (cancelHandler) addCancelHandler(cancelHandler);

	class Decorator extends React.Component {
		static displayName = 'MoonstoneDecorator';

		componentDidMount () {
			if (cancelHandler) {
				addCancelHandler(cancelHandler);
			}
		}

		componentWillUnmount () {
			if (cancelHandler) {
				removeCancelHandler(cancelHandler);
			}
		}

		render () {
			let className = `${css.moon} enact-fit enact-unselectable`;
			if (this.props.className) {
				className += ` ${this.props.className}`;
			}

			fontGenerator();

			return (
				<Wrapped {...this.props} className={className} />
			);
		}
	}

	let App = Decorator;

	if (ri) App = ResolutionDecorator(ri, App);
	if (i18n) App = I18nDecorator(App);
	if (spotlight) App = SpotlightRootDecorator(App);

	return App;
});

export default MoonstoneDecorator;
export {MoonstoneDecorator};
