/**
 * Exports the {@link moonstone/Popup.Popup} and {@link moonstone/Popup.PopupBase}.
 * The default export is {@link moonstone/Popup.Popup}.
 *
 * @module moonstone/Popup
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';
import Transition from '@enact/ui/Transition';
import Portal from '@enact/ui/Portal';
import {SpotlightContainerDecorator} from '@enact/spotlight';

import Layerable from '../Layerable';
import IconButton from '../IconButton';

import css from './Popup.less';

const TransitionContainer = SpotlightContainerDecorator(Transition);

/**
 * {@link moonstone/Popup.PopupBase} is a modal component that appears at the bottom of
 * the screen and takes up the full screen width.
 *
 * @class PopupBase
 * @memberOf moonstone/Popup
 * @ui
 * @public
 */
const PopupBase = kind({
	name: 'Popup',

	propTypes: {
		/**
		 * The element(s) to be displayed in the body of the popup.
		 *
		 * @type {Node}
		 * @public
		 */
		children: React.PropTypes.oneOfType([
			React.PropTypes.arrayOf(React.PropTypes.element),
			React.PropTypes.element
		]).isRequired,

		anchor: PropTypes.object,

		/**
		 * When `true`, popups will not animate on/off screen.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAnimation: PropTypes.bool,

		/**
		 * A function to run when close button is clicked.
		 *
		 * @type {Function}
		 * @public
		 */
		onCloseButtonClicked: PropTypes.func,

		/**
		 * A function to run after transition for hiding is finished.
		 *
		 * @type {Function}
		 * @public
		 */
		onHide: PropTypes.func,

		/**
		 * Is this control in the expanded state (true), opened, with the contents visible?
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
		showCloseButton: PropTypes.bool
	},

	defaultProps: {
		anchor: {bottom: 0},
		noAnimation: false,
		open: false,
		showCloseButton: false
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

	render: ({closeButton, children, noAnimation, open, onHide, zIndex, ...rest}) => {
		delete rest.anchor;
		delete rest.onCloseButtonClicked;
		delete rest.showCloseButton;
		return (
			<TransitionContainer
				noAnimation={noAnimation}
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

const LayerablePopup = Layerable(PopupBase);

/**
 * {@link moonstone/Popup.Popup} is a stateful component that help {@link moonstone/Popup.PopupBase}
 * to appear in {@link ui/Portal.Portal} layer.
 *
 * @class Popup
 * @memberOf moonstone/Popup
 * @ui
 * @public
 */
class Popup extends React.Component {
	static propTypes = {
		/**
		 * When `true`, popups will not animate on/off screen.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAnimation: PropTypes.bool,

		/**
		 * When `true`, Popup will not close when the user presses `ESC` key.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAutoDismiss: React.PropTypes.bool,

		/**
		 * A function to run when closing action is invoked by the user. These actions include
		 * pressing `ESC` key or clicking on close button. Normally, callback will set `open`
		 * state to false.
		 *
		 * @type {Function}
		 * @public
		 */
		onClose: PropTypes.func,

		/**
		 * When `true`, Popup is rendered into portal.
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
		showCloseButton: PropTypes.bool
	}

	static defaultProps = {
		open: false,
		noAnimation: false,
		noAutoDismiss: false,
		showCloseButton: false
	}

	constructor (props) {
		super(props);
		this.state = {
			portalOpen: this.props.open || false,
			popupOpen: this.props.noAnimation
		};
	}

	componentWillReceiveProps (nextProps) {
		if (!this.props.open && nextProps.open) {
			this.setState({
				popupOpen: this.props.noAnimation,
				portalOpen: true
			});
		} else if (this.props.open && !nextProps.open) {
			this.setState({
				popupOpen: this.props.noAnimation,
				portalOpen: !this.props.noAnimation
			});
		}
	}

	handlePortalOpen = () => {
		if (!this.props.noAnimation) {
			this.setState({
				popupOpen: true
			});
		}
	}

	handlePopupHide = () => {
		this.setState({
			portalOpen: false
		});
	}

	render () {
		const {noAutoDismiss, onClose, ...rest} = this.props;

		return (
			<Portal
				noAutoDismiss={noAutoDismiss}
				open={this.state.portalOpen}
				onOpen={this.handlePortalOpen}
				onDismiss={onClose}
			>
				<LayerablePopup
					{...rest}
					open={this.state.popupOpen}
					onCloseButtonClicked={onClose}
					onHide={this.handlePopupHide}
				/>
			</Portal>
		);
	}
}

export default Popup;
export {Popup, PopupBase};
