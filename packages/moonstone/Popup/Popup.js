/**
 * Exports the {@link moonstone/Popup.Popup} and {@link moonstone/Popup.PopupBase} components.
 * The default export is {@link moonstone/Popup.Popup}.
 *
 * @module moonstone/Popup
 */

import $L from '@enact/i18n/$L';
import {is} from '@enact/core/keymap';
import {on, off} from '@enact/core/dispatcher';
import FloatingLayer from '@enact/ui/FloatingLayer';
import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';
import Spotlight, {getDirection} from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import {spottableClass} from '@enact/spotlight/Spottable';
import Transition from '@enact/ui/Transition';

import IconButton from '../IconButton';

import css from './Popup.less';

const isUp = is('up');
const TransitionContainer = SpotlightContainerDecorator({preserveId: true}, Transition);

const getContainerNode = (containerId) => {
	return document.querySelector(`[data-container-id='${containerId}']`);
};

const getContainerSpottables = (containerId) => {
	return document.querySelectorAll(`[data-container-id='${containerId}'] .${spottableClass}`);
};

/**
 * {@link moonstone/Popup.PopupBase} is a modal component that appears at the bottom of
 * the screen and takes up the full screen width.
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
		 * The element(s) to be displayed in the body of the popup.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.oneOfType([
			PropTypes.arrayOf(PropTypes.element),
			PropTypes.element
		]).isRequired,

		/**
		 * Specifies the container id.
		 *
		 * @type {String}
		 * @default null
		 * @public
		 */
		containerId: PropTypes.string,

		/**
		 * When `true`, the popup will not animate on/off screen.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAnimation: PropTypes.bool,

		/**
		 * A function to be run when either the close button (if present) is clicked
		 *
		 * @type {Function}
		 * @public
		 */
		onCloseButtonClick: PropTypes.func,

		/**
		 * A function to be run after transition for hiding is finished.
		 *
		 * @type {Function}
		 * @public
		 */
		onHide: PropTypes.func,

		/**
		 * When `true`, the popup is in the open/expanded state with the contents visible
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
		 * Restricts or prioritizes navigation when focus attempts to leave the popup. It
		 * can be either `'none'`, `'self-first'`, or `'self-only'`.
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
		className: 'popup moon-neutral'
	},

	computed: {
		className: ({showCloseButton, styler}) => styler.append({reserveClose: showCloseButton}),
		closeButton: ({showCloseButton, onCloseButtonClick}) => {
			if (showCloseButton) {
				return (
					<IconButton
						className={css.closeButton}
						backgroundOpacity="transparent"
						small
						onClick={onCloseButtonClick}
						aria-label={$L('Close')}
					>
						closex
					</IconButton>
				);
			}
		}
	},

	render: ({closeButton, children, containerId, noAnimation, open, onHide, spotlightRestrict, ...rest}) => {
		delete rest.onCloseButtonClick;
		delete rest.showCloseButton;
		return (
			<TransitionContainer
				noAnimation={noAnimation}
				containerId={containerId}
				spotlightDisabled={!open}
				spotlightRestrict={spotlightRestrict}
				visible={open}
				direction="down"
				duration="short"
				type="slide"
				className={css.popupTransitionContainer}
				onHide={onHide}
			>
				<div {...rest}>
					<div className={css.body}>
						{children}
					</div>
					{closeButton}
				</div>
			</TransitionContainer>
		);
	}
});

/**
 * {@link moonstone/Popup.Popup} is a stateful component that help {@link moonstone/Popup.PopupBase}
 * to appear in {@link ui/FloatingLayer.FloatingLayer}.
 *
 * @class Popup
 * @memberof moonstone/Popup
 * @ui
 * @public
 */
class Popup extends React.Component {

