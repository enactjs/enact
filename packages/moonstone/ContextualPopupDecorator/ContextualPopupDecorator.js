/**
 * Higher-order Component to add a Moonstone styled popup to a component.
 *
 * @module moonstone/ContextualPopupDecorator
 * @exports	ContextualPopup
 * @exports	ContextualPopupDecorator
 */

import {on, off} from '@enact/core/dispatcher';
import {handle, forProp, forKey, forward, stop} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {Subscription} from '@enact/core/internal/PubSub';
import {extractAriaProps} from '@enact/core/util';
import Spotlight, {getDirection} from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import ri from '@enact/ui/resolution';
import FloatingLayer from '@enact/ui/FloatingLayer';
import PropTypes from 'prop-types';
import React from 'react';

import {ContextualPopup} from './ContextualPopup';

import css from './ContextualPopupDecorator.less';

/**
 * Default config for {@link moonstone/ContextualPopupDecorator.ContextualPopupDecorator}
 *
 * @type {Object}
 * @hocconfig
 * @memberof moonstone/ContextualPopupDecorator.ContextualPopupDecorator
 */
const defaultConfig = {
	/**
	 * Disables passing the `skin` prop to the wrapped component.
	 *
	 * @see ui/Skinnable.Skinnable.skin
	 * @type {Boolean}
	 * @default false
	 * @memberof moonstone/ContextualPopupDecorator.ContextualPopupDecorator.defaultConfig
	 * @public
	 */
	noSkin: false,

	/**
	 * The prop in which to pass the value of `open` state of ContextualPopupDecorator to the
	 * wrapped component.
	 *
	 * @type {String}
	 * @default 'selected'
	 * @memberof moonstone/ContextualPopupDecorator.ContextualPopupDecorator.defaultConfig
	 * @public
	 */
	openProp: 'selected'
};

const ContextualPopupContainer = SpotlightContainerDecorator(
	{enterTo: 'default-element', preserveId: true},
	ContextualPopup
);

/**
 * A Higher-order Component that positions a
 * [ContextualPopup]{@link moonstone/ContextualPopupDecorator.ContextualPopup} relative to the
 * wrapped component.
 *
 * Usage:
 * ```
 * const ButtonWithPopup = ContextualPopupDecorator(Button);
 * <ButtonWithPopup
 *     popupComponent={CustomPopupComponent}
 * >
 *     Open Popup
 * </ButtonWithPopup>
 * ```
 *
 * @class ContextualPopupDecorator
 * @memberof moonstone/ContextualPopupDecorator
 * @hoc
 * @public
 */
const ContextualPopupDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {noSkin, openProp} = config;

	const Decorator = class extends React.Component {
		static displayName = 'ContextualPopupDecorator'

		static propTypes = /** @lends moonstone/ContextualPopupDecorator.ContextualPopupDecorator.prototype */ {
			/**
			 * The component rendered within the
			 * [ContextualPopup]{@link moonstone/ContextualPopupDecorator.ContextualPopup}.
			 *
			 * @type {Component}
			 * @required
			 * @public
			 */
			popupComponent: PropTypes.func.isRequired,

			/**
			 * Direction of popup with respect to the wrapped component.
			 *
			 * @type {String}
			 * @default 'down'
			 * @public
			 */
			direction: PropTypes.oneOf(['up', 'down', 'left', 'right']),

			/**
			 * Disables closiung the popup when the user presses the cancel key or taps outside the
			 * popup.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			noAutoDismiss: PropTypes.bool,

			/**
			 * Called when the user has attempted to close the popup.
			 *
			 * This may occur either when the close button is clicked or when spotlight focus
			 * moves outside the boundary of the popup. Setting `spotlightRestrict` to `'self-only'`
			 * will prevent Spotlight focus from leaving the popup.
			 *
			 * @type {Function}
			 * @public
			 */
			onClose: PropTypes.func,

			/**
			 * Called when the popup is opened.
			 *
			 * @type {Function}
			 * @public
			 */
			onOpen: PropTypes.func,

			/**
			 * Displays the contextual popup.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			open: PropTypes.bool,

			/**
			 * CSS class name to pass to the
			 * [ContextualPopup]{@link moonstone/ContextualPopupDecorator.ContextualPopup}.
			 *
			 * This is commonly used to set width and height of the popup.
			 *
			 * @type {String}
			 * @public
			 */
			popupClassName: PropTypes.string,

			/**
			 * An object containing properties to be passed to popup component.
			 *
			 * @type {Object}
			 * @public
			 */
			popupProps: PropTypes.object,

			/**
			 * The container ID to use with Spotlight.
			 *
			 * The spotlight container for the popup isn't created until it is open. To configure
			 * the container using `Spotlight.set()`, handle the `onOpen` event which is fired after
			 * the popup has been created and opened.
			 *
			 * @type {String}
			 * @public
			 */
			popupSpotlightId: PropTypes.string,

			/**
			 * Indicates the content's text direction is right-to-left.
			 *
			 * @type {Boolean}
			 * @private
			 */
			rtl: PropTypes.bool,

			/**
			 * Shows the close button.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			showCloseButton : PropTypes.bool,

			/**
			 * The current skin for this component.
			 *
			 * When `noSkin` is set on the config object, `skin` will only be applied to the
			 * [ContextualPopup]{@link moonstone/ContextualPopupDecorator.ContextualPopup} and not
			 * to the popup's activator component.
			 *
			 * @see ui/Skinnable.Skinnable.skin
			 * @type {String}
			 * @public
			 */
			skin: PropTypes.string,

			/**
			 * Restricts or prioritizes spotlight navigation.
			 *
			 * Allowed values are:
			 * * `'none'` - Spotlight can move freely within and beyond the popup
			 * * `'self-first'` - Spotlight should prefer components within the popup over
			 *   components beyond the popup, or
			 * * `'self-only'` - Spotlight can only be set within the popup
			 *
			 * @type {String}
			 * @default 'self-first'
			 * @public
			 */
			spotlightRestrict: PropTypes.oneOf(['none', 'self-first', 'self-only'])
		}

		static defaultProps = {
			direction: 'down',
			noAutoDismiss: false,
			open: false,
			showCloseButton: false,
			spotlightRestrict: 'self-first'
		}

		constructor (props) {
			super(props);
			this.state = {
				arrowPosition: {top: 0, left: 0},
				containerPosition: {top: 0, left: 0},
				containerId: Spotlight.add(this.props.popupSpotlightId),
				activator: null,
				shouldSpotActivator: true
			};

			this.overflow = {};
			this.adjustedDirection = this.props.direction;

			this.ARROW_WIDTH = ri.scale(30);
			this.ARROW_OFFSET = ri.scale(18);
			this.MARGIN = ri.scale(12);
		}

		componentDidMount () {
			if (this.props.open) {
				on('keydown', this.handleKeyDown);
				on('keyup', this.handleKeyUp);
			}
		}

		componentWillReceiveProps (nextProps) {
			const current = Spotlight.getCurrent();

			if (this.props.direction !== nextProps.direction) {
				this.adjustedDirection = nextProps.direction;
				this.setContainerPosition();
			}

			if (!this.props.open && nextProps.open) {
				this.updateLeaveFor(current);
				this.setState({
					activator: current
				});
			} else if (this.props.open && !nextProps.open) {

				this.updateLeaveFor(null);
				this.setState({
					activator: null,
					// only spot the activator on close if spotlight isn't set or if the current
					// focus is within the popup
					shouldSpotActivator: !current || this.containerNode.contains(current)
				});
			}
		}

		componentDidUpdate (prevProps, prevState) {
			if (this.props.open && !prevProps.open) {
				on('keydown', this.handleKeyDown);
				on('keyup', this.handleKeyUp);
				this.spotPopupContent();
			} else if (!this.props.open && prevProps.open) {
				off('keydown', this.handleKeyDown);
				off('keyup', this.handleKeyUp);

				if (this.state.shouldSpotActivator) {
					this.spotActivator(prevState.activator);
				}
			}
		}

		componentWillUnmount () {
			if (this.props.open) {
				off('keydown', this.handleKeyDown);
				off('keyup', this.handleKeyUp);
			}
			Spotlight.remove(this.state.containerId);
		}

		updateLeaveFor (activator) {
			Spotlight.set(this.state.containerId, {
				leaveFor: {
					up: activator,
					down: activator,
					left: activator,
					right: activator
				}
			});
		}

		getContainerPosition (containerNode, clientNode) {
			const position = this.centerContainerPosition(containerNode, clientNode);

			switch (this.adjustedDirection) {
				case 'up':
					position.top = clientNode.top - this.ARROW_OFFSET - containerNode.height;
					break;
				case 'down':
					position.top = clientNode.bottom + this.ARROW_OFFSET;
					break;
				case 'right':
					position.left = this.props.rtl ? clientNode.left - containerNode.width - this.ARROW_OFFSET : clientNode.right + this.ARROW_OFFSET;
					break;
				case 'left':
					position.left = this.props.rtl ? clientNode.right + this.ARROW_OFFSET : clientNode.left - containerNode.width - this.ARROW_OFFSET;
					break;
			}

			return this.adjustRTL(position);
		}

		centerContainerPosition (containerNode, clientNode) {
			let pos = {};
			if (this.adjustedDirection === 'up' || this.adjustedDirection === 'down') {
				if (this.overflow.isOverLeft) {
					// anchor to the left of the screen
					pos.left = this.MARGIN;
				} else if (this.overflow.isOverRight) {
					// anchor to the right of the screen
					pos.left = window.innerWidth - containerNode.width - this.MARGIN;
				} else {
					// center horizontally
					pos.left = clientNode.left + (clientNode.width - containerNode.width) / 2;
				}
			} else if (this.adjustedDirection === 'left' || this.adjustedDirection === 'right') {
				if (this.overflow.isOverTop) {
					// anchor to the top of the screen
					pos.top = this.MARGIN;
				} else if (this.overflow.isOverBottom) {
					// anchor to the bottom of the screen
					pos.top = window.innerHeight - containerNode.height - this.MARGIN;
				} else {
					// center vertically
					pos.top = clientNode.top - (containerNode.height - clientNode.height) / 2;
				}
			}

			return pos;
		}

		getArrowPosition (clientNode) {
			const position = {};

			if (this.adjustedDirection === 'up' || this.adjustedDirection === 'down') {
				position.left = clientNode.left + (clientNode.width - this.ARROW_WIDTH) / 2;
			} else {
				position.top = clientNode.top + (clientNode.height - this.ARROW_WIDTH) / 2;
			}

			switch (this.adjustedDirection) {
				case 'up':
					position.top = clientNode.top - this.ARROW_WIDTH;
					break;
				case 'down':
					position.top = clientNode.bottom;
					break;
				case 'left':
					position.left = this.props.rtl ? clientNode.left + clientNode.width : clientNode.left - this.ARROW_WIDTH;
					break;
				case 'right':
					position.left = this.props.rtl ? clientNode.left - this.ARROW_WIDTH : clientNode.left + clientNode.width;
					break;
				default:
					return {};
			}

			return this.adjustRTL(position);
		}

		calcOverflow (container, client) {
			let containerHeight, containerWidth;

			if (this.adjustedDirection === 'up' || this.adjustedDirection === 'down') {
				containerHeight = container.height;
				containerWidth = (container.width - client.width) / 2;
			} else {
				containerHeight = (container.height - client.height) / 2;
				containerWidth = container.width;
			}

			this.overflow = {
				isOverTop: client.top - containerHeight - this.ARROW_OFFSET - this.MARGIN < 0,
				isOverBottom: client.bottom + containerHeight + this.ARROW_OFFSET + this.MARGIN  > window.innerHeight,
				isOverLeft: client.left - containerWidth - this.ARROW_OFFSET - this.MARGIN < 0,
				isOverRight: client.right + containerWidth + this.ARROW_OFFSET + this.MARGIN > window.innerWidth
			};
		}

		adjustDirection () {
			if (this.overflow.isOverTop && !this.overflow.isOverBottom && this.adjustedDirection === 'up') {
				this.adjustedDirection = 'down';
			} else if (this.overflow.isOverBottom && !this.overflow.isOverTop && this.adjustedDirection === 'down') {
				this.adjustedDirection = 'up';
			} else if (this.overflow.isOverLeft && !this.overflow.isOverRight && this.adjustedDirection === 'left' && !this.props.rtl) {
				this.adjustedDirection = 'right';
			} else if (this.overflow.isOverRight && !this.overflow.isOverLeft && this.adjustedDirection === 'right' && !this.props.rtl) {
				this.adjustedDirection = 'left';
			}
		}

		adjustRTL (position) {
			let pos = position;
			if (this.props.rtl) {
				const tmpLeft = pos.left;
				pos.left = pos.right;
				pos.right = tmpLeft;
			}
			return pos;
		}

		setContainerPosition () {
			if (this.containerNode && this.clientNode) {
				const containerNode = this.containerNode.getBoundingClientRect();
				const {top, left, bottom, right, width, height} = this.clientNode.getBoundingClientRect();
				const clientNode = {top, left, bottom, right, width, height};
				clientNode.left = this.props.rtl ? window.innerWidth - right : left;
				clientNode.right = this.props.rtl ? window.innerWidth - left : right;

				this.calcOverflow(containerNode, clientNode);
				this.adjustDirection();

				this.setState({
					direction: this.adjustedDirection,
					arrowPosition: this.getArrowPosition(clientNode),
					containerPosition: this.getContainerPosition(containerNode, clientNode)
				});
			}
		}

		getContainerNode = (node) => {
			this.containerNode = node;
			if (node) {
				this.setContainerPosition();
			}
		}

		getClientNode = (node) => {
			this.clientNode = node;
		}

		handle = handle.bind(this)

		handleKeyUp = this.handle(
			forProp('open', true),
			forKey('enter'),
			() => Spotlight.getCurrent() === this.state.activator,
			stop,
			forward('onClose')
		)

		handleDirectionalKey (ev) {
			// prevent default page scrolling
			ev.preventDefault();
			// stop propagation to prevent default spotlight behavior
			ev.stopPropagation();
			// set the pointer mode to false on keydown
			Spotlight.setPointerMode(false);
		}

		// handle key event from outside (i.e. the activator) to the popup container
		handleKeyDown = (ev) => {
			const {activator, containerId} = this.state;
			const {spotlightRestrict} = this.props;
			const current = Spotlight.getCurrent();
			const direction = getDirection(ev.keyCode);

			if (!direction) return;

			const hasSpottables = Spotlight.getSpottableDescendants(containerId).length > 0;
			const spotlessSpotlightModal = spotlightRestrict === 'self-only' && !hasSpottables;
			const shouldSpotPopup = current === activator && direction === this.adjustedDirection && hasSpottables;

			if (shouldSpotPopup || spotlessSpotlightModal) {
				this.handleDirectionalKey(ev);

				// we guard against attempting a focus change by verifying the case where a
				// spotlightModal popup contains no spottable components
				if (!spotlessSpotlightModal && shouldSpotPopup) {
					this.spotPopupContent();
				}
			}
		}

		// handle key event from contextual popup and closes the popup
		handleContainerKeyDown = (ev) => {
			// Note: Container will be only rendered if `open`ed, therefore no need to check for `open`
			const direction = getDirection(ev.keyCode);

			if (!direction) return;

			this.handleDirectionalKey(ev);

			// if focus moves outside the popup's container, issue the `onClose` event
			if (Spotlight.move(direction) && !this.containerNode.contains(Spotlight.getCurrent())) {
				forward('onClose', ev, this.props);
			}
		}

		spotActivator = (activator) => {
			if (activator && activator === Spotlight.getCurrent()) {
				activator.blur();
			}
			if (!Spotlight.focus(activator)) {
				Spotlight.focus();
			}
		}

		spotPopupContent = () => {
			const {spotlightRestrict} = this.props;
			const {containerId} = this.state;
			const spottableDescendants = Spotlight.getSpottableDescendants(containerId);
			if (spotlightRestrict === 'self-only' && spottableDescendants.length && Spotlight.getCurrent()) {
				Spotlight.getCurrent().blur();
			}

			if (!Spotlight.focus(containerId)) {
				Spotlight.setActiveContainer(containerId);
			}
		}

		render () {
			const {showCloseButton, popupComponent: PopupComponent, popupClassName, noAutoDismiss, open, onClose, onOpen, popupProps, skin, spotlightRestrict, ...rest} = this.props;
			const scrimType = spotlightRestrict === 'self-only' ? 'transparent' : 'none';
			const popupPropsRef = Object.assign({}, popupProps);
			const ariaProps = extractAriaProps(popupPropsRef);

			if (!noSkin) {
				rest.skin = skin;
			}

			delete rest.popupSpotlightId;
			delete rest.rtl;

			if (openProp) rest[openProp] = open;

			return (
				<div className={css.contextualPopupDecorator}>
					<FloatingLayer open={open} scrimType={scrimType} noAutoDismiss={noAutoDismiss} onDismiss={onClose} onOpen={onOpen}>
						<ContextualPopupContainer
							{...ariaProps}
							className={popupClassName}
							showCloseButton={showCloseButton}
							onCloseButtonClick={onClose}
							onKeyDown={this.handleContainerKeyDown}
							direction={this.state.direction}
							arrowPosition={this.state.arrowPosition}
							containerPosition={this.state.containerPosition}
							containerRef={this.getContainerNode}
							skin={skin}
							spotlightId={this.state.containerId}
							spotlightRestrict={spotlightRestrict}
						>
							<PopupComponent {...popupPropsRef} />
						</ContextualPopupContainer>
					</FloatingLayer>
					<div ref={this.getClientNode}>
						<Wrapped {...rest} />
					</div>
				</div>
			);
		}
	};

	return Subscription(
		{
			channels: ['i18n'],
			mapMessageToProps: (key, {rtl}) => ({rtl})
		},
		Decorator
	);
});

export default ContextualPopupDecorator;
export {
	ContextualPopupDecorator,
	ContextualPopup
};
