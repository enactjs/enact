import {hoc} from '@enact/core';
import ri from '@enact/ui/resolution';
import {isRtlLocale} from '@enact/i18n/';
import React, {PropTypes} from 'react';

import {ContextualPopup} from './ContextualPopup';
import css from './ContextualPopupDecorator.less';

const defaultConfig = {};

const ContextualPopupDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const ARROW_WIDTH = ri.scale(30);
	const ARROW_OFFSET = ri.scale(18);
	const MARGIN = ri.scale(12);

	return class extends React.Component {
		static displayName = 'ContextualPopupDecorator'

		constructor (props) {
			super(props);
			this.state = {
				open: false,
				arrowPosition: {top: 0, left: 0},
				containerPosition: {top: 0, left: 0}
			};

			this.overflow = {};
			this.adjustedDirection = this.props.direction;
		}

		static propTypes = {
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

		getContainerPosition (containerNode, clientNode) {
			let position = {};

			switch (this.adjustedDirection) {
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

			return this.centerContainerPosition(containerNode, clientNode, position);
		}

		centerContainerPosition (containerNode, clientNode, position) {
			let pos = position;
			if (this.adjustedDirection === 'up' || this.adjustedDirection === 'down') {
				if (this.overflow.isOverLeft) {
					// anchor to the left of the screen
					pos.left = -clientNode.left + MARGIN;
				} else if (this.overflow.isOverRight) {
					// anchor to the right of the screen
					pos.right = -clientNode.right - MARGIN;
				} else {
					// center horizontally
					pos.left = (clientNode.width - containerNode.width) / 2;
				}
			} else if (this.adjustedDirection === 'left' || this.adjustedDirection === 'right') {
				if (this.overflow.isOverTop) {
					// anchor to the top of the screen
					pos.top = -clientNode.top + MARGIN;
				} else if (this.overflow.isOverDown) {
					// anchor to the bottom of the screen
					pos.bottom = -clientNode.bottom - MARGIN;
				} else {
					// center vertically
					pos.top = (clientNode.height - containerNode.height) / 2;
				}
			}

			return this.adjustRTL(pos);
		}

		getArrowPosition (clientNode) {
			let position = {};

			switch (this.adjustedDirection) {
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

			return this.adjustRTL(position);
		}

		calcOverflow (container, client) {
			// TODO: what if it's rendered inside Portal??

			const {direction} = this.props;
			if (direction === 'up' || direction === 'down') {
				this.overflow = {
					isOverTop: client.top - container.height - ARROW_OFFSET < 0,
					isOverBottom: client.bottom + container.height + ARROW_OFFSET > window.innerHeight,
					isOverLeft: client.left - (container.width - client.width) / 2 < 0,
					isOverRight: client.right + (container.width - client.width) / 2 > window.innerWidth
				};
			} else {
				this.overflow = {
					isOverTop: client.top - (container.height - client.height) / 2 < 0,
					isOverBottom: client.bottom + (container.height - client.height) / 2 > window.innerHeight,
					isOverLeft: client.left - container.width - MARGIN < 0,
					isOverRight: client.right + container.width + MARGIN > window.innerWidth
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
			if (isRtlLocale()) {
				const tmpLeft = pos.left;
				pos.left = pos.right;
				pos.right = tmpLeft;
			}
			return pos;
		}

		measureContainer = (node) => {
			if (node) {
				const containerNode = node.getBoundingClientRect();
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

		getClientNode = (node) => {
			this.clientNode = node;
		}

		render () {
			const {showCloseButton, popupComponent: PopupComponent, popupClassName, ...props} = this.props;

			return (
				<div className={css.contextualPopupDecorator}>
					{this.state.open ?
						<ContextualPopup
							className={popupClassName}
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
