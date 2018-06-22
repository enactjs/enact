/**
 * Modal component that appears at the bottom of the screen and takes up the full screen width.
 *
 * @module moonstone/Popup
 * @example
 *<Popup open>Hello!</Popup>
 */

import {is} from '@enact/core/keymap';
import {on, off} from '@enact/core/dispatcher';
import FloatingLayer from '@enact/ui/FloatingLayer';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Spotlight, {getDirection} from '@enact/spotlight';
import Pause from '@enact/spotlight/Pause';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import Transition from '@enact/ui/Transition';
import {forward} from '@enact/core/handle';
import warning from 'warning';

import $L from '../internal/$L';
import IconButton from '../IconButton';
import Skinnable from '../Skinnable';

import css from './Popup.less';

const isUp = is('up');
const TransitionContainer = SpotlightContainerDecorator(
	{enterTo: 'default-element', preserveId: true},
	Transition
);

const getContainerNode = (containerId) => {
	return document.querySelector(`[data-spotlight-id='${containerId}']`);
};

const forwardHide = forward('onHide');
const forwardShow = forward('onShow');

/**
 * [`PopupBase`]{@link moonstone/Popup.PopupBase} is a base component of
 * [`Popup`]{@link moonstone/Popup.Popup}.
 *
 * @class PopupBase
 * @memberof moonstone/Popup
 * @ui
 * @public
 */
const PopupBase = kind({
	name: 'PopupBase',

	propTypes: /** @lends moonstone/Popup.PopupBase.prototype */ {
		/**
		 * The contents to be displayed in the body of the popup.
		 *
		 * @type {Node}
		 * @required
		 * @public
		 */
		children: PropTypes.node.isRequired,

		/**
		 * Sets the hint string read when focusing the popup close button.
		 *
		 * @type {String}
		 * @default 'Close'
		 * @public
		 */
		closeButtonAriaLabel: PropTypes.string,

		/**
		 * When `true`, the popup will not animate on/off screen.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAnimation: PropTypes.bool,

		/**
		 * A callback function on click on the close button.
		 *
		 * @type {Function}
		 * @public
		 */
		onCloseButtonClick: PropTypes.func,

		/**
		 * A callback function for the hiding transition.
		 *
		 * @type {Function}
		 * @public
		 */
		onHide: PropTypes.func,

		/**
		 * A callback function for the showing transition.
		 *
		 * @type {Function}
		 * @public
		 */
		onShow: PropTypes.func,

		/**
		 * When `true`, the popup is in the open/expanded state with the contents visible.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		open: PropTypes.bool,

		/**
		 * When `true`, the close button is shown; when `false`, it is hidden.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		showCloseButton: PropTypes.bool,

		/**
		 * Specifies the container id.
		 *
		 * @type {String}
		 * @default null
		 * @public
		 */
		spotlightId: PropTypes.string,

		/**
		 * Restricts or prioritizes navigation when focus attempts to leave the popup. It
		 * can be either `'none'`, `'self-first'`, or `'self-only'`.
		 *
		 * Note: The ready-to-use [Popup]{@link moonstone/Popup.Popup} component only supports
		 * `'self-first'` and `'self-only'`.
		 *
		 * @type {String}
		 * @default 'self-only'
		 * @public
		 */
		spotlightRestrict: PropTypes.oneOf(['none', 'self-first', 'self-only'])
	},

	defaultProps: {
		noAnimation: false,
		open: false,
		showCloseButton: false,
		spotlightRestrict: 'self-only'
	},

	styles: {
		css,
		className: 'popup'
	},

	computed: {
		className: ({showCloseButton, styler}) => styler.append({reserveClose: showCloseButton}),
		closeButton: ({closeButtonAriaLabel, onCloseButtonClick, showCloseButton}) => {
			if (showCloseButton) {
				const ariaLabel = (closeButtonAriaLabel == null) ? $L('Close') : closeButtonAriaLabel;

				return (
					<IconButton
						className={css.closeButton}
						backgroundOpacity="transparent"
						small
						onTap={onCloseButtonClick}
						aria-label={ariaLabel}
					>
						closex
					</IconButton>
				);
			}
		}
	},

	render: ({closeButton, children, noAnimation, open, onHide, onShow, spotlightId, spotlightRestrict, ...rest}) => {
		delete rest.closeButtonAriaLabel;
		delete rest.onCloseButtonClick;
		delete rest.showCloseButton;
		return (
			<TransitionContainer
				className={css.popupTransitionContainer}
				direction="down"
				duration="short"
				noAnimation={noAnimation}
				onHide={onHide}
				onShow={onShow}
				spotlightDisabled={!open}
				spotlightId={spotlightId}
				spotlightRestrict={spotlightRestrict}
				type="slide"
				visible={open}
			>
				<div
					aria-live="off"
					role="alert"
					{...rest}
				>
					<div className={css.body}>
						{children}
					</div>
					{closeButton}
				</div>
			</TransitionContainer>
		);
	}
});

