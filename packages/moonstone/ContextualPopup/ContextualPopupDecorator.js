import React, {PropTypes} from 'react';
import {hoc} from '@enact/core';

import {ContextualPopup} from './ContextualPopup';

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

		measureContainer = (node) => {
			if (node) {
				this.containerNodeBound = node.getBoundingClientRect();

				let direction = this.props.direction;

				if (this.containerNodeBound.top - this.containerNodeBound.height < 0 && direction === 'up') {
					direction = 'down';
				} else if (this.containerNodeBound.bottom > window.innerHeight && direction === 'down') {
					direction = 'up';
				} else if (this.containerNodeBound.left < 0 && direction === 'left') {
					direction = 'right';
				} else if (this.containerNodeBound.right > window.innerWidth && direction === 'right') {
					direction = 'left';
				}

				this.setState({
					direction
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
