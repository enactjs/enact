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
import {FloatingLayerDecorator} from '@enact/ui/FloatingLayer';
import {SpotlightRootDecorator} from '@enact/spotlight';

import fontGenerator from './fontGenerator';
import screenTypes from './screenTypes.json';
import css from './MoonstoneDecorator.less';

/**
 * Default config for {@link moonstone/MoonstoneDecorator.MoonstoneDecorator}.
 *
 * @memberof moonstone/MoonstoneDecorator
 * @hocconfig
 */
const defaultConfig = {
	cancelHandler: forKeyCode(461),
	i18n: true,
	float: true,
	overlay: false,
	ri: {
		screenTypes
	},
	spotlight: true
};

/**
 * {@link moonstone/MoonstoneDecorator.MoonstoneDecorator} is a Higher-order Component that applies
 * Moonstone theming to an application. It also applies
 * [floating layer]{@link ui/FloatingLayer.FloatingLayerDecorator},
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
	const {ri, i18n, spotlight, float, overlay, cancelHandler} = config;

	// Apply classes depending on screen type (overlay / fullscreen)
	const bgClassName = 'enact-fit' + (overlay ? '' : ` ${css.bg}`);

	let App = Wrapped;
	if (float) App = FloatingLayerDecorator({wrappedClassName: bgClassName}, App);
	if (cancelHandler) addCancelHandler(cancelHandler);

	let Decorator = class extends React.Component {
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
			let className = `${css.moon} enact-unselectable`;
			if (!float) {
				className += ' ' + bgClassName;
			}
			if (this.props.className) {
				className += ` ${this.props.className}`;
			}

			fontGenerator();

			return (
				<App {...this.props} className={className} />
			);
		}
	};

	if (ri) Decorator = ResolutionDecorator(ri, Decorator);
	if (i18n) Decorator = I18nDecorator(Decorator);
	if (spotlight) Decorator = SpotlightRootDecorator(Decorator);

	return Decorator;
});

export default MoonstoneDecorator;
export {MoonstoneDecorator};
