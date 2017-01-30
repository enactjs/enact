/**
 * Exports the {@link moonstone/MoonstoneDecorator.MoonstoneDecorator} HOC
 *
 * @module moonstone/MoonstoneDecorator
 */

import {addAll} from '@enact/core/keymap';
import hoc from '@enact/core/hoc';
import I18nDecorator from '@enact/i18n/I18nDecorator';
import React from 'react';
import {ResolutionDecorator} from '@enact/ui/resolution';
import {FloatingLayerDecorator} from '@enact/ui/FloatingLayer';
import {SpotlightRootDecorator} from '@enact/spotlight';

import I18nFontDecorator from './I18nFontDecorator';
import screenTypes from './screenTypes.json';
import css from './MoonstoneDecorator.less';

/**
 * Default config for {@link moonstone/MoonstoneDecorator.MoonstoneDecorator}.
 *
 * @memberof moonstone/MoonstoneDecorator
 * @hocconfig
 */
const defaultConfig = {
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
	const {ri, i18n, spotlight, float, overlay} = config;

	// Apply classes depending on screen type (overlay / fullscreen)
	const bgClassName = 'enact-fit' + (overlay ? '' : ` ${css.bg}`);

	let App = Wrapped;
	if (float) App = FloatingLayerDecorator({wrappedClassName: bgClassName}, App);
	if (ri) App = ResolutionDecorator(ri, App);
	if (i18n) {
		// Apply the @enact/i18n decorator around the font decorator so the latter will update the
		// font stylesheet when the locale changes
		App = I18nDecorator(
			I18nFontDecorator(
				App
			)
		);
	}
	if (spotlight) App = SpotlightRootDecorator(App);

	// add webOS-specific key maps
	addAll({
		cancel: 461,
		pointerHide: 1537,
		pointerShow: 1536
	});

	const Decorator = class extends React.Component {
		static displayName = 'MoonstoneDecorator';

		render () {
			let className = `${css.moon} enact-unselectable`;
			if (!float) {
				className += ' ' + bgClassName;
			}
			if (this.props.className) {
				className += ` ${this.props.className}`;
			}

			return (
				<App {...this.props} className={className} />
			);
		}
	};

	return Decorator;
});

export default MoonstoneDecorator;
export {MoonstoneDecorator};
