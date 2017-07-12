/**
 * Exports the {@link moonstone/ContextualPopupDecorator.ContextualPopupDecorator} Higher-order
 * Component (HOC) and the {@link moonstone/ContextualPopupDecorator.ContextualPopup} component.
 * The default export is {@link moonstone/ContextualPopupDecorator.ContextualPopupDecorator}.
 *
 * @module moonstone/ContextualPopupDecorator
 */

import {contextTypes} from '@enact/i18n/I18nDecorator';
import {extractAriaProps} from '@enact/core/util';
import FloatingLayer from '@enact/ui/FloatingLayer';
import hoc from '@enact/core/hoc';
import {on, off} from '@enact/core/dispatcher';
import React from 'react';
import PropTypes from 'prop-types';
import ri from '@enact/ui/resolution';
import Spotlight, {getDirection} from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';

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
	 * If the wrapped component does not support skinning, set `noSkin` to `true` to disable passing
	 * the `skin` prop to it.
	 *
	 * @type {Boolean}
	 * @default false
	 * @memberof moonstone/ContextualPopupDecorator.ContextualPopupDecorator.defaultConfig
	 * @public
	 */
	noSkin: false
};

const ContextualPopupContainer = SpotlightContainerDecorator({enterTo: 'last-focused', preserveId: true}, ContextualPopup);

/**
 * {@link moonstone/ContextualPopupDecorator.ContextualPopupDecorator} is a Higher-order Component
 * which positions {@link moonstone/ContextualPopupDecorator.ContextualPopup} in
 * relation to the Wrapped component.
 *
 * Example:
 * ```
 * import PopupComponent from './PopupComponent';
 *
 * const ContextualPopupComponent = ContextualPopupDecorator(Button);
 *
 * const MyComponent = kind({
 * 	name: 'MyComponent',
 *
 * 	render: (props) => {
 * 		const popupProps = {
 * 			functionProp: () => {},
 * 			stringProp: '',
 * 			booleanProp: false
 * 		};
 *
 * 		return (
 * 			<div {...props}>
 * 				<ContextualPopupComponent
 * 					popupComponent={PopupComponent}
 * 					popupProps={popupProps}
 * 				>
 * 					Open Popup
 * 				</ContextualPopupComponent>
 * 			</div>
 * 		);
 * 	}
 * });
 * ```
 *
 * @class ContextualPopupDecorator
 * @memberof moonstone/ContextualPopupDecorator
 * @hoc
 * @public
 */
const ContextualPopupDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {noSkin} = config;

	return class extends React.Component {
		static displayName = 'ContextualPopupDecorator'

		constructor (props) {
			super(props);
			this.state = {
				arrowPosition: {top: 0, left: 0},
				containerPosition: {top: 0, left: 0},
				containerId: Spotlight.add(),
				activator: null
			};

			this.overflow = {};
			this.adjustedDirection = this.props.direction;

			this.ARROW_WIDTH = ri.scale(30);
			this.ARROW_OFFSET = ri.scale(18);
			this.MARGIN = ri.scale(12);
		}

		static propTypes = /** @lends moonstone/ContextualPopupDecorator.ContextualPopupDecorator.prototype */ {
			/**
			 * The component to use to render popup.
			 *
			 * @type {Function}
			 * @public
			 */
			popupComponent: PropTypes.func.isRequired,

			/**
			 * Direction of ContextualPopup
			 *
			 * @type {String}
			 * @public
			 * @default 'down'
			 */
			direction: PropTypes.oneOf(['up', 'down', 'left', 'right']),

			/**
			 * When `true`, the popup will not close when the user presses `ESC` key or click outside.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			noAutoDismiss: PropTypes.bool,

			/**
			 * A function to be run when either the close button is clicked or spotlight focus
			 * moves outside the boundary of the popup. Setting `spotlightRestrict` to `'self-only'`
			 * will prevent Spotlight focus from leaving the popup.
			 *
			 * @type {Function}
			 * @public
			 */
			onClose: PropTypes.func,

			/**
			 * When `true`, the contextual popup will be visible.
			 *
			 * @type {Boolean}
			 * @public
			 * @default false
			 */
			open: PropTypes.bool,

			/**
			 * Classname to pass to the popup. You may set width and height of the popup with it.
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
			 * When `true`, it shows close button.
			 *
			 * @type {Boolean}
			 * @public
			 * @default false
			 */
			showCloseButton : PropTypes.bool,

			/**
			 * Overrides the current skin for this component. When `noSkin` is set on the config
			 * object, `skin` will only be applied to the
			 * `moonstone/ContextualPopupDecorator.ContextualPopup` and not to the popup's activator
			 * component.
			 *
			 * @type {String}
			 * @public
			 */
			skin: PropTypes.string,

			/**
			 * Restricts or prioritizes navigation when focus attempts to leave the popup. It
			 * can be either `'none'`, `'self-first'`, or `'self-only'`.
			 *
			 * @type {String}
			 * @default 'self-first'
			 * @public
			 */
			spotlightRestrict: PropTypes.oneOf(['none', 'self-first', 'self-only'])
		}

		static contextTypes = contextTypes

		static defaultProps = {
			direction: 'down',
			open: false,
			showCloseButton: false,
			spotlightRestrict: 'self-first'
		}

		componentDidMount () {
			if (this.props.open) {
				on('keydown', this.handleKeyDown);
			}
		}

		componentWillReceiveProps (nextProps) {
			if (this.props.direction !== nextProps.direction) {
				this.adjustedDirection = nextProps.direction;
				this.setContainerPosition();
			}

			if (!this.props.open && nextProps.open) {
				const activator = Spotlight.getCurrent();
				this.updateLeaveFor(activator);
				this.setState({
					activator
				});
			} else if (this.props.open && !nextProps.open) {
				this.updateLeaveFor(null);
				this.setState({
					activator: null
				});
			}
		}

		componentDidUpdate (prevProps, prevState) {
			if (this.props.open && !prevProps.open) {
				on('keydown', this.handleKeyDown);
				this.spotPopupContent();
			} else if (!this.props.open && prevProps.open) {
				off('keydown', this.handleKeyDown);
				this.spotActivator(prevState.activator);
			}
		}

		componentWillUnmount () {
			if (this.props.open) {
				off('keydown', this.handleKeyDown);
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
					position.left = this.context.rtl ? clientNode.left - containerNode.width - this.ARROW_OFFSET : clientNode.right + this.ARROW_OFFSET;
					break;
				case 'left':
					position.left = this.context.rtl ? clientNode.right + this.ARROW_OFFSET : clientNode.left - containerNode.width - this.ARROW_OFFSET;
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
					position.left = this.context.rtl ? clientNode.left + clientNode.width : clientNode.left - this.ARROW_WIDTH;
					break;
				case 'right':
					position.left = this.context.rtl ? clientNode.left - this.ARROW_WIDTH : clientNode.left + clientNode.width;
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
			} else if (this.overflow.isOverLeft && !this.overflow.isOverRight && this.adjustedDirection === 'left' && !this.context.rtl) {
				this.adjustedDirection = 'right';
			} else if (this.overflow.isOverRight && !this.overflow.isOverLeft && this.adjustedDirection === 'right' && !this.context.rtl) {
				this.adjustedDirection = 'left';
			}
		}

		adjustRTL (position) {
			let pos = position;
			if (this.context.rtl) {
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
				clientNode.left = this.context.rtl ? window.innerWidth - right : left;
				clientNode.right = this.context.rtl ? window.innerWidth - left : right;

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

		handleKeyDown = (ev) => {
			const {onClose, spotlightRestrict} = this.props;
			const direction = getDirection(ev.keyCode);
			const spottables = Spotlight.getSpottableDescendants(this.state.containerId).length;
			const spotlessSpotlightModal = spotlightRestrict === 'self-only' && !spottables;

			if (direction && (this.containerNode.contains(document.activeElement) || spotlessSpotlightModal)) {
				// prevent default page scrolling
				ev.preventDefault();
				// stop propagation to prevent default spotlight behavior
				ev.stopPropagation();
				// set the pointer mode to false on keydown
				Spotlight.setPointerMode(false);

				// we guard against attempting a focus change by verifying the case where a spotlightModal
				// popup contains no spottable components
				if (!spotlessSpotlightModal && Spotlight.move(direction)) {

					// if current focus is not within the popup's container, issue the `onClose` event
					if (!this.containerNode.contains(document.activeElement) && onClose) {
						onClose(ev);
					}
				}
			}
		}

		spotActivator = (activator) => {
			if (Spotlight.getCurrent() !== activator && !Spotlight.focus(activator)) {
				Spotlight.focus();
			}
		}

		spotPopupContent = () => {
			const {containerId} = this.state;
			if (!Spotlight.focus(containerId)) {
				Spotlight.setActiveContainer(containerId);
			}
		}

		render () {
			const {showCloseButton, popupComponent: PopupComponent, popupClassName, noAutoDismiss, open, onClose, popupProps, skin, spotlightRestrict, ...rest} = this.props;
			const scrimType = spotlightRestrict === 'self-only' ? 'transparent' : 'none';
			const popupPropsRef = Object.assign({}, popupProps);
			const ariaProps = extractAriaProps(popupPropsRef);

			if (!noSkin) {
				rest.skin = skin;
			}

			return (
				<div className={css.contextualPopupDecorator}>
					<FloatingLayer open={open} scrimType={scrimType} noAutoDismiss={noAutoDismiss} onDismiss={onClose}>
						<ContextualPopupContainer
							{...ariaProps}
							className={popupClassName}
							showCloseButton={showCloseButton}
							onCloseButtonClick={onClose}
							direction={this.state.direction}
							arrowPosition={this.state.arrowPosition}
							containerPosition={this.state.containerPosition}
							containerRef={this.getContainerNode}
							containerId={this.state.containerId}
							skin={skin}
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
});

export default ContextualPopupDecorator;
export {ContextualPopupDecorator, ContextualPopup};
