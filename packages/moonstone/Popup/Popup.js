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
import {SpotlightContainerDecorator} from '@enact/spotlight';

import IconButton from '../IconButton';

import css from './Popup.less';

const TransitionContainer = SpotlightContainerDecorator(Transition);

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
		showCloseButton: PropTypes.bool
	},

	defaultProps: {
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
		 * When `true`, the popup is rendered. Popups are rendered into the
		 * [floating layer]{@link ui/FloatingLayer.FloatingLayer}.
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
		noAnimation: false,
		noAutoDismiss: false,
		open: false,
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
		const {noAutoDismiss, onClose, ...rest} = this.props;

		return (
			<FloatingLayer
				noAutoDismiss={noAutoDismiss}
				open={this.state.floatLayerOpen}
				onOpen={this.handleFloatingLayerOpen}
				onDismiss={onClose}
			>
				<PopupBase
					{...rest}
					open={this.state.popupOpen}
					onCloseButtonClicked={onClose}
					onHide={this.handlePopupHide}
				/>
			</FloatingLayer>
		);
	}
}

export default Popup;
export {Popup, PopupBase};
