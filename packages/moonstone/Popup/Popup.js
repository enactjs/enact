/**
 * Exports the {@link moonstone/Popup.Popup} and {@link moonstone/Popup.PopupBase} components.
 * The default export is {@link moonstone/Popup.Popup}.
 *
 * @module moonstone/Popup
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';
import Transition from '@enact/ui/Transition';
import FloatLayer from '@enact/ui/FloatLayer';
import {SpotlightContainerDecorator} from '@enact/spotlight';

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

/**
 * {@link moonstone/Popup.Popup} is a stateful component that help {@link moonstone/Popup.PopupBase}
 * to appear in {@link ui/FloatLayer.FloatLayer}.
 *
 * @class Popup
 * @memberOf moonstone/Popup
 * @ui
 * @public
 */
class Popup extends React.Component {
	static propTypes = /** @lends moonstone/Popup.Popup.prototype */ {
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
		noAutoDismiss: PropTypes.bool,

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
		 * When `true`, Popup is rendered into {@link ui/FloatLayer.FloatLayer}.
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
		showCloseButton: PropTypes.bool
	}

	static defaultProps = {
		open: false,
		noAnimation: false,
		noAutoDismiss: false,
		scrimType: 'translucent',
		showCloseButton: false
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
			this.setState({
				popupOpen: this.props.noAnimation,
				floatLayerOpen: true
			});
		} else if (this.props.open && !nextProps.open) {
			this.setState({
				popupOpen: this.props.noAnimation,
				floatLayerOpen: !this.props.noAnimation
			});
		}
	}

	handleFloatingLayerOpen = () => {
		if (!this.props.noAnimation) {
			this.setState({
				popupOpen: true
			});
		}
	}

	handlePopupHide = () => {
		this.setState({
			floatLayerOpen: false
		});
	}

	render () {
		const {noAutoDismiss, onClose, scrimType, ...rest} = this.props;

		return (
			<FloatLayer
				noAutoDismiss={noAutoDismiss}
				open={this.state.floatLayerOpen}
				onOpen={this.handleFloatingLayerOpen}
				onDismiss={onClose}
				scrimType={scrimType}
			>
				<PopupBase
					{...rest}
					open={this.state.popupOpen}
					onCloseButtonClicked={onClose}
					onHide={this.handlePopupHide}
				/>
			</FloatLayer>
		);
	}
}

export default Popup;
export {Popup, PopupBase};
