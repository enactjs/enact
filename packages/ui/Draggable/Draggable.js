import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {on, off} from '@enact/core/dispatcher';
import React from 'react';
import ReactDOM from 'react-dom';

import {updatePosition, setContainerBounds, setPositionFromValue, startTrack, stopTrack} from './state';

const toNativeEventName = (eventName) => {
	return eventName && eventName.replace(/^on([A-Z])/, (match, c) => c.toLowerCase());
};

const defaultConfig = {
	global: true,
	prop: 'data-trackable',
	track: 'onMouseMove',
	trackEnd: 'onMouseUp',
	trackStart: 'onMouseDown'
};

// Unique ID for each instance used for node lookup
let id = 0;

const Draggable = hoc(defaultConfig, (config, Wrapped) => {
	const {global, prop, trackStart} = config;
	let {track, trackEnd} = config;

	if (global) {
		track = toNativeEventName(track);
		trackEnd = toNativeEventName(trackEnd);
	}

	return class extends React.Component {
		static displayName = 'Draggable';

		static propTypes = {
			constrain: React.PropTypes.oneOf(['body', 'container', 'window']),
			constrainBoxSizing: React.PropTypes.oneOf(['border-box', 'content-box']),
			disabled: React.PropTypes.bool,
			horizontal: React.PropTypes.bool,
			onTrack: React.PropTypes.func,
			onTrackEnd: React.PropTypes.func,
			onTrackStart: React.PropTypes.func,
			value: React.PropTypes.number,
			vertical: React.PropTypes.bool
		}

		static defaultProps = {
			constrainBoxSizing: 'border-box'
		}

		constructor () {
			super();

			this.id = String(++id);

			this.state = {
				tracking: false,
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

			this.node = this.getNode();
			const constrainingNode = this.getConstrainingNode(constrain);
			this.updateConstraints(constrainingNode);
			this.setPositionFromValue(value);
		}

		componentWillReceiveProps (nextProps) {
			const {constrain, value} = this.props;
			const {constrain: nextConstrain, value: nextValue} = nextProps;

			if (constrain !== nextConstrain) {
				const node = this.getConstrainingNode(nextConstrain);
				this.updateConstraints(node);
			}

			if (value !== nextValue) {
				this.setPositionFromValue(nextValue);
			}
		}

		getNode () {
			// findDOMNode() is currently preferrable to requiring an additional prop to pass a ref
			// callback for HOCs
			// eslint-disable-next-line react/no-find-dom-node
			const node = ReactDOM.findDOMNode(this);
			if (!prop || node.getAttribute(prop) === this.id) {
				return node;
			}

			return node.querySelector(`[${prop}="${this.id}"]`);
		}

		getConstrainingNode (constrain) {
			if (this.node) {
				switch (constrain) {
					case 'body':		return this.node.ownerDocument.body;
					case 'container':	return this.node.offsetParent;
					case 'self':		return this.node;
					case 'window':		return window;
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

		startListening () {
			if (global) {
				on('mousemove', this.handleTrack);
				on('mouseup', this.handleTrackEnd);
			}
		}

		stopListening () {
			if (global) {
				off('mousemove', this.handleTrack);
				off('mouseup', this.handleTrackEnd);
			}
		}

		startTrack (x, y) {
			forward('onTrackStart', {}, this.props);

			this.setState(startTrack(x, y));
			this.startListening();
		}

		track (x, y) {
			const {horizontal, vertical} = this.props;
			const updateTrackState = updatePosition(x, y);
			const position = updateTrackState(this.state);
			const trackEvent = this.calcPercentage(position);

			const horizontalChanged = horizontal && trackEvent.x !== this.state.x;
			const verticalChanged = vertical && trackEvent.y !== this.state.y;
			if (horizontalChanged || verticalChanged) {
				forward('onTrack', trackEvent, this.props);
				this.setState(updateTrackState);
			}
		}

		stopTrack () {
			forward('onTrackEnd', {}, this.props);

			this.stopListening();
			this.setState(stopTrack);
		}

		handleTrackStart = () => {
			if (!this.props.disabled) {
				this.startTrack();
			}
		}

		handleTrack = (ev) => {
			const {clientX, clientY} = ev;
			if (this.state.tracking) {
				this.track(clientX, clientY);
			}
		}

		handleTrackEnd = () => {
			this.stopTrack();
		}

		render () {
			const props = Object.assign({}, this.props);
			const position = this.calcPercentage(this.state);

			delete props.constrain;
			delete props.constrainBoxSizing;
			delete props.horizontal;
			delete props.value;
			delete props.vertical;

			if (trackStart) {
				props[trackStart] = this.handleTrackStart;
			}

			if (!global) {
				if (track) {
					props[track] = this.handleTrack;
				}

				if (trackEnd) {
					props[trackEnd] = this.handleTrackEnd;
				}
			}

			if (prop) {
				props[prop] = this.id;
			}

			return (
				<Wrapped
					{...props}
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
