/**
 * Exports the {@link moonstone/MoonstoneDecorator.MoonstoneDecorator} HOC
 *
 * @module moonstone/MoonstoneDecorator
 */

import {addAll} from '@enact/core/keymap';
import classnames from 'classnames';
import hoc from '@enact/core/hoc';
import I18nDecorator from '@enact/i18n/I18nDecorator';
import React from 'react';
import {ResolutionDecorator} from '@enact/ui/resolution';
import {FloatingLayerDecorator} from '@enact/ui/FloatingLayer';
import SpotlightRootDecorator from '@enact/spotlight/SpotlightRootDecorator';

import Skinnable from '../Skinnable';

import I18nFontDecorator from './I18nFontDecorator';
import AccessibilityDecorator from './AccessibilityDecorator';
import screenTypes from './screenTypes.json';
import css from './MoonstoneDecorator.less';
import {configure} from '@enact/ui/Touchable';

/**
 * Default config for {@link moonstone/MoonstoneDecorator.MoonstoneDecorator}.
 *
 * @memberof moonstone/MoonstoneDecorator
 * @hocconfig
 */
const defaultConfig = {
	i18n: true,
	float: true,
	noAutoFocus: false,
	overlay: false,
	ri: {
		screenTypes
	},
	spotlight: true,
	textSize: true,
	skin: true
};

/**
 * {@link moonstone/MoonstoneDecorator.MoonstoneDecorator} is a Higher-order Component that applies
 * Moonstone theming to an application. It also applies
 * [floating layer]{@link ui/FloatingLayer.FloatingLayerDecorator},
 * [resolution independence]{@link ui/resolution.ResolutionDecorator},
 * [custom text sizing]{@link moonstone/MoonstoneDecorator.TextSizeDecorator},
 * [skin support]{@link ui/Skinnable}, [spotlight]{@link spotlight.SpotlightRootDecorator}, and
 * [internationalization support]{@link i18n/I18nDecorator.I18nDecorator}. It is meant to be applied to
 * the root element of an app.
 *
 * [Skins]{@link ui/Skinnable} provide a way to change the coloration of your app. The currently
 * supported skins for Moonstone are "moonstone" (the default, dark skin) and "moonstone-light".
 * Use the `skin` property to assign a skin. Ex: `<DecoratedApp skin="light" />`
 *
 * @class MoonstoneDecorator
 * @memberof moonstone/MoonstoneDecorator
 * @hoc
 * @public
 */
const MoonstoneDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {ri, i18n, spotlight, float, noAutoFocus, overlay, textSize, skin, highContrast} = config;

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
	if (spotlight) App = SpotlightRootDecorator({noAutoFocus}, App);
	if (textSize || highContrast) App = AccessibilityDecorator(App);
	if (skin) App = Skinnable({defaultSkin: 'dark'}, App);

	// add webOS-specific key maps
	addAll({
		cancel: 461,
		nonModal: [
			461,
			415, // play
			19, // pause
			403, // red
			404, // green
			405, // yellow
			406, // blue
			33, // channel up
			34 // channel down
		],
		red: 403,
		green: 404,
		yellow: 405,
		blue: 406,
		play: 415,
		pause: 19,
		rewind: 412,
		fastForward: 417,
		pointerHide: 1537,
		pointerShow: 1536
	});

	// configure the default hold time
	configure({
		hold: {
			events: [
				{name: 'hold', time: 400}
			]
		}
	});

	const Decorator = class extends React.Component {
		static displayName = 'MoonstoneDecorator';

		render () {
			const {className, ...rest} = this.props,
				classes = [css.root, 'enact-unselectable', 'enact-fit'];

			if (!float) {
				classes.push(bgClassName);
			}
			if (this.props.debugAria) {
				classes.push('debug', 'aria');
			}
			if (className) {
				classes.push(className);
			}

			delete rest.debugAria;

			return (
				<App {...rest} className={classnames(classes)} />
			);
		}
	};

	return Decorator;
});

export default MoonstoneDecorator;
export {MoonstoneDecorator};
