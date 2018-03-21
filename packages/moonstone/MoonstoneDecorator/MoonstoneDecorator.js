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

import Skinnable from '../Skinnable';

import I18nFontDecorator from './I18nFontDecorator';
import screenTypes from './screenTypes.json';
import css from './MoonstoneDecorator.less';
import {configure} from '@enact/ui/Touchable';
import {contextTypes, Publisher} from '@enact/core/internal/PubSub';
import PropTypes from 'prop-types';
import Spotlight from '@enact/spotlight/src/spotlight';
import {spottableClass} from '@enact/spotlight/Spottable';
import {rootContainerId} from '@enact/spotlight/src/container';
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
	skin: true,
	dynamic: true,
	screenTypes: null
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
	const {ri, i18n, float, noAutoFocus, overlay, skin, textSize, highContrast} = config;

	// Apply classes depending on screen type (overlay / fullscreen)
	const bgClassName = 'enact-fit' + (overlay ? '' : ` ${css.bg}`);

	let App = Wrapped;
	if (i18n) {
		// Apply the @enact/i18n decorator around the font decorator so the latter will update the
		// font stylesheet when the locale changes
		App = I18nDecorator(
			I18nFontDecorator(
				App
			)
		);
	}
	if (float) App = FloatingLayerDecorator({wrappedClassName: bgClassName}, App);
	if (ri) App = ResolutionDecorator(ri, App);
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

		static contextTypes = contextTypes

		static childContextTypes = contextTypes

		static propTypes =  /** @lends moonstone/MoonstoneDecorator.AccessibilityDecorator.prototype */ {
			/**
			 * Enables additional features to help users visually differentiate components.
			 * The UI library will be responsible for using this information to adjust
			 * the components' contrast to this preset.
			 *
			 * @type {Boolean}
			 * @public
			 */
			highContrast: PropTypes.bool,

			/**
			 * Set the goal size of the text. The UI library will be responsible for using this
			 * information to adjust the components' text sizes to this preset.
			 * Current presets are `'normal'` (default), and `'large'`.
			 *
			 * @type {String}
			 * @default 'normal'
			 * @public
			 */
			textSize: PropTypes.oneOf(['normal', 'large'])
		}

		static defaultProps = {
			highContrast: false,
			textSize: 'normal'
		}

		getChildContext () {
			return {
				Subscriber: this.publisher.getSubscriber()
			};
		}

		componentWillMount () {
			if (textSize || highContrast) {
				this.publisher = Publisher.create('resize', this.context.Subscriber);
			}

			if (typeof window === 'object') {
				const palmSystem = window.PalmSystem;

				Spotlight.initialize({
					selector: '.' + spottableClass,
					restrict: 'none'
				});

				Spotlight.set(rootContainerId, {
					overflow: true
				});

				if (palmSystem && palmSystem.cursor) {
					Spotlight.setPointerMode(palmSystem.cursor.visibility);
				}
			}
		}

		componentDidMount () {
			if (!noAutoFocus) {
				Spotlight.focus();
			}
			if (config.dynamic) window.addEventListener('resize', this.handleResize);
			// eslint-disable-next-line react/no-find-dom-node
			// this.rootNode = ReactDOM.findDOMNode(this);
		}

		componentDidUpdate (prevProps) {
			if (prevProps.textSize !== this.props.textSize) {
				this.publisher.publish({
					horizontal: true,
					vertical: true
				});
			}
		}


		componentWillUnmount () {
			Spotlight.terminate();
			if (config.dynamic) window.removeEventListener('resize', this.handleResize);
		}

		navigableFilter = (elem) => {
			while (elem && elem !== document && elem.nodeType === 1) {
				if (elem.getAttribute('data-container-disabled') === 'true') return false;
				elem = elem.parentNode;
			}
		}

		render () {
			let className = css.root + ' enact-unselectable enact-fit ';
			if (!float) {
				className += ' ' + bgClassName;
			}
			if (this.props.className) {
				className += ` ${this.props.className}`;
			}

			const {highContrast: contrast, textSize: size, ...props} = this.props;
			const accessibilityClassName = contrast ? `enact-a11y-high-contrast enact-text-${size}` : `enact-text-${size}`;
			const combinedClassName = className ? `${className} ${accessibilityClassName}` : accessibilityClassName;

			return (
				<App {...props} className={combinedClassName} />
			);
		}
	};

	return Decorator;
});

export default MoonstoneDecorator;
export {MoonstoneDecorator};
