/**
 * Exports the {@link moonstone/MoonstoneDecorator.MoonstoneDecorator} HOC
 *
 * @module moonstone/MoonstoneDecorator
 * @exports MoonstoneDecorator
 */

import {addAll} from '@enact/core/keymap';
import hoc from '@enact/core/hoc';
import I18nDecorator from '@enact/i18n/I18nDecorator';
import React from 'react';
import classNames from 'classnames';
import {ResolutionDecorator} from '@enact/ui/resolution';
import {FloatingLayerDecorator} from '@enact/ui/FloatingLayer';
import SpotlightRootDecorator from '@enact/spotlight/SpotlightRootDecorator';

import Skinnable from '../Skinnable';

import I18nFontDecorator from './I18nFontDecorator';
import AccessibilityDecorator from './AccessibilityDecorator';
import screenTypes from './screenTypes.json';
import css from './MoonstoneDecorator.module.less';
import {configure} from '@enact/ui/Touchable';

/**
 * Default config for `MoonstoneDecorator`.
 *
 * @memberof moonstone/MoonstoneDecorator.MoonstoneDecorator
 * @hocconfig
 */
const defaultConfig = /** @lends moonstone/MoonstoneDecorator.MoonstoneDecorator.defaultConfig */ {
	/**
	 * Applies AccessibilityDecorator.
	 *
	 * If not applied, app will not support accessibility options.
	 *
	 * @type {Boolean}
	 * @default true
	 * @see {@link moonstone/MoonstoneDecorator.AccessibilityDecorator}
	 * @public
	 */
	accessible: true,

	/**
	 * Disables use of full screen.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	disableFullscreen: false,

	/**
	 * Enables a floating layer for popup components.
	 *
	 * If not applied, app will be responsible for applying the decorator.
	 *
	 * @type {Boolean}
	 * @default true
	 * @see {@link ui/FloatingLayer.FloatingLayerDecorator}
	 * @public
	 */
	float: true,

	/**
	 * Options for I18nDecorator.
	 *
	 * May be `false` to prevent applying the decorator. If not applied, app will be responsible for
	 * applying the decorator.
	 *
	 * @type {Object|false}
	 * @default {sync: true}
	 * @see {@link i18n/I18nDecorator}
	 * @public
	 */
	i18n: {
		sync: true
	},

	/**
	 * Disables setting spotlight focus on first render.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	noAutoFocus: false,

	/**
	 * Enables overlay mode (no background color will be applied).
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	overlay: false,

	/**
	 * Override the resolution independence settings.
	 *
	 * @type {Object}
	 * @see {@link ui/resolution}
	 * @public
	 */
	ri: {
		screenTypes
	},

	/**
	 * Applies skinning support.
	 *
	 * @type {Boolean}
	 * @default true
	 * @see {@link moonstone/Skinnable}
	 * @public
	 */
	skin: true,

	/**
	 * Applies spotlight decorator.
	 *
	 * If not applied, app will be responsible for applying the decorator.
	 *
	 * @type {Boolean}
	 * @default true
	 * @see {@link spotlight/SpotlightRootDecorator}
	 * @public
	 */
	spotlight: true
};

/**
 * A higher-order component that applies Moonstone theming to an application.
 *
 * It also applies [floating layer]{@link ui/FloatingLayer.FloatingLayerDecorator}, [resolution
 * independence]{@link ui/resolution.ResolutionDecorator}, [skin
 * support]{@link moonstone/Skinnable}, [spotlight]{@link spotlight.SpotlightRootDecorator}, and
 * [internationalization support]{@link i18n/I18nDecorator.I18nDecorator}. It is meant to be applied
 * to the root element of an app.
 *
 * [Skins]{@link moonstone/Skinnable} provide a way to change the coloration of your app. The
 * currently supported skins for Moonstone are "moonstone" (the default, dark skin) and
 * "moonstone-light". Use the `skin` property to assign a skin. Ex: `<DecoratedApp skin="light" />`
 *
 * Note: This HoC passes `className` to the wrapped component. It must be passed to the main DOM
 * node.
 *
 * @class MoonstoneDecorator
 * @memberof moonstone/MoonstoneDecorator
 * @mixes ui/FloatingLayer.FloatingLayerDecorator
 * @mixes ui/resolution.ResolutionDecorator
 * @mixes spotlight/SpotlightRootDecorator.SpotlightRootDecorator
 * @mixes moonstone/Skinnable.Skinnable
 * @mixes moonstone/MoonstoneDecorator.AccessibilityDecorator
 * @hoc
 * @public
 */
const MoonstoneDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {accessible, ri, i18n, spotlight, float, noAutoFocus, overlay,
		skin, disableFullscreen} = config;

	// Apply classes depending on screen type (overlay / fullscreen)
	const bgClassName = classNames({
		'enact-fit': !disableFullscreen,
		[css.bg]: !overlay
	});

	let App = Wrapped;
	if (float) App = FloatingLayerDecorator({wrappedClassName: bgClassName}, App);
	if (ri) App = ResolutionDecorator(ri, App);
	if (i18n) {
		// Apply the @enact/i18n decorator around the font decorator so the latter will update the
		// font stylesheet when the locale changes
		App = I18nDecorator(
			{
				...i18n,
				// We use the latin fonts (with non-Latin fallback) for these languages (even though
				// their scripts are non-latin)
				latinLanguageOverrides: ['ko', 'ha', 'el', 'bg', 'mk', 'mn', 'ru', 'uk', 'kk'],
				// We use the non-latin fonts for these languages (even though their scripts are
				// technically considered latin)
				nonLatinLanguageOverrides: ['en-JP']
			},
			I18nFontDecorator(
				App
			)
		);
	}
	if (spotlight) App = SpotlightRootDecorator({noAutoFocus}, App);
	if (skin) App = Skinnable({defaultSkin: 'dark'}, App);
	if (accessible) App = AccessibilityDecorator(App);

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
			const className = classNames(css.root, this.props.className, 'enact-unselectable', {
				[bgClassName]: !float,
				'enact-fit': !disableFullscreen
			});

			return (
				<App {...this.props} className={className} />
			);
		}
	};

	return Decorator;
});

export default MoonstoneDecorator;
export {MoonstoneDecorator};