const SkinnedPopupBase = Skinnable(
	{defaultSkin: 'light'},
	PopupBase
);

// Deprecate using scrimType 'none' with spotlightRestrict of 'self-only'
const checkScrimNone = (props) => {
	const validScrim = !(props.scrimType === 'none' && props.spotlightRestrict === 'self-only');
	warning(validScrim, "Using 'spotlightRestrict' of 'self-only' without a scrim " +
		'is not supported. Use a transparent scrim to prevent spotlight focus outside of the popup');
};

/**
 * [Popup]{@link moonstone/Popup.Popup} is a stateful component that help
 * [PopupBase]{@link moonstone/Popup.PopupBase} to appear in
 * [FloatingLayer]{@link ui/FloatingLayer.FloatingLayer}.
 *
 * @class Popup
 * @memberof moonstone/Popup
 * @ui
 * @public
 */
class Popup extends React.Component {

	static propTypes = /** @lends moonstone/Popup.Popup.prototype */ {
		/**
		 * Sets the hint string read when focusing the popup close button.
		 *
		 * @type {String}
		 * @default 'Close'
		 * @public
		 */
		closeButtonAriaLabel: PropTypes.string,

		/**
		 * When `true`, the popup will not animate on/off screen.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAnimation: PropTypes.bool,

		/**
		 * When `true`, the popup will not close on the `ESC` key press.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAutoDismiss: PropTypes.bool,

		/**
		 * Close callback function on,
		 *
		 *	* pressing `ESC` key,
		 *	* clicking on the close button, or
		 *	* moving spotlight focus outside the boundary of the popup when `spotlightRestrict` is
		 *   `'self-first'`.
		 *
		 * It is the responsibility of the callback to set the `open` property to `false`.
		 *
		 * @type {Function}
		 * @public
		 */
		onClose: PropTypes.func,

		/**
		 * Hide callback function
		 *
		 * @type {Function}
		 * @public
		 */
		onHide: PropTypes.func,

		/**
		 * A key-down event callback function
		 *
		 * @type {Function}
		 * @public
		 */
		onKeyDown: PropTypes.func,

		/**
		 * Show callback function
		 *
		 * Note: The function does not run if Popup is initially opened and not animating.
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
		scrimType: PropTypes.oneOf(['transparent', 'translucent', 'none']),

		/**
		 * When `true`, the popup includes a close button; when `false`, none is included.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		showCloseButton: PropTypes.bool,

		/**
		 * Restricts or prioritizes navigation when focus attempts to leave the popup. It
		 * can be either `'self-first'`, or `'self-only'`.
		 *
		 * @type {String}
		 * @default 'self-only'
		 * @public
		 */
		spotlightRestrict: PropTypes.oneOf(['self-first', 'self-only'])
	}

	static defaultProps = {
		noAnimation: false,
		noAutoDismiss: false,
		open: false,
		scrimType: 'translucent',
		showCloseButton: false,
		spotlightRestrict: 'self-only'
	}

	constructor (props) {
		super(props);
		this.paused = new Pause('Popup');
		this.state = {
			floatLayerOpen: this.props.open,
			popupOpen: this.props.noAnimation,
			containerId: Spotlight.add(),
			activator: null
		};
		checkScrimNone(this.props);
	}

	componentWillReceiveProps (nextProps) {
		if (!this.props.open && nextProps.open) {
			this.setState({
				popupOpen: nextProps.noAnimation,
				floatLayerOpen: true,
				activator: Spotlight.getCurrent()
			});
		} else if (this.props.open && !nextProps.open) {
			const activator = this.state.activator;

			this.setState({
				popupOpen: nextProps.noAnimation,
				floatLayerOpen: !nextProps.noAnimation,
				activator: nextProps.noAnimation ? null : activator
			});
		}
		checkScrimNone(nextProps);
	}

