import {forward, forwardWithPrevent, forProp, handle} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {on, off} from '@enact/core/dispatcher';
import platform from '@enact/core/platform';
import PropTypes from 'prop-types';
import React from 'react';

import {activate, deactivate} from './state';
import {block, unblock, isNotBlocked} from './block';

// Establish a standard payload for onDown/onUp/onTap events and pass it along to a handler
const makeTouchableEvent = (type, fn) => (ev, ...args) => {
	const {target, currentTarget} = ev;
	const payload = {type, target, currentTarget};

	return fn(payload, ...args);
};

// Cache handlers since they are consistent across instances
const forwardDown = makeTouchableEvent('down', forwardWithPrevent('onDown'));
const forwardUp = makeTouchableEvent('up', forwardWithPrevent('onUp'));
const forwardTap = makeTouchableEvent('tap', forward('onTap'));

const defaultConfig = {
	activeProp: null
};

const Touchable = hoc(defaultConfig, (config, Wrapped) => {
	const {activeProp} = config;

	return class extends React.Component {
		static displayName = 'Touchable'

		static propTypes = {
			cancelOnLeave: PropTypes.bool,
			disabled: PropTypes.bool,
			onDown: PropTypes.func,
			onTap: PropTypes.func,
			onUp: PropTypes.func
		}

		static defaultProps = {
			cancelOnLeave: false,
			disabled: false
		}

		target = null
		node = null
		handle = handle.bind(this);

		constructor () {
			super();

			this.state = {
				active: false
			};
		}

		componentDidMount () {
			// ensure we clean up our internal state
			if (platform.touch) {
				on('touchend', this.handleGlobalUp, document);
			}
			on('mouseup', this.handleGlobalUp, document);
		}

		componentWillUnmount () {
			this.clearTarget();

			if (platform.touch) {
				off('touchend', this.handleGlobalUp, document);
			}
			off('mouseup', this.handleGlobalUp, document);
		}

		setTarget = (target) => {
			this.target = target;

			if (platform.touch && this.props.cancelOnLeave) {
				this.targetBounds = this.target.getBoundingClientRect();
			}
		}

		clearTarget = () => {
			this.target = null;
			this.targetBounds = null;
		}

		activate = (ev) => {
			this.setTarget(ev.currentTarget);
			if (activeProp) {
				this.setState(activate);
			}

			return true;
		}

		deactivate = () => {
			this.clearTarget();
			if (activeProp) {
				this.setState(deactivate);
			}

			return true;
		}

		isTracking = () => {
			// verify we had a target and the up target is still within the current node
			return this.target;
		}

		hasTouchLeftTarget = (ev) => this.isTracking() && Array.from(ev.targetTouches).reduce((hasLeft, {pageX, pageY}) => {
			const {left, right, top, bottom} = this.targetBounds;
			return hasLeft && left > pageX || right < pageX || top > pageY || bottom < pageY;
		}, true);

		handleDown = this.handle(
			forProp('disabled', false),
			forwardDown,
			this.activate
			// hold support
			// drag support
		)

		handleUp = this.handle(
			forProp('disabled', false),
			this.isTracking,
			forwardUp,
			forwardTap
		).finally(this.deactivate)

		handleLeave = this.handle(
			forProp('disabled', false),
			forProp('cancelOnLeave', true),
			this.deactivate
		)

		handleMouseDown = this.handle(
			isNotBlocked,
			forward('onMouseDown'),
			this.handleDown
		).finally(unblock)

		handleMouseLeave = this.handle(
			forward('onMouseLeave'),
			this.handleLeave
		)

		handleMouseUp = this.handle(
			forward('onMouseUp'),
			this.handleUp
		)

		handleTouchStart = this.handle(
			forward('onTouchStart'),
			block,
			this.handleDown
		)

		handleTouchMove = this.handle(
			forward('onTouchMove'),
			this.hasTouchLeftTarget,
			this.handleLeave
		)

		handleTouchEnd = this.handle(
			forward('onTouchEnd'),
			this.handleUp
		)

		handleGlobalUp = this.deactivate

		addHandlers (props) {
			const {onDown, onTap, onUp} = this.props;

			if (activeProp || onDown || onTap || onUp) {
				props.onMouseDown = this.handleMouseDown;
				props.onMouseLeave = this.handleMouseLeave;
				props.onMouseUp = this.handleMouseUp;

				if (platform.touch) {
					props.onTouchStart = this.handleTouchStart;
					props.onTouchMove = this.handleTouchMove;
					props.onTouchEnd = this.handleTouchEnd;
				}
			}
		}

		render () {
			const props = Object.assign({}, this.props);

			this.addHandlers(props);

			delete props.cancelOnLeave;
			delete props.onDown;
			delete props.onUp;
			delete props.onTap;

			if (activeProp) {
				props[activeProp] = this.state.active;
			}

			return (
				<Wrapped {...props} />
			);
		}
	};
});

export default Touchable;
export {
	Touchable
};
