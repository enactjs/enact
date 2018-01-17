/**
 * Provides unstyled popup components and behaviors to be customized by a theme or application.
 *
 * @module ui/Popup
 * @exports Popup
 * @exports PopupBase
 */

import {forward} from '@enact/core/handle';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import FloatingLayer from '../FloatingLayer';
import Transition from '../Transition';

import componentCss from './Popup.less';

const forwardHide = forward('onHide');

/**
 * [PopupBase]{@link ui/Popup.PopupBase} is a basic modal component structure without any behaviors
 * applied to it.
 *
 * @class ButtonBase
 * @memberof ui/Button
 * @ui
 * @public
 */
const PopupBase = kind({
	name: 'ui:PopupBase',

	propTypes: /** @lends ui/Popup.PopupBase.prototype */ {
		/**
		 * The contents to be displayed in the body of the popup.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node.isRequired,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * The direction of transition (i.e. where the component will move *to*; the destination).
		 * Supported directions are: `'up'`, `'right'`, `'down'`, `'left'`.
		 *
		 * @type {String}
		 * @default 'down'
		 * @public
		 */
		direction: PropTypes.oneOf(['up', 'right', 'down', 'left']),

		/**
		 * The duration of the transition.
		 * Supported durations are: `'short'` (250ms), `'long'` (1s) and `'medium'` (500ms).
		 *
		 * @type {String}
		 * @default 'short'
		 * @public
		 */
		duration: PropTypes.oneOf(['short', 'medium', 'long']),

		/**
		 * When `true`, the popup will not animate on/off screen.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAnimation: PropTypes.bool,

		/**
		 * A function to be run after transition for hiding is finished.
		 *
		 * @type {Function}
		 * @public
		 */
		onHide: PropTypes.func,

		/**
		 * A function to run after transition for showing is finished.
		 *
		 * @type {Function}
		 * @public
		 */
		onShow: PropTypes.func,

		/**
		 * When `true`, the popup is in the open state with the contents visible
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		open: PropTypes.bool,

		/**
		 * Customize the transition timing function.
		 * Supported function names are: `ease`, `ease-in`, `ease-out`, `ease-in-out`, `ease-in-quart`,
		 * `ease-out-quart`, and `linear`.
		 *
		 * @type {String}
		 * @default 'ease-in-out'
		 * @public
		 */
		timingFunction: PropTypes.oneOf([
			'ease',
			'ease-in',
			'ease-out',
			'ease-in-out',
			'ease-in-quart',
			'ease-out-quart',
			'linear'
		]),

		/**
		 * How the transition affects the content.
		 * Supported types are: `'slide'`, `'clip'`, and `'fade'`.
		 *
		 * @type {String}
		 * @default 'slide'
		 * @public
		 */
		type: PropTypes.oneOf(['slide', 'clip', 'fade'])
	},

	defaultProps: {
		direction: 'down',
		duration: 'short',
		noAnimation: false,
		open: false,
		timingFunction: 'ease-in-out',
		type: 'slide'
	},

	styles: {
		css: componentCss,
		className: 'popup',
		publicClassNames: true
	},

	render: ({children, css, direction, duration, noAnimation, open, onHide, onShow, timingFunction, type, ...rest}) => {
		return (
			<Transition
				className={css.popupTransitionContainer}
				direction={direction}
				duration={duration}
				noAnimation={noAnimation}
				onHide={onHide}
				onShow={onShow}
				timingFunction={timingFunction}
				type={type}
				visible={open}
			>
				<div
					aria-live="off"
					role="alert"
					{...rest}
				>
					{children}
				</div>
			</Transition>
		);
	}
});

/**
 * [Popup]{@link ui/Popup.Popup} is a stateful component that help {@link ui/Popup.PopupBase}
 * to appear in {@link ui/FloatingLayer.FloatingLayer}.
 *
 * @class Popup
 * @memberof ui/Popup
 * @ui
 * @public
 */
class Popup extends React.Component {

	static propTypes = /** @lends ui/Popup.Popup.prototype */ {
		/**
		 * When `true`, the popup will not animate on/off screen.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAnimation: PropTypes.bool,

		/**
		 * When `true`, the popup will not close when the user presses `ESC` key.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAutoDismiss: PropTypes.bool,

		/**
		 * A function to be run when a closing action is invoked by the user. These actions include
		 * pressing `ESC` key, clicking on the close button, or spotlight focus moves outside the
		 * boundary of the popup (when `spotlightRestrict` is not `'self-only'`). It is the
		 * responsibility of the callback to set the `open` property to `false`.
		 *
		 * @type {Function}
		 * @public
		 */
		onClose: PropTypes.func,

		/**
		 * A function to be run when popup hides. When animating it runs after transition for
		 * hiding is finished.
		 *
		 * @type {Function}
		 * @public
		 */
		onHide: PropTypes.func,

		/**
		 * A function to run when popup shows. When animating, it runs after transition for
		 * showing is finished.
		 *
		 * Note: The function does not run if Popup is initially opened and non animating.
		 *
		 * @type {Function}
		 * @public
		 */
		onShow: PropTypes.func,

		/**
		 * When `true`, the popup is rendered. Popups are rendered into the
		 * [floating layer]{@link ui/FloatingLayer.FloatingLayer}.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		open: PropTypes.bool,

		/**
		 * Types of scrim. It can be either `'transparent'`, `'translucent'`, or `'none'`. `'none'`
		 * is not compatible with `spotlightRestrict` of `'self-only'`, use a transparent scrim to
		 * prevent mouse focus when using popup.
		 *
		 * @type {String}
		 * @default 'translucent'
		 * @public
		 */
		scrimType: PropTypes.oneOf(['transparent', 'translucent', 'none'])
	}

	static defaultProps = {
		noAnimation: false,
		noAutoDismiss: false,
		open: false,
		scrimType: 'translucent'
	}

	constructor (props) {
		super(props);
		this.state = {
			floatLayerOpen: this.props.open,
			popupOpen: this.props.noAnimation
		};
	}

	componentWillReceiveProps (nextProps) {
		if (!this.props.open && nextProps.open) {
			this.setState(() => ({
				popupOpen: nextProps.noAnimation,
				floatLayerOpen: true
			}));
		} else if (this.props.open && !nextProps.open) {
			this.setState(() => ({
				popupOpen: nextProps.noAnimation,
				floatLayerOpen: !nextProps.noAnimation
			}));
		}
	}

	handleFloatingLayerOpen = () => {
		// TODO: maybe forward `onOpen` event?
		if (!this.props.noAnimation) {
			this.setState(() => ({
				popupOpen: true
			}));
		}
	}

	handlePopupHide = (ev) => {
		forwardHide(ev, this.props);

		this.setState(() => ({
			floatLayerOpen: false
		}));
	}

	render () {
		const {noAutoDismiss, onClose, scrimType, ...rest} = this.props;

		return (
			<FloatingLayer
				noAutoDismiss={noAutoDismiss}
				open={this.state.floatLayerOpen}
				onOpen={this.handleFloatingLayerOpen}
				onDismiss={onClose}
				scrimType={scrimType}
			>
				<PopupBase
					{...rest}
					open={this.state.popupOpen}
					onHide={this.handlePopupHide}
				/>
			</FloatingLayer>
		);
	}
}

export default Popup;
export {Popup, PopupBase};
