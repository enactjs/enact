import React, {PropTypes} from 'react';
import {hoc} from '@enact/core';
import ri from '@enact/ui/resolution';

import {ContextualPopup} from './ContextualPopup';

const defaultConfig = {};

const ContextualPopupDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const ARROW_WIDTH = ri.scale(30);
	const ARROW_OFFSET = ri.scale(18);
	const MARGIN = ri.scale(12);

	return class extends React.Component {
		displayName: 'ContextualPopupDecorator'

		constructor (props) {
			super(props);
			this.state = {
				open: false,
				arrowPosition: {top: 0, left: 0},
				containerPosition: {top: 0, left: 0}
			};
		}

		static propTypes = {
			/**
			 * [popupComponent description]
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
			 * When `true`, it shows close button.
			 *
			 * @type {Boolean}
			 * @public
			 * @default false
			 */
			showCloseButton : PropTypes.bool
		}

		static defaultProps = {
			direction: 'down',
			showCloseButton : false
		}

		handleClose = () => {
			this.setState({
				open: false
			});
		}

		handleClick = () => {
			this.setState({
				open: !this.state.open
			});
		}

		getContainerPosition (direction, containerNode, clientNode, overflow) {
			let position = {};

			switch (direction) {
				case 'up':
					position = {
						bottom: ARROW_OFFSET
					};
					break;
				case 'down':
					position = {
						top: clientNode.height + ARROW_OFFSET
					};
					break;
				case 'right':
					position = {
						left: clientNode.width + ARROW_OFFSET
					};
					break;
				case 'left':
					position = {
						right: ARROW_OFFSET
					};
					break;
				default:
					position = {};
			}

			this.centerContainerPosition(direction, containerNode, clientNode, position, overflow);
			return position;
		}

		centerContainerPosition (direction, containerNode, clientNode, position, overflow) {
			if (direction === 'up' || direction === 'down') {
				if (overflow.isOverLeft) {
					// adjust left
					position.left = -clientNode.left + MARGIN;
					// position.left = ARROW_OFFSET;
				} else if (overflow.isOverRight) {
					// adjust right
					position.right = -clientNode.right - MARGIN;
				} else {
					// center horizontally
					position.left = (clientNode.width - containerNode.width) / 2;
				}
			} else if (direction === 'left' || direction === 'right') {
				if (overflow.isOverTop) {
					// adjust top
					position.top = -clientNode.top + MARGIN;
				} else if (overflow.isOverDown) {
					// adjust bottom
					position.bottom = -clientNode.bottom - MARGIN;
				} else {
					// center vertically
					position.top = (clientNode.height - containerNode.height) / 2;
				}
			}

			return position;
		}

		getArrowPosition (direction, clientNode) {
			let position = {};

			switch (direction) {
				case 'up':
					position = {
						left: (clientNode.width - ARROW_WIDTH) / 2,
						bottom: 0
					};
					break;
				case 'down':
					position = {
						left: (clientNode.width - ARROW_WIDTH) / 2,
						top: clientNode.height
					};
					break;
				case 'left':
					position = {
						right: 0,
						top: (clientNode.height - ARROW_WIDTH) / 2
					};
					break;
				case 'right':
					position = {
						left: clientNode.width,
						top: (clientNode.height - ARROW_WIDTH) / 2
					};
					break;
				default:
					position = {};
			}
			return position;
		}

		isOverflow (container, client) {
			// TODO: what if it's rendered inside Portal??

			const {direction} = this.props;
			if (direction === 'up' || direction === 'down') {
				return {
					isOverTop: client.top - container.height < 0,
					isOverBottom: client.bottom + container.height > window.innerHeight,
					isOverLeft: client.left - (container.width - client.width) / 2 < 0,
					isOverRight: client.right + (container.width - client.width) / 2 > window.innerWidth
				};
			} else {
				return {
					isOverTop: client.top - (container.height - client.height) / 2 < 0,
					isOverBottom: client.bottom + (container.height - client.height) / 2 > window.innerHeight,
					isOverLeft: client.left - container.width - MARGIN < 0,
					isOverRight: client.right + container.width + MARGIN > window.innerWidth
				};
			}
		}

		adjustDirection (overflow, direction = this.props.direction) {
			if (overflow.isOverTop && direction === 'up') {
				return 'down';
			} else if (overflow.isOverBottom && direction === 'down') {
				return 'up';
			} else if (overflow.isOverLeft && direction === 'left') {
				return 'right';
			} else if (overflow.isOverRight && direction === 'right') {
				return 'left';
			}

			return direction;
		}

		measureContainer = (node) => {
			if (node) {
				const containerNode = node.getBoundingClientRect();
				const clientNode = this.clientNode.getBoundingClientRect();

				const overflow = this.isOverflow(containerNode, clientNode);
				const direction = this.adjustDirection(overflow);

				this.setState({
					direction,
					arrowPosition: this.getArrowPosition(direction, clientNode),
					containerPosition: this.getContainerPosition(direction, containerNode, clientNode, overflow)
				});
			}
		}

		getClientNode = (node) => {
			this.clientNode = node;
		}

		render () {
			const {showCloseButton, popupComponent: PopupComponent, ...props} = this.props;

			return (
				<div style={{display: 'inline-block'}}>
					{this.state.open ?
						<ContextualPopup
							showCloseButton={showCloseButton}
							onCloseButtonClicked={this.handleClose}
							direction={this.state.direction}
							arrowPosition={this.state.arrowPosition}
							containerPosition={this.state.containerPosition}
							containerRef={this.measureContainer}
						>
							<PopupComponent />
						</ContextualPopup> :
						null
					}
					<div ref={this.getClientNode}>
						<Wrapped {...props} onClick={this.handleClick} />
					</div>
				</div>
			);
		}
	};
});

export default ContextualPopupDecorator;
