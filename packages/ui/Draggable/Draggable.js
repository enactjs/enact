import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {on, off} from '@enact/core/dispatcher';
import React from 'react';
import ReactDOM from 'react-dom';

import {drag, setContainerBounds, setPositionFromValue, startDrag, stopDrag} from './state';

const Draggable = hoc(null, (config, Wrapped) => {
	return class extends React.Component {
		static displayName = 'Draggable';

		static propTypes = {
			constrain: React.PropTypes.oneOf(['body', 'container', 'window']),
			constrainBoxSizing: React.PropTypes.oneOf(['border-box', 'content-box']),
			disabled: React.PropTypes.bool,
			horizontal: React.PropTypes.bool,
			onDrag: React.PropTypes.func,
			onDragEnd: React.PropTypes.func,
			onDragStart: React.PropTypes.func,
			preview: React.PropTypes.bool,
			value: React.PropTypes.number,
			vertical: React.PropTypes.bool
		}

		static defaultProps = {
			constrainBoxSizing: 'border-box'
		}

		constructor () {
			super();

			this.state = {
				dragging: false,
				maxX: Infinity,
				maxY: Infinity,
				minX: 0,
				minY: 0,
				x: 0,
				y: 0
			};
		}

		componentDidMount () {
			const {constrain, value} = this.props;

			// findDOMNode() is currently preferrable to requiring an additional prop to pass a ref
			// callback for HOCs
			// eslint-disable-next-line react/no-find-dom-node
			this.node = ReactDOM.findDOMNode(this);

			const constrainingNode = this.getConstrainingNode(constrain);
			this.initConstraints(constrainingNode);
			this.setPositionFromValue(value);
		}

		componentWillReceiveProps (nextProps) {
			const {constrain, preview, value} = this.props;
			const {constrain: nextConstrain, preview: nextPreview, value: nextValue} = nextProps;

			if (constrain !== nextConstrain) {
				let node = this.getConstrainingNode(constrain);
				this.cleanupConstraints(node);

				node = this.getConstrainingNode(nextConstrain);
				this.initConstrains(node);
			}

			if (value !== nextValue) {
				this.setPositionFromValue(nextValue);
			}

			if (preview || nextPreview) {
				const node = this.getConstrainingNode(constrain);
				if (!preview && nextPreview) {
					this.startListening(node);
				} else if (preview && !nextPreview) {
					// this.
					this.stopListening(node);
				}
			}
		}

		componentWillUnmount () {
			const constrainingNode = this.getConstrainingNode(this.props.constrain);
			this.cleanupConstraints(constrainingNode);
		}

		initConstraints (node) {
			this.updateConstraints(node);
			on('mousedown', this.handleConstrainingNodeMouseDown, node);
		}

		cleanupConstraints (node) {
			off('mousedown', this.handleConstrainingNodeMouseDown, node);
		}

		getConstrainingNode (constrain) {
			if (this.node) {
				if (constrain === 'window') {
					return window;
				} else if (constrain === 'container') {
					return this.node.offsetParent;
				} else if (constrain === 'body') {
					return this.node.ownerDocument.body;
				}
			}
		}

		updateConstraints (node) {
			const {constrain, constrainBoxSizing} = this.props;
			let containerBounds = null;

			if (!constrain || !this.node) return;

			if (constrain === 'window') {
				containerBounds = {
					left: 0,
					top: 0,
					right: node.innerWidth,
					bottom: node.innerHeight
				};
			} else {
				containerBounds = node.getBoundingClientRect();

				// adjust for padding when using content-box
				if (constrainBoxSizing === 'content-box') {
					const computedStyle = window.getComputedStyle(node);
					containerBounds = {
						top: containerBounds.top + parseInt(computedStyle.paddingTop),
						bottom: containerBounds.bottom - parseInt(computedStyle.paddingBottom),
						left: containerBounds.left + parseInt(computedStyle.paddingLeft),
						right: containerBounds.right - parseInt(computedStyle.paddingRight)
					};
				}
			}

			if (containerBounds) {
				const nodeBounds = this.node.getBoundingClientRect();
				this.setState(setContainerBounds(nodeBounds, containerBounds));
			}
		}

		setPositionFromValue (value) {
			if (value != null) {
				this.setState(setPositionFromValue(value));
			}
		}

		calcPercentage ({x, y}) {
			const {maxX, maxY, minX, minY} = this.state;
			let percentX = x / (maxX - minX);
			let percentY = y / (maxY - minY);

			return {x, y, percentX, percentY};
		}

		getX ({x}) {
			return this.props.horizontal ? x : 0;
		}

		getPercentX ({percentX}) {
			return this.props.horizontal ? percentX : 0;
		}

		getY ({y}) {
			return this.props.vertical ? y : 0;
		}

		getPercentY ({percentY}) {
			return this.props.vertical ? percentY : 0;
		}

		startListening (target) {
			on('mousemove', this.handleMouseMove, target);
			on('mouseup', this.handleMouseUp, target);
		}

		stopListening (target) {
			off('mousemove', this.handleMouseMove, target);
			off('mouseup', this.handleMouseUp, target);
		}

		startDrag (x, y) {
			forward('onDragStart', {}, this.props);

			this.setState(startDrag(x, y));
			if (!this.props.preview) {
				this.startListening();
			}
		}

		drag (x, y) {
			const {horizontal, vertical} = this.props;
			const updateDragState = drag(x, y);
			const position = updateDragState(this.state);
			const dragEvent = this.calcPercentage(position);

			const horizontalChanged = horizontal && dragEvent.x !== this.state.x;
			const verticalChanged = vertical && dragEvent.y !== this.state.y;
			if (horizontalChanged || verticalChanged) {
				if (this.props.preview) {
					forward('onPreview', dragEvent, this.props);
				} else {
					forward('onDrag', dragEvent, this.props);
				}
				this.setState(updateDragState);
			}
		}

		stopDrag () {
			forward('onDragEnd', {}, this.props);

			this.stopListening();
			this.setState(stopDrag);
		}

		handleConstrainingNodeMouseDown = (ev) => {
			const {clientX, clientY} = ev;
			if (!this.props.disabled) {
				this.startDrag();
				this.drag(clientX, clientY);
			}
		}

		handleMouseDown = () => {
			if (!this.props.disabled) {
				this.startDrag();
			}
		}

		handleMouseEnter = () => {
			if (this.props.preview) {
				this.startListening();
			}
		}

		handleMouseLeave = () => {
			if (this.props.preview) {
				this.stopListening();
			}
		}

		handleMouseMove = (ev) => {
			const {clientX, clientY} = ev;
			if (this.state.dragging || this.props.preview) {
				this.drag(clientX, clientY);
			}
		}

		handleMouseUp = () => {
			this.stopDrag();
		}

		render () {
			const props = Object.assign({}, this.props);
			const position = this.calcPercentage(this.state);

			delete props.constrain;
			delete props.constrainBoxSizing;
			delete props.horizontal;
			delete props.preview;
			delete props.value;
			delete props.vertical;

			return (
				<Wrapped
					{...props}
					onMouseEnter={this.handleMouseEnter}
					onMouseDown={this.handleMouseDown}
					onMouseLeave={this.handleMouseLeave}
					percentX={this.getPercentX(position)}
					percentY={this.getPercentY(position)}
					x={this.getX(position)}
					y={this.getY(position)}
				/>
			);
		}
	};
});

export default Draggable;
export {
	Draggable
};
