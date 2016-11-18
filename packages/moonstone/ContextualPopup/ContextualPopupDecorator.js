import React, {PropTypes} from 'react';
import {hoc} from '@enact/core';

import {ContextualPopup} from './ContextualPopup';

const ARROW_OFFSET = 18;

const defaultConfig = {};

const ContextualPopupDecorator = hoc(defaultConfig, (config, Wrapped) => {
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
			popupComponent: PropTypes.func.isRequired,
			direction: PropTypes.oneOf(['up', 'down', 'left', 'right']),
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

		getContainerPosition (overflow, direction, clientNode) {
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
			return position;
		}

		getArrowPosition (direction, clientNode) {
			let position = {};

			switch (direction) {
				case 'up':
					position = {
						left: clientNode.width / 2 - 15,
						bottom: 0
					};
					break;
				case 'down':
					position = {
						left: clientNode.width / 2 - 15,
						top: clientNode.height
					};
					break;
				case 'left':
					position = {
						right: 0,
						top: clientNode.height / 2 - 15
					};
					break;
				case 'right':
					position = {
						left: clientNode.width,
						top: clientNode.height / 2 - 15
					};
					break;
				default:
					position = {};
			}
			return position;
		}

		isOverflow (container, client) {
			// TODO: what if it's rendered inside Portal??
			return {
				isOverTop: client.top - container.height < 0,
				isOverBottom: client.bottom + container.height > window.innerHeight,
				isOverLeft: client.left - container.width < 0,
				isOverRight: client.right + container.width > window.innerWidth
			};
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
					containerPosition: this.getContainerPosition(overflow, direction, clientNode)
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
