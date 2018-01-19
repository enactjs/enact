/**
 * Provides Moonstone-themed popup components and behaviors.
 *
 * @module moonstone/Popup
 * @exports Popup
 * @exports PopupBase
 * @exports PopupDecorator
 */

import {is} from '@enact/core/keymap';
import {on, off} from '@enact/core/dispatcher';
import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Spotlight, {getDirection} from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import {FloatingPopupBase, PopupDecorator as UiPopupDecorator} from '@enact/ui/Popup';
import {forward} from '@enact/core/handle';
import compose from 'ramda/src/compose';
import warning from 'warning';

import $L from '../internal/$L';
import IconButton from '../IconButton';
import Skinnable from '../Skinnable';

import componentCss from './Popup.less';

const isUp = is('up');

const getContainerNode = (containerId) => {
	return document.querySelector(`[data-container-id='${containerId}']`);
};

const forwardHide = forward('onHide');
const forwardShow = forward('onShow');

/**
 * [PopupBase]{@link moonstone/Popup.PopupBase} is a moonstone-styled modal component that appears
 * at the bottom of the screen and takes up the full screen width.
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
		 * A function to run after transition for showing is finished.
		 *
		 * @type {Function}
		 * @public
		 */
		onShow: PropTypes.func,

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
		css: componentCss
	},

	computed: {
		className: ({showCloseButton, styler}) => styler.append({reserveClose: showCloseButton}),
		closeButton: ({css, showCloseButton, onCloseButtonClick}) => {
			if (showCloseButton) {
				return (
					<IconButton
						className={css.closeButton}
						backgroundOpacity="transparent"
						small
						onTap={onCloseButtonClick}
						aria-label={$L('Close')}
					>
						closex
					</IconButton>
				);
			}
		}
	},

	render: ({closeButton, children, css, noAnimation, open, onHide, onShow, ...rest}) => {
		delete rest.onCloseButtonClick;
		delete rest.showCloseButton;

		return (
			<FloatingPopupBase
				css={css}
				{...rest}
				noAnimation={noAnimation}
				onHide={onHide}
				onShow={onShow}
				open={open}
			>
				<div className={css.body}>
					{children}
				</div>
				{closeButton}
			</FloatingPopupBase>
		);
	}
});

// Deprecate using scrimType 'none' with spotlightRestrict of 'self-only'
const checkScrimNone = (props) => {
	const validScrim = !(props.scrimType === 'none' && props.spotlightRestrict === 'self-only');
	warning(validScrim, "Using 'spotlightRestrict' of 'self-only' without a scrim " +
		'is not supported. Use a transparent scrim to prevent spotlight focus outside of the popup');
};

/**
 * [MoonstonePopupDecorator]{@link moonstone/Popup.MoonstonePopupDecorator} is a Higher-order Component that manages
 * spotlight focus.
 *
 * @class MoonstonePopupDecorator
 * @memberof moonstone/Popup.MoonstonePopupDecorator
 * @hoc
 * @private
 */
const MoonstonePopupDecorator = hoc((config, Wrapped) => {
	return class extends React.Component {
		static displayName = 'MoonstonePopupDecorator'

		static propTypes = /** @lends moonstone/Popup.MoonstonePopupDecorator.prototype */ {
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
			spotlightRestrict: 'self-only'
		}

		constructor (props) {
			super(props);
			this.state = {
				containerId: Spotlight.add(),
				activator: null
			};
			checkScrimNone(this.props);
		}

		componentDidMount () {
			if (this.props.open && this.props.noAnimation) {
				on('keydown', this.handleKeyDown);
				this.spotPopupContent();
			}
		}

		componentWillReceiveProps (nextProps) {
			if (!this.props.open && nextProps.open) {
				this.setState(() => ({
					activator: Spotlight.getCurrent()
				}));
			} else if (this.props.open && !nextProps.open) {
				this.setState(() => ({
					activator: nextProps.noAnimation ? null : this.state.activator
				}));
			}
			checkScrimNone(nextProps);
		}

		componentDidUpdate (prevProps, prevState) {
			if (this.props.open !== prevProps.open) {
				if (!this.props.noAnimation) {
					Spotlight.pause();
				} else if (this.props.open) {
					forwardShow({}, this.props);
					on('keydown', this.handleKeyDown);
					this.spotPopupContent();
				} else if (prevProps.open) {
					forwardHide({}, this.props);
					off('keydown', this.handleKeyDown);
					this.spotActivator(prevState.activator);
				}
			}
		}

		componentWillUnmount () {
			// TODO: does it ever reach here?
			if (this.props.open) {
				off('keydown', this.handleKeyDown);
			}
			Spotlight.remove(this.state.containerId);
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

			this.setState(() => ({
				activator: null
			}));

			if (ev.target.querySelector(`[data-container-id="${this.state.containerId}"]`)) {
				Spotlight.resume();
				if (!this.props.open) {
					off('keydown', this.handleKeyDown);
					this.spotActivator(this.state.activator);
				}
			}
		}

		handlePopupShow = (ev) => {
			forwardShow(ev, this.props);

			if (ev.target.querySelector(`[data-container-id="${this.state.containerId}"]`)) {
				Spotlight.resume();

				if (this.props.open) {
					on('keydown', this.handleKeyDown);
					this.spotPopupContent();
				}
			}
		}

		spotActivator = (activator) => {
			const current = Spotlight.getCurrent();
			const containerNode = getContainerNode(this.state.containerId);
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
			const props = Object.assign({}, this.props);
			const {onClose, ...rest} = props;
			delete rest.onDismiss;
			delete rest.spotlightRestrict;

			return (
				<Wrapped
					{...rest}
					containerId={this.state.containerId}
					onCloseButtonClick={onClose}
					onClose={onClose}
					onHide={this.handlePopupHide}
					onShow={this.handlePopupShow}
					spotlightRestrict="self-only"
				/>
			);
		}
	};
});

/**
 * Moonstone-specific popup behaviors to apply to [Popup]{@link moonstone/Popup.PopupBase}.
 *
 * @hoc
 * @memberof moonstone/Popup
 * @mixes ui/Popup.PopupDecorator
 * @mixes ui/Skinnable.Skinnable
 * @mixes spotlight/SpotlightContainerDecorator
 */
const PopupDecorator = compose(
	MoonstonePopupDecorator,
	UiPopupDecorator,
	Skinnable({defaultSkin: 'light'}),
	SpotlightContainerDecorator({enterTo: 'default-element', preserveId: true})
);

/**
 * A moonstone-styled popup with built-in support for spotlight.
 *
 * @class Popup
 * @memberof moonstone/Popup
 * @mixes moonstone/Popup.PopupDecorator
 * @ui
 * @public
 */
const Popup = PopupDecorator(PopupBase);

export default Popup;
export {
	Popup,
	PopupBase,
	PopupDecorator
};
