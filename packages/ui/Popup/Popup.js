/**
 * Provides unstyled popup components and behaviors to be customized by a theme or application.
 *
 * @module ui/Popup
 * @exports Popup
 * @exports PopupBase
 * @exports FloatingPopupBase
 * @exports PopupDecorator
 */

import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import FloatingLayer from '../FloatingLayer';
import Transition from '../Transition';

import componentCss from './Popup.less';

const forwardHide = forward('onHide');
const forwardOpen = forward('onOpen');

/**
 * [PopupBase]{@link ui/Popup.PopupBase} is a basic modal component structure without any behaviors
 * applied to it.
 *
 * @class PopupBase
 * @memberof ui/Popup
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
		 * The following classes are supported:
		 *
		 * * `popup` - The root component class
		 * * `popupTransitionContainer` - A placeholder for the transition container
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
 * [FloatingPopupBase]{@link ui/Popup.FloatingPopupBase} is a basic modal component structure
 * without any behaviors applied to it that is rendered in [floating layer]{@link ui/FloatingLayer.FloatingLayer}.
 *
 * @class FloatingPopupBase
 * @memberof ui/Popup
 * @ui
 * @public
 */
const FloatingPopupBase = kind({
	name: 'ui:FloatingPopupBase',

	propTypes: /** @lends ui/Popup.FloatingPopupBase.prototype */ {
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
		 * The following classes are supported:
		 *
		 * * `popup` - The root component class
		 * * `popupTransitionContainer` - A placeholder for the transition container
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
		 * When `true`, the popup is rendered. Popups are rendered into the
		 * [floating layer]{@link ui/FloatingLayer.FloatingLayer}.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		floatLayerOpen: PropTypes.bool,

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
		 * A function to be run when floating layer is closed.
		 *
		 * @type {Function}
		 * @public
		 */
		onClose: PropTypes.func,

		/**
		 * A function to be run when `ESC` key is pressed. The function will only invoke if
		 * `noAutoDismiss` is set to `false`.
		 *
		 * @type {Function}
		 * @public
		 */
		onDismiss: PropTypes.func,

		/**
		 * A function to be run after transition for hiding is finished.
		 *
		 * @type {Function}
		 * @public
		 */
		onHide: PropTypes.func,

		/**
		 * A function to be run when floating layer is opened. It will only be invoked for the first render.
		 *
		 * @type {Function}
		 * @public
		 */
		onOpen: PropTypes.func,

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
		 * Types of scrim. It can be either `'transparent'`, `'translucent'`, or `'none'`.
		 *
		 * @type {String}
		 * @default 'translucent'
		 * @public
		 */
		scrimType: PropTypes.oneOf(['transparent', 'translucent', 'none']),

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

	render: ({floatLayerOpen, noAutoDismiss, onClose, onOpen, scrimType, ...rest}) => {
		delete rest.onDismiss;

		return (
			<FloatingLayer
				noAutoDismiss={noAutoDismiss}
				onDismiss={onClose}
				onOpen={onOpen}
				open={floatLayerOpen}
				scrimType={scrimType}
			>
				<PopupBase {...rest} />
			</FloatingLayer>
		);
	}
});

/**
 * [ui:PopupDecorator]{@link ui/Popup.PopupDecorator} is a Higher-order Component that manages
 * floating layer and popup open state.
 *
 * @class PopupDecorator
 * @memberof ui/Popup.PopupDecorator
 * @hoc
 * @public
 */
const PopupDecorator = hoc((config, Wrapped) => {
	return class extends React.Component {
		static displayName = 'ui:PopupDecorator'

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
			 * When `true`, the popup is rendered. Popups are rendered into the
			 * [floating layer]{@link ui/FloatingLayer.FloatingLayer}.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			open: PropTypes.bool
		}

		static defaultProps = {
			noAnimation: false,
			open: false
		}

		constructor (props) {
			super(props);
			this.state = {
				floatLayerOpen: this.props.open,
				popupOpen: this.props.noAnimation
			};
		}

		componentWillReceiveProps (nextProps) {
			if (this.props.open !== nextProps.open) {
				this.setState(() => ({
					popupOpen: nextProps.noAnimation,
					floatLayerOpen: this.props.open ? !nextProps.noAnimation : true
				}));
			}
		}

		handleFloatingLayerOpen = () => {
			forwardOpen({}, this.props);

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
			return (
				<Wrapped
					{...this.props}
					floatLayerOpen={this.state.floatLayerOpen}
					onHide={this.handlePopupHide}
					onOpen={this.handleFloatingLayerOpen}
					open={this.state.popupOpen}
				/>
			);
		}
	};
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
const Popup = PopupDecorator(FloatingPopupBase);

export default Popup;
export {
	Popup,
	PopupBase,
	FloatingPopupBase,
	PopupDecorator
};
