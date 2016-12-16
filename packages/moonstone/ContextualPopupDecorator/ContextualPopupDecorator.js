/**
 * Exports the {@link moonstone/ContextualPopupDecorator.ContextualPopupDecorator} and
 * {@link moonstone/ContextualPopupDecorator/ContextualPopup.ContextualPopup} components.
 * The default export is {@link moonstone/ContextualPopupDecorator.ContextualPopupDecorator}.
 *
 * @module moonstone/ContextualPopup
 */

import {forward} from '@enact/core/handle';
import {hoc} from '@enact/core';
import ri from '@enact/ui/resolution';
import {contextTypes} from '@enact/i18n/I18nDecorator';
import Spotlight, {SpotlightContainerDecorator, spotlightDirections} from '@enact/spotlight';
import React, {PropTypes} from 'react';

import {ContextualPopup} from './ContextualPopup';
import css from './ContextualPopupDecorator.less';

const defaultConfig = {};
const ContextualPopupContainer = SpotlightContainerDecorator({preserveId: true}, ContextualPopup);
const depress = 'onKeyDown';

/**
 * {@link moonstone/ContextualPopupDecorator.ContextualPopupDecorator} is a Higher-order Component
 * which positions {@link moonstone/ContextualPopupDecorator/ContextualPopup.ContextualPopup} in
 * relation to the Wrapped component.
 *
 * @class ContextualPopupDecorator
 * @memberof moonstone/ContextualPopupDecorator
 * @hoc
 * @public
 */
const ContextualPopupDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const forwardDepress = forward(depress);

	return class extends React.Component {
		static displayName = 'ContextualPopupDecorator'

		constructor (props) {
			super(props);
			this.state = {
				arrowPosition: {top: 0, left: 0},
				containerPosition: {top: 0, left: 0},
				containerId: Spotlight.add()
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
			 * A function to be run when close button is clicked.
			 *
			 * @type {Function}
			 * @public
			 */
			onCloseButtonClick: PropTypes.func,

			/**
			 * When `true`, the contextual popup will be visible.
			 *
			 * @type {Boolean}
			 * @public
			 * @default false
			 */
			open: PropTypes.bool,

			/**
			 * Classname pass to the popup. You may set width and heights of the popup with it.
			 *
			 * @type {String}
			 * @public
			 */
			popupClassName: PropTypes.string,

			/**
			 * When `true`, it shows close button.
			 *
			 * @type {Boolean}
			 * @public
			 * @default false
			 */
			showCloseButton : PropTypes.bool,

			/**
			 * Restricts or prioritizes navigation when focus attempts to leave the popup. It
			 * can be either 'none', 'self-first', or 'self-only'.
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

		componentWillReceiveProps (nextProps) {
			if (this.props.direction !== nextProps.direction) {
				this.adjustedDirection = nextProps.direction;
				this.setContainerPosition();
			}
		}

		componentDidUpdate (prevProps) {
			if (this.props.open && !prevProps.open) {
				this.spotPopupContent();
			} else if (!this.props.open && prevProps.open) {
				this.spotActivatorControl();
			}
		}

		componentWillUnmount () {
			Spotlight.remove(this.state.containerId);
		}

		getContainerPosition (containerNode, clientNode) {
			let position = {};
			switch (this.adjustedDirection) {
				case 'up':
					position = {
						bottom: this.ARROW_OFFSET
					};
					break;
				case 'down':
					position = {
						top: clientNode.height + this.ARROW_OFFSET
					};
					break;
				case 'right':
					position = {
						left: this.context.rtl ? this.ARROW_OFFSET : clientNode.width + this.ARROW_OFFSET
					};
					break;
				case 'left':
					position = {
						right: this.context.rtl ? clientNode.width + this.ARROW_OFFSET : this.ARROW_OFFSET
					};
					break;
				default:
					position = {};
			}

			return this.centerContainerPosition(containerNode, clientNode, position);
		}

		centerContainerPosition (containerNode, clientNode, position) {
			let pos = position;
			if (this.adjustedDirection === 'up' || this.adjustedDirection === 'down') {
				if (this.overflow.isOverLeft) {
					// anchor to the left of the screen
					pos.left = -clientNode.left + this.MARGIN;
				} else if (this.overflow.isOverRight) {
					// anchor to the right of the screen
					pos.right = -clientNode.right - this.MARGIN;
				} else {
					// center horizontally
					pos.left = (clientNode.width - containerNode.width) / 2;
				}
				pos = this.adjustRTL(pos);
			} else if (this.adjustedDirection === 'left' || this.adjustedDirection === 'right') {
				if (this.overflow.isOverTop) {
					// anchor to the top of the screen
					pos.top = -clientNode.top + this.MARGIN;
				} else if (this.overflow.isOverDown) {
					// anchor to the bottom of the screen
					pos.bottom = -clientNode.bottom - this.MARGIN;
				} else {
					// center vertically
					pos.top = (clientNode.height - containerNode.height) / 2;
				}
			}

			return pos;
		}

		getArrowPosition (clientNode) {
			switch (this.adjustedDirection) {
				case 'up':
					return this.adjustRTL({
						left: (clientNode.width - this.ARROW_WIDTH) / 2,
						bottom: 0
					});
				case 'down':
					return this.adjustRTL({
						left: (clientNode.width - this.ARROW_WIDTH) / 2,
						top: clientNode.height
					});
				case 'left':
					return {
						right: this.context.rtl ? clientNode.width : 0,
						top: (clientNode.height - this.ARROW_WIDTH) / 2
					};
				case 'right':
					return {
						left:  this.context.rtl ? 0 : clientNode.width,
						top: (clientNode.height - this.ARROW_WIDTH) / 2
					};
				default:
					return {};
			}
		}

		calcOverflow (container, client) {
			// TODO: what if it's rendered inside Portal??

			if (this.adjustedDirection === 'up' || this.adjustedDirection === 'down') {
				this.overflow = {
					isOverTop: client.top - container.height - this.ARROW_OFFSET < 0,
					isOverBottom: client.bottom + container.height + this.ARROW_OFFSET > window.innerHeight,
					isOverLeft: client.left - (container.width - client.width) / 2 < 0,
					isOverRight: client.right + (container.width - client.width) / 2 > window.innerWidth
				};
			} else {
				this.overflow = {
					isOverTop: client.top - (container.height - client.height) / 2 < 0,
					isOverBottom: client.bottom + (container.height - client.height) / 2 > window.innerHeight,
					isOverLeft: client.left - container.width - this.MARGIN < 0,
					isOverRight: client.right + container.width + this.MARGIN > window.innerWidth
				};
			}
		}

		adjustDirection () {
			if (this.overflow.isOverTop && this.adjustedDirection === 'up') {
				this.adjustedDirection = 'down';
			} else if (this.overflow.isOverBottom && this.adjustedDirection === 'down') {
				this.adjustedDirection = 'up';
			} else if (this.overflow.isOverLeft && this.adjustedDirection === 'left') {
				this.adjustedDirection = 'right';
			} else if (this.overflow.isOverRight && this.adjustedDirection === 'right') {
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
				const clientNode = this.clientNode.getBoundingClientRect();

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
			const {onCloseButtonClick} = this.props;
			const direction = spotlightDirections[ev.keyCode];

			if (direction) {
				// prevent default page scrolling
				ev.preventDefault();
				// stop propagation to prevent default spotlight behavior
				ev.stopPropagation();

				// if focus has changed
				if (Spotlight.move(direction)) {

					// if current focus is not within the popup's container, issue the `onCloseButtonClick` event
					if (!this.containerNode.contains(document.activeElement) && onCloseButtonClick) {
						onCloseButtonClick(ev);
					}
				}
			}

			forwardDepress(ev, this.props);
		}

		spotPopupContent = () => {
			Spotlight.focus(this.state.containerId);
		}

		spotActivatorControl = () => {
			Spotlight.focus();
		}

		render () {
			const {showCloseButton, popupComponent: PopupComponent, popupClassName, open, onCloseButtonClick, spotlightRestrict, ...props} = this.props;

			return (
				<div className={css.contextualPopupDecorator}>
					{open ?
						<ContextualPopupContainer
							className={popupClassName}
							showCloseButton={showCloseButton}
							onCloseButtonClick={onCloseButtonClick}
							direction={this.state.direction}
							arrowPosition={this.state.arrowPosition}
							containerPosition={this.state.containerPosition}
							containerRef={this.getContainerNode}
							containerId={this.state.containerId}
							spotlightRestrict={spotlightRestrict}
							onKeyDown={this.handleKeyDown}
						>
							<PopupComponent />
						</ContextualPopupContainer> :
						null
					}
					<div ref={this.getClientNode}>
						<Wrapped {...props} />
					</div>
				</div>
			);
		}
	};
});

export default ContextualPopupDecorator;
export {ContextualPopupDecorator, ContextualPopup};
