/**
 * A higher-order component to add a Moonstone styled popup to a component.
 *
 * @module moonstone/ContextualPopupDecorator
 * @exports	ContextualPopup
 * @exports	ContextualPopupDecorator
 */

import ApiDecorator from '@enact/core/internal/ApiDecorator';
import {on, off} from '@enact/core/dispatcher';
import {handle, forProp, forKey, forward, stop} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import EnactPropTypes from '@enact/core/internal/prop-types';
import {extractAriaProps} from '@enact/core/util';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import Spotlight, {getDirection} from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import FloatingLayer from '@enact/ui/FloatingLayer';
import ri from '@enact/ui/resolution';
import compose from 'ramda/src/compose';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import {ContextualPopup} from './ContextualPopup';

import css from './ContextualPopupDecorator.module.less';

/**
 * Default config for {@link moonstone/ContextualPopupDecorator.ContextualPopupDecorator}
 *
 * @type {Object}
 * @hocconfig
 * @memberof moonstone/ContextualPopupDecorator.ContextualPopupDecorator
 */
const defaultConfig = {
	/**
	 * `ContextualPopup` without the arrow.
	 *
	 * @type {Boolean}
	 * @default false
	 * @memberof moonstone/ContextualPopupDecorator.ContextualPopupDecorator.defaultConfig
	 * @public
	 */
	noArrow: false,

	/**
	 * Disables passing the `skin` prop to the wrapped component.
	 *
	 * @see {@link moonstone/Skinnable.Skinnable.skin}
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

const Decorator = hoc(defaultConfig, (config, Wrapped) => {
	const {noArrow, noSkin, openProp} = config;

	return class extends React.Component {
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
			popupComponent: EnactPropTypes.component.isRequired,

			/**
			 * Limits the range of voice control to the popup.
			 *
			 * @memberof moonstone/ContextualPopupDecorator.ContextualPopupDecorator.prototype
			 * @type {Boolean}
			 * @default true
			 * @public
			 */
			'data-webos-voice-exclusive': PropTypes.bool,

			/**
			 * Direction of popup with respect to the wrapped component.
			 *
			 * @type {String}
			 * @default 'down'
			 * @public
			 */
			direction: PropTypes.oneOf(['up', 'down', 'left', 'right']),

			/**
			 * Disables closing the popup when the user presses the cancel key or taps outside the
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
			 * Registers the ContextualPopupDecorator component with an [ApiDecorator]
			 * {@link core/internal/ApiDecorator.ApiDecorator}.
			 *
			 * @type {Function}
			 * @private
			 */
			setApiProvider: PropTypes.func,

			/**
			 * Shows the close button.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			showCloseButton: PropTypes.bool,

			/**
			 * The current skin for this component.
			 *
			 * When `noSkin` is set on the config object, `skin` will only be applied to the
			 * [ContextualPopup]{@link moonstone/ContextualPopupDecorator.ContextualPopup} and not
			 * to the popup's activator component.
			 *
			 * @see {@link moonstone/Skinnable.Skinnable.skin}
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
			'data-webos-voice-exclusive': true,
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
				activator: null
			};

			this.overflow = {};
			this.adjustedDirection = this.props.direction;

			this.ARROW_WIDTH = ri.scale(30); // svg arrow width. used for arrow positioning
			this.ARROW_OFFSET = noArrow ? 0 : ri.scale(18); // actual distance of the svg arrow displayed to offset overlaps with the container. Offset is when `noArrow` is false.
			this.MARGIN = noArrow ? ri.scale(3) : ri.scale(9); // margin from an activator to the contextual popup.
			this.KEEPOUT = ri.scale(12); // keep out distance on the edge of the screen

			if (props.setApiProvider) {
				props.setApiProvider(this);
			}
		}

		componentDidMount () {
			if (this.props.open) {
				on('keydown', this.handleKeyDown);
				on('keyup', this.handleKeyUp);
			}
		}

		getSnapshotBeforeUpdate (prevProps, prevState) {
			if (prevProps.open && !this.props.open) {
				const current = Spotlight.getCurrent();
				return {
					shouldSpotActivator: (
						// isn't set
						!current ||
						// is on the activator and we want to re-spot it so a11y read out can occur
						current === prevState.activator ||
						// is within the popup
						this.containerNode.contains(current)
					)
				};
			}
			return null;
		}

		componentDidUpdate (prevProps, prevState, snapshot) {
			if (prevProps.direction !== this.props.direction) {
				this.adjustedDirection = this.props.direction;
				// NOTE: `setState` is called and will cause re-render
				this.positionContextualPopup();
			}

			if (this.props.open && !prevProps.open) {
				on('keydown', this.handleKeyDown);
				on('keyup', this.handleKeyUp);
			} else if (!this.props.open && prevProps.open) {
				off('keydown', this.handleKeyDown);
				off('keyup', this.handleKeyUp);
				if (snapshot && snapshot.shouldSpotActivator) {
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
					position.top = clientNode.top - this.ARROW_OFFSET - containerNode.height - this.MARGIN;
					break;
				case 'down':
					position.top = clientNode.bottom + this.ARROW_OFFSET + this.MARGIN;
					break;
				case 'right':
					position.left = this.props.rtl ? clientNode.left - containerNode.width - this.ARROW_OFFSET - this.MARGIN : clientNode.right + this.ARROW_OFFSET + this.MARGIN;
					break;
				case 'left':
					position.left = this.props.rtl ? clientNode.right + this.ARROW_OFFSET + this.MARGIN : clientNode.left - containerNode.width - this.ARROW_OFFSET - this.MARGIN;
					break;
			}

			return this.adjustRTL(position);
		}

		centerContainerPosition (containerNode, clientNode) {
			let pos = {};
			if (this.adjustedDirection === 'up' || this.adjustedDirection === 'down') {
				if (this.overflow.isOverLeft) {
					// anchor to the left of the screen
					pos.left = this.KEEPOUT;
				} else if (this.overflow.isOverRight) {
					// anchor to the right of the screen
					pos.left = window.innerWidth - containerNode.width - this.KEEPOUT;
				} else {
					// center horizontally
					pos.left = clientNode.left + (clientNode.width - containerNode.width) / 2;
				}
			} else if (this.adjustedDirection === 'left' || this.adjustedDirection === 'right') {
				if (this.overflow.isOverTop) {
					// anchor to the top of the screen
					pos.top = this.KEEPOUT;
				} else if (this.overflow.isOverBottom) {
					// anchor to the bottom of the screen
					pos.top = window.innerHeight - containerNode.height - this.KEEPOUT;
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
					position.top = clientNode.top - this.ARROW_WIDTH - this.MARGIN;
					break;
				case 'down':
					position.top = clientNode.bottom + this.MARGIN;
					break;
				case 'left':
					position.left = this.props.rtl ? clientNode.left + clientNode.width + this.MARGIN : clientNode.left - this.ARROW_WIDTH - this.MARGIN;
					break;
				case 'right':
					position.left = this.props.rtl ? clientNode.left - this.ARROW_WIDTH - this.MARGIN : clientNode.left + clientNode.width + this.MARGIN;
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
				isOverTop: client.top - containerHeight - this.ARROW_OFFSET - this.MARGIN - this.KEEPOUT < 0,
				isOverBottom: client.bottom + containerHeight + this.ARROW_OFFSET + this.MARGIN + this.KEEPOUT  > window.innerHeight,
				isOverLeft: client.left - containerWidth - this.ARROW_OFFSET - this.MARGIN - this.KEEPOUT < 0,
				isOverRight: client.right + containerWidth + this.ARROW_OFFSET + this.MARGIN + this.KEEPOUT > window.innerWidth
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

		/**
		 * Position the popup in relation to the activator.
		 *
		 * Position is based on the dimensions of the popup and its avitvator. If the popup does not
		 * fit in the specified direction, it will automatically flip to the opposite direction.
		 *
		 * @method
		 * @memberof moonstone/ContextualPopupDecorator.ContextualPopupDecorator.prototype
		 * @public
		 * @returns {undefined}
		 */
		positionContextualPopup = () => {
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
		}

		getClientNode = (node) => {
			this.clientNode = ReactDOM.findDOMNode(node); // eslint-disable-line react/no-find-dom-node
		}

		handle = handle.bind(this)

		handleKeyUp = this.handle(
			forProp('open', true),
			forKey('enter'),
			() => Spotlight.getCurrent() === this.state.activator,
			stop,
			forward('onClose')
		)

		handleOpen = (ev) => {
			forward('onOpen', ev, this.props);
			this.positionContextualPopup();
			const current = Spotlight.getCurrent();
			this.updateLeaveFor(current);
			this.setState({
				activator: current
			});
			this.spotPopupContent();
		}

		handleClose = () => {
			this.updateLeaveFor(null);
			this.setState({
				activator: null
			});
		}

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
			const {'data-webos-voice-exclusive': voiceExclusive, showCloseButton, popupComponent: PopupComponent, popupClassName, noAutoDismiss, open, onClose, popupProps, skin, spotlightRestrict, ...rest} = this.props;
			const scrimType = spotlightRestrict === 'self-only' ? 'transparent' : 'none';
			const popupPropsRef = Object.assign({}, popupProps);
			const ariaProps = extractAriaProps(popupPropsRef);

			if (!noSkin) {
				rest.skin = skin;
			}

			delete rest.onOpen;
			delete rest.popupSpotlightId;
			delete rest.rtl;
			delete rest.setApiProvider;

			if (openProp) rest[openProp] = open;

			return (
				<div className={css.contextualPopupDecorator}>
					<FloatingLayer
						noAutoDismiss={noAutoDismiss}
						onClose={this.handleClose}
						onDismiss={onClose}
						onOpen={this.handleOpen}
						open={open}
						scrimType={scrimType}
					>
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
							data-webos-voice-exclusive={voiceExclusive}
							showArrow={!noArrow}
							skin={skin}
							spotlightId={this.state.containerId}
							spotlightRestrict={spotlightRestrict}
						>
							<PopupComponent {...popupPropsRef} />
						</ContextualPopupContainer>
					</FloatingLayer>
					<Wrapped ref={this.getClientNode} {...rest} />
				</div>
			);
		}
	};
});

/**
 * Adds support for positioning a
 * [ContextualPopup]{@link moonstone/ContextualPopupDecorator.ContextualPopup} relative to the
 * wrapped component.
 *
 * `ContextualPopupDecorator` may be used to show additional settings or actions rendered within a
 * small floating popup.
 *
 * Usage:
 * ```
 * const ButtonWithPopup = ContextualPopupDecorator(Button);
 * <ButtonWithPopup
 *   direction="up"
 *   open={this.state.open}
 *   popupComponent={CustomPopupComponent}
 * >
 *   Open Popup
 * </ButtonWithPopup>
 * ```
 *
 * @hoc
 * @memberof moonstone/ContextualPopupDecorator
 * @public
 */
const ContextualPopupDecorator = compose(
	ApiDecorator({api: ['positionContextualPopup']}),
	I18nContextDecorator({rtlProp: 'rtl'}),
	Decorator
);

export default ContextualPopupDecorator;
export {
	ContextualPopupDecorator,
	ContextualPopup
};