	componentDidUpdate (prevProps, prevState) {
		if (this.props.open !== prevProps.open) {
			if (!this.props.noAnimation) {
				this.paused.pause();
			} else if (this.props.open) {
				forwardShow({}, this.props);
				this.spotPopupContent();
			} else if (prevProps.open) {
				forwardHide({}, this.props);
				this.spotActivator(prevState.activator);
			}
		}
	}

	componentWillUnmount () {
		if (this.props.open) {
			off('keydown', this.handleKeyDown);
		}
		Spotlight.remove(this.state.containerId);
	}

	handleFloatingLayerOpen = () => {
		if (!this.props.noAnimation) {
			this.setState({
				popupOpen: true
			});
		} else if (this.state.popupOpen && this.props.open) {
			this.spotPopupContent();
		}
	}

	handleKeyDown = (ev) => {
		const {onClose, spotlightRestrict} = this.props;
		const keyCode = ev.keyCode;
		const direction = getDirection(keyCode);
		const spottables = Spotlight.getSpottableDescendants(this.state.containerId).length;

		if (direction && onClose) {
			let focusChanged;

			if (spottables && Spotlight.getCurrent() && spotlightRestrict !== 'self-only') {
				focusChanged = Spotlight.move(direction);
			}

			if (!spottables || (focusChanged === false && isUp(keyCode))) {
				// prevent default page scrolling
				ev.preventDefault();
				// stop propagation to prevent default spotlight behavior
				ev.stopPropagation();
				// set the pointer mode to false on keydown
				Spotlight.setPointerMode(false);
				onClose(ev);
			}
		}
	}

	handlePopupHide = (ev) => {
		forwardHide(ev, this.props);

		this.setState({
			floatLayerOpen: false,
			activator: null
		});

		if (ev.currentTarget.getAttribute('data-spotlight-id') === this.state.containerId) {
			this.paused.resume();

			if (!this.props.open) {
				this.spotActivator(this.state.activator);
			}
		}
	}

	handlePopupShow = (ev) => {
		forwardShow(ev, this.props);

		if (ev.currentTarget.getAttribute('data-spotlight-id') === this.state.containerId) {
			this.paused.resume();

			if (this.props.open) {
				this.spotPopupContent();
			}
		}
	}

	spotActivator = (activator) => {
		const current = Spotlight.getCurrent();
		const containerNode = getContainerNode(this.state.containerId);

		off('keydown', this.handleKeyDown);

		// if there is no currently-spotted control or it is wrapped by the popup's container, we
		// know it's safe to change focus
		if (!current || (containerNode && containerNode.contains(current))) {
			// attempt to set focus to the activator, if available
			if (!Spotlight.focus(activator)) {
				Spotlight.focus();
			}
		}
	}

	spotPopupContent = () => {
		const {containerId} = this.state;

		on('keydown', this.handleKeyDown);

		if (!Spotlight.focus(containerId)) {
			const current = Spotlight.getCurrent();

			// In cases where the container contains no spottable controls or we're in pointer-mode, focus
			// cannot inherently set the active container or blur the active control, so we must do that
			// here.
			if (current) {
				current.blur();
			}
			Spotlight.setActiveContainer(containerId);
		}
	}

	render () {
		const {noAutoDismiss, onClose, scrimType, ...rest} = this.props;
		delete rest.spotlightRestrict;

		return (
			<FloatingLayer
				noAutoDismiss={noAutoDismiss}
				open={this.state.floatLayerOpen}
				onOpen={this.handleFloatingLayerOpen}
				onDismiss={onClose}
				scrimType={scrimType}
			>
				<SkinnedPopupBase
					{...rest}
					data-webos-voice-exclusive
					onCloseButtonClick={onClose}
					onHide={this.handlePopupHide}
					onShow={this.handlePopupShow}
					open={this.state.popupOpen}
					spotlightId={this.state.containerId}
					spotlightRestrict="self-only"
				/>
			</FloatingLayer>
		);
	}
}

export default Popup;
export {Popup, PopupBase};
