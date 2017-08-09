import {forward, forwardWithPrevent, forProp, handle, oneOf, preventDefault, returnsTrue} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {on, off} from '@enact/core/dispatcher';
import complement from 'ramda/src/complement';
import platform from '@enact/core/platform';
import PropTypes from 'prop-types';
import React from 'react';

import {activate, deactivate, pause, States} from './state';
import {block, unblock, isNotBlocked} from './block';
import Hold from './Hold';

const getEventCoordinates = (ev) => {
	let {clientX: x, clientY: y, type} = ev;
	if (type.indexOf('touch') === 0) {
		x = ev.targetTouches[0].clientX;
		y = ev.targetTouches[0].clientY;
	}

	return {x, y};
};

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
	activeProp: null,
	events: [
		{name: 'hold', time: 200}
	],
	frequency: 200,
	moveTolerance: 16
};

const Touchable = hoc(defaultConfig, (config, Wrapped) => {
	const {activeProp, events, frequency, moveTolerance} = config;

	return class extends React.Component {
		static displayName = 'Touchable'

		static propTypes = {
			cancelOnLeave: PropTypes.bool,
			disabled: PropTypes.bool,
			noResumeTouch: PropTypes.bool,
			onDown: PropTypes.func,
			onHold: PropTypes.func,
			onHoldPulse: PropTypes.func,
			onTap: PropTypes.func,
			onUp: PropTypes.func
		}

		static defaultProps = {
			cancelOnLeave: false,
			disabled: false,
			noResumeTouch: false
		}

		target = null
		handle = handle.bind(this)
		hold = new Hold()

		constructor () {
			super();

			this.state = {
				active: States.Inactive
			};
		}


		componentDidMount () {
			// ensure we clean up our internal state
			if (platform.touch) {
				on('touchend', this.handleGlobalUp, document);
			}
			on('mouseup', this.handleGlobalUp, document);
		}

		componentWillReceiveProps (nextProps) {
			if (!this.props.disabled && nextProps.disabled) {
				this.deactivate();
				this.hold.end();
			}
		}

		componentWillUnmount () {
			this.clearTarget();
			this.hold.suspend();

			if (platform.touch) {
				off('touchend', this.handleGlobalUp, document);
			}
			off('mouseup', this.handleGlobalUp, document);
		}

		setTarget = (target) => {
			this.target = target;

			if (platform.touch) {
				on('contextmenu', preventDefault, this.target);
				this.targetBounds = this.target.getBoundingClientRect();
			}
		}

		clearTarget = () => {
			if (platform.touch) {
				off('contextmenu', preventDefault, this.target);
				this.targetBounds = null;
			}

			this.target = null;
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

		pause = () => {
			if (activeProp) {
				this.setState(pause);
			}

			return true;
		}

		startHold = (ev, {cancelOnLeave, noResumeTouch, onHold, onHoldPulse}) => {
			if (onHold || onHoldPulse) {
				this.hold.begin({
					...getEventCoordinates(ev),
					cancelOnLeave,
					events,
					frequency,
					moveTolerance,
					onHold,
					onHoldPulse,
					resume: !noResumeTouch
				});
			}

			return true;
		}

		moveHold = (ev) => {
			const {x, y} = getEventCoordinates(ev);

			this.hold.move(x, y);

			return true;
		}

		enterHold = returnsTrue(this.hold.enter)

		leaveHold = returnsTrue(this.hold.leave)

		endHold = returnsTrue(this.hold.end)

		isTracking = () => {
			// verify we had a target and the up target is still within the current node
			return this.target;
		}

		isPaused = () => {
			return this.state.active === States.Paused;
		}

		hasTouchLeftTarget = (ev) => Array.from(ev.changedTouches).reduce((hasLeft, {pageX, pageY}) => {
			const {left, right, top, bottom} = this.targetBounds;
			return hasLeft && left > pageX || right < pageX || top > pageY || bottom < pageY;
		}, true);

		handleDown = this.handle(
			forProp('disabled', false),
			forwardDown,
			this.activate,
			this.startHold
			// drag support
		)

		handleUp = this.handle(
			forProp('disabled', false),
			this.endHold,
			this.isTracking,
			forwardUp,
			forwardTap
		).finally(this.deactivate)

		handleEnter = this.handle(
			forProp('disabled', false),
			forProp('noResumeTouch', false),
			this.isPaused,
			this.activate,
			this.enterHold
		)

		handleLeave = this.handle(
			forProp('disabled', false),
			forProp('cancelOnLeave', true),
			oneOf(
				[forProp('noResumeTouch', false), this.pause],
				[returnsTrue, this.deactivate]
			),
			this.leaveHold
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

		handleTouchEnter = this.handle(
			forProp('disabled', false),
			forProp('noResumeTouch', false),
			this.activate,
			this.enterHold
		)

		handleTouchMove = this.handle(
			forward('onTouchMove'),
			this.isTracking,
			this.moveHold,
			oneOf(
				[this.hasTouchLeftTarget, this.handleLeave],
				[forProp('cancelOnLeave', true), this.handleEnter]
			)
		)

		handleTouchEnd = this.handle(
			forward('onTouchEnd'),
			this.isTracking,
			complement(this.hasTouchLeftTarget),
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
			delete props.noResumeTouch;
			delete props.onDown;
			delete props.onHold;
			delete props.onHoldPulse;
			delete props.onTap;
			delete props.onUp;

			if (activeProp) {
				props[activeProp] = this.state.active === States.Active;
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
