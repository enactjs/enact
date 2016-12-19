/**
 * Exports the {@link moonstone/ContextualPopupDecorator.ContextualPopupDecorator} Higer-order
 * Component (HOC) and the {@link moonstone/ContextualPopupDecorator.ContextualPopup} component.
 * The default export is {@link moonstone/ContextualPopupDecorator.ContextualPopupDecorator}.
 *
 * @module moonstone/ContextualPopupDecorator
 */

import {hoc} from '@enact/core';
import ri from '@enact/ui/resolution';
import FloatingLayer from '@enact/ui/FloatingLayer';
import {contextTypes} from '@enact/i18n/I18nDecorator';
import React, {PropTypes} from 'react';

import {ContextualPopup} from './ContextualPopup';
import css from './ContextualPopupDecorator.less';

const defaultConfig = {};

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

	return class extends React.Component {
		static displayName = 'ContextualPopupDecorator'

		constructor (props) {
			super(props);
			this.state = {
				arrowPosition: {top: 0, left: 0},
				containerPosition: {top: 0, left: 0}
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
			 * A function to be run when ContextualPopup closes.
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
			showCloseButton : PropTypes.bool
		}

		static contextTypes = contextTypes

		static defaultProps = {
			direction: 'down',
			open: false,
			showCloseButton : false
		}

		componentWillReceiveProps (nextProps) {
			if (this.props.direction !== nextProps.direction) {
				this.adjustedDirection = nextProps.direction;
				this.setContainerPosition();
			}
		}

		getContainerPosition (containerNode, clientNode) {
			const position = {};
			switch (this.adjustedDirection) {
				case 'up':
					position.top = clientNode.top - this.ARROW_OFFSET - containerNode.height;
					break;
				case 'down':
					position.top = clientNode.bottom + this.ARROW_OFFSET;
					break;
				case 'right':
					position.left = /* this.context.rtl ? this.ARROW_OFFSET :*/ clientNode.right + this.ARROW_OFFSET;
					break;
				case 'left':
					position.left = /* this.context.rtl ? clientNode.width + this.ARROW_OFFSET : */clientNode.left - containerNode.width - this.ARROW_OFFSET;
					break;
			}

			return this.centerContainerPosition(containerNode, clientNode, position);
		}

		centerContainerPosition (containerNode, clientNode, position) {
			let pos = position;
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
				pos = this.adjustRTL(pos);
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
			switch (this.adjustedDirection) {
				case 'up':
					return this.adjustRTL({
						left: clientNode.left + (clientNode.width - this.ARROW_WIDTH) / 2,
						top: clientNode.top - this.ARROW_WIDTH
					});
				case 'down':
					return this.adjustRTL({
						left: clientNode.left + (clientNode.width - this.ARROW_WIDTH) / 2,
						top: clientNode.bottom
					});
				case 'left':
					return {
						left: this.context.rtl ? clientNode.left + clientNode.width : clientNode.left - this.ARROW_WIDTH,
						top: clientNode.top + (clientNode.height - this.ARROW_WIDTH) / 2
					};
				case 'right':
					return {
						left:  this.context.rtl ? clientNode.left : clientNode.left + clientNode.width,
						top: clientNode.top + (clientNode.height - this.ARROW_WIDTH) / 2
					};
				default:
					return {};
			}
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

		render () {
			const {showCloseButton, popupComponent: PopupComponent, popupClassName, open, onClose, ...rest} = this.props;

			return (
				<div className={css.contextualPopupDecorator}>
					<FloatingLayer open={open} scrimType="none" onDismiss={onClose}>
						<ContextualPopup
							className={popupClassName}
							showCloseButton={showCloseButton}
							onCloseButtonClick={onClose}
							direction={this.state.direction}
							arrowPosition={this.state.arrowPosition}
							containerPosition={this.state.containerPosition}
							containerRef={this.getContainerNode}
						>
							<PopupComponent />
						</ContextualPopup>
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