	static propTypes = /** @lends moonstone/Popup.Popup.prototype */ {
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
		 * A function to be run when a key-down action is invoked by the user.
		 *
		 * @type {Function}
		 * @public
		 */
		onKeyDown: PropTypes.func,

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
		 * Types of scrim. It can be either `'transparent'`, `'translucent'`, or `'none'`.`.
		 *
		 * @type {String}
		 * @default 'translucent'
		 * @public
		 */
		scrimType: React.PropTypes.oneOf(['transparent', 'translucent', 'none']),

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
		 * can be either `'none'`, `'self-first'`, or `'self-only'`.
		 *
		 * @type {String}
		 * @default 'self-only'
		 * @public
		 */
		spotlightRestrict: PropTypes.oneOf(['none', 'self-first', 'self-only'])
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
		this.state = {
			floatLayerOpen: this.props.open,
			popupOpen: this.props.noAnimation,
			containerId: Spotlight.add(),
			activator: null
		};
	}

	componentDidMount () {
		if (this.props.open && this.props.noAnimation) {
			on('click', this.handleClick);
			on('keydown', this.handleKeyDown);
		}
	}

	componentWillReceiveProps (nextProps) {
		if (!this.props.open && nextProps.open) {
			this.setState({
				popupOpen: nextProps.noAnimation,
				floatLayerOpen: true,
				activator: Spotlight.getCurrent()
			});
		} else if (this.props.open && !nextProps.open) {
			this.setState({
				popupOpen: nextProps.noAnimation,
				floatLayerOpen: !nextProps.noAnimation,
				activator: nextProps.noAnimation ? null : this.state.activator
			});
		}
	}

	componentDidUpdate (prevProps, prevState) {
		if (this.props.open !== prevProps.open) {
			if (!this.props.noAnimation) {
				Spotlight.pause();
			} else if (this.props.open) {
				on('click', this.handleClick);
				on('keydown', this.handleKeyDown);
				this.spotPopupContent();
			} else if (prevProps.open) {
				off('click', this.handleClick);
				off('keydown', this.handleKeyDown);
				this.spotActivator(prevState.activator);
			}
		}
	}

	componentWillUnmount () {
		const {containerId} = this.state;
		if (this.props.open) {
			off('click', this.handleClick);
			off('keydown', this.handleKeyDown);
			Spotlight.setActiveContainer(null, containerId);
		}
		Spotlight.remove(this.state.containerId);
	}

	handleFloatingLayerOpen = () => {
		if (!this.props.noAnimation) {
			this.setState({
				popupOpen: true
			});
		}
	}

	handleClick = (ev) => {
		const {noAutoDismiss, onClose, scrimType, spotlightRestrict} = this.props;

		// to account for a specific edge-case in which all of the following conditions are met, we need a way
		// to close the popup via the pointer - by clicking outside the bounds of the popup
		if (onClose &&
				noAutoDismiss &&
				scrimType === 'none' &&
				spotlightRestrict !== 'self-only' &&
				!getContainerSpottables(this.state.containerId).length) {
			const spottable = ev.target.closest(`.${spottableClass}`);

			onClose(ev);
			if (spottable) {
				// explicitly turn off pointer-mode so focus can be programmatically changed
				Spotlight.setPointerMode(false);
				Spotlight.focus(spottable);
			}
		}
	}

	handleKeyDown = (ev) => {
		const {onClose, onKeyDown, spotlightRestrict} = this.props;
		const keyCode = ev.keyCode;
		const direction = getDirection(keyCode);
		const spottables = getContainerSpottables(this.state.containerId).length;

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
				// explicitly turn off pointer-mode so focus can be programmatically changed
				Spotlight.setPointerMode(false);
				onClose(ev);
			}
		}

		if (onKeyDown) {
			onKeyDown(ev);
		}
	}

	handlePopupHide = () => {
		this.setState({
			floatLayerOpen: false,
			activator: null
		});
	}

	handleTransitionEnd = (ev) => {
		if (ev.target.getAttribute('data-container-id') === this.state.containerId) {
			Spotlight.resume();

			if (this.props.open) {
				on('click', this.handleClick);
				on('keydown', this.handleKeyDown);
				this.spotPopupContent();
			} else {
				off('click', this.handleClick);
				off('keydown', this.handleKeyDown);
				this.spotActivator(this.state.activator);
			}
		}
	}

	spotActivator = (activator) => {
		const current = Spotlight.getCurrent();
		const {containerId} = this.state;
		const containerNode = getContainerNode(containerId);

		// if the currently-spotted control doesn't exist or is wrapped by the popup's container, we
		// know it's safe to change focus
		if (!current || (containerNode && containerNode.contains(current))) {
			Spotlight.setActiveContainer(null, containerId);
			// attempt to set focus to the activator, if available
			if (!Spotlight.focus(activator)) {
				Spotlight.focus();
			}
		}
	}

	spotPopupContent = () => {
		const {containerId} = this.state;
		if (!Spotlight.focus(containerId)) {
			const current = Spotlight.getCurrent();

			// In cases where the container contains no spottable controls or we're in pointer-mode, focus
			// cannot inherently set the active container or blur the active control, so we must do that
			// here. We don't explicitly turn off pointer-mode, as we don't want to spot controls in the
			// popup if it opened due to a pointer action.
			if (current) {
				current.blur();
			}
			Spotlight.setActiveContainer(containerId);
		}
	}

	render () {
		const {noAutoDismiss, onClose, scrimType, ...rest} = this.props;

		// We override the specified `spotlightRestrict` value because using `'self-only'` allows us to
		// a) lock spotlight within the popup when using pointer-mode to hover or click spottable controls
		// outside the popup and b) after switching from pointer to 5-way mode, give default focus to the
		// popup instead of any spottable controls that may be nearest to the pointer, if they are outside
		// the popup. We still use the specified `spotlightRestrict` value in the internal navigation logic.
		delete rest.spotlightRestrict;

		return (
			<FloatingLayer
				noAutoDismiss={noAutoDismiss}
				open={this.state.floatLayerOpen}
				onOpen={this.handleFloatingLayerOpen}
				onDismiss={onClose}
				onTransitionEnd={this.handleTransitionEnd}
				scrimType={scrimType}
			>
				<PopupBase
					aria-live="off"
					role="alert"
					{...rest}
					containerId={this.state.containerId}
					open={this.state.popupOpen}
					onCloseButtonClick={onClose}
					onHide={this.handlePopupHide}
					spotlightRestrict="self-only"
				/>
			</FloatingLayer>
		);
	}
}

export default Popup;
export {Popup, PopupBase};
