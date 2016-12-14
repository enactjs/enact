/**
 * Exports the {@link moonstone/Popup.Popup} and {@link moonstone/Popup.PopupBase} components.
 * The default export is {@link moonstone/Popup.Popup}.
 *
 * @module moonstone/Popup
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';
import Transition from '@enact/ui/Transition';
import FloatingLayer from '@enact/ui/FloatingLayer';
import Spotlight, {SpotlightContainerDecorator} from '@enact/spotlight';

import IconButton from '../IconButton';

import css from './Popup.less';

const TransitionContainer = SpotlightContainerDecorator({preserveId: true}, Transition);

const directions = {
	'37': 'left',
	'38': 'up',
	'39': 'right',
	'40': 'down'
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
	name: 'Popup',

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
		 * A function to be run when close button is clicked.
		 *
		 * @type {Function}
		 * @public
		 */
		onCloseButtonClicked: PropTypes.func,

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
		 * can be either `none`, `self-first`, or `self-only`.
		 *
		 * @type {String}
		 * @default `self-only`
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
		closeButton: ({showCloseButton, onCloseButtonClicked}) => {
			if (showCloseButton) {
				return (
					<IconButton
						className={css.closeButton}
						backgroundOpacity="transparent"
						small
						onClick={onCloseButtonClicked}
					>
						closex
					</IconButton>
				);
			}
		},
		zIndex: ({style}) => {
			if (style) {
				return {zIndex: style.zIndex};
			}
		}
	},

	render: ({closeButton, children, containerId, noAnimation, open, onHide, spotlightRestrict, zIndex, ...rest}) => {
		delete rest.onCloseButtonClicked;
		delete rest.showCloseButton;
		return (
			<TransitionContainer
				noAnimation={noAnimation}
				containerId={containerId}
				spotlightRestrict={spotlightRestrict}
				data-container-disabled={!open}
				visible={open}
				direction="down"
				duration="short"
				type="slide"
				fit
				style={zIndex}
				onHide={onHide}
			>
				<div {...rest}>
					{closeButton}
					<div className={css.body}>
						{children}
					</div>
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
		 * pressing `ESC` key or clicking on the close button. It is the responsibility of the
		 * callback to set the `open` state to false.
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
		 * Types of scrim. It can be either `transparent` or `translucent`.
		 *
		 * @type {String}
		 * @default `translucent`
		 * @public
		 */
		scrimType: React.PropTypes.oneOf(['transparent', 'translucent']),

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
		 * can be either `none`, `self-first`, or `self-only`.
		 *
		 * @type {String}
		 * @default `self-only`
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
			containerId: Spotlight.add()
		};
	}

	componentWillReceiveProps (nextProps) {
		if (!this.props.open && nextProps.open) {
			this.setState({
				popupOpen: nextProps.noAnimation,
				floatLayerOpen: true
			});
		} else if (this.props.open && !nextProps.open) {
			this.setState({
				popupOpen: nextProps.noAnimation,
				floatLayerOpen: !nextProps.noAnimation
			});
		}
	}

	componentDidUpdate (prevProps) {
		if (this.props.open !== prevProps.open) {
			if (!this.props.noAnimation) {
				Spotlight.pause();
			} else if (this.props.open) {
				this.spotPopupContent();
			} else if (prevProps.open) {
				this.spotActivatorControl();
			}
		}
	}

	componentWillUnmount () {
		Spotlight.remove(this.state.containerId);
	}

	handleFloatingLayerOpen = () => {
		if (!this.props.noAnimation) {
			this.setState({
				popupOpen: true
			});
		}
	}

	handleKeyDown = (ev) => {
		const {onClose, onKeyDown} = this.props;
		const direction = directions[ev.keyCode];
		let containerNode;

		if (direction) {
			// prevent default page scrolling
			ev.preventDefault();
			// stop propagation to prevent default spotlight behavior
			ev.stopPropagation();

			// if focus has changed
			if (Spotlight.move(direction)) {
				containerNode = document.querySelector('[data-container-id="' + this.state.containerId + '"]');

				// if current focus is not within the popup's container, issue the `onClose` event
				if (!containerNode.contains(document.activeElement) && onClose) {
					onClose(ev);
				}
			}
		}

		if (onKeyDown) {
			onKeyDown(ev);
		}
	}

	handlePopupHide = () => {
		this.setState({
			floatLayerOpen: false
		});
	}

	handleTransitionEnd = (ev) => {
		if (ev.target.getAttribute('data-container-id') === this.state.containerId) {
			Spotlight.resume();

			if (this.props.open) {
				this.spotPopupContent();
			} else {
				this.spotActivatorControl();
			}
		}
	}

	spotPopupContent = () => {
		Spotlight.focus(this.state.containerId);
	}

	spotActivatorControl = () => {
		Spotlight.focus();
	}

	render () {
		const {noAutoDismiss, onClose, scrimType, ...rest} = this.props;

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
					{...rest}
					containerId={this.state.containerId}
					open={this.state.popupOpen}
					onCloseButtonClicked={onClose}
					onHide={this.handlePopupHide}
					onKeyDown={this.handleKeyDown}
				/>
			</FloatingLayer>
		);
	}
}

export default Popup;
export {Popup, PopupBase};
