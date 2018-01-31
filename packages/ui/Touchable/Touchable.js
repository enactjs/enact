/**
 * Provides the [Touchable]{@link ui/Touchable.Touchable} Higher-order Component (HOC) to add
 * gesture support to components and the [configure()]{@link ui/Touchable.configure} method for
 * configuring gestures for the application.
 *
 * @module ui/Touchable
 */

import {forward, forwardWithPrevent, forProp, handle, oneOf, preventDefault, returnsTrue} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {Job} from '@enact/core/util';
import {on, off} from '@enact/core/dispatcher';
import complement from 'ramda/src/complement';
import platform from '@enact/core/platform';
import PropTypes from 'prop-types';
import React from 'react';

import {configure, getConfig} from './config';
import {activate, deactivate, pause, States} from './state';
import {block, unblock, isNotBlocked} from './block';

import {Hold, holdConfigPropType} from './Hold';
import Flick from './Flick';

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
	let {clientX, clientY, pageX, pageY} = ev;

	if (ev.changedTouches) {
		clientX = ev.changedTouches[0].clientX;
		clientY = ev.changedTouches[0].clientY;
		pageX = ev.changedTouches[0].pageX;
		pageY = ev.changedTouches[0].pageY;
	}

	const payload = {
		type,
		target,
		currentTarget,
		clientX,
		clientY,
		pageX,
		pageY
	};

	return fn(payload, ...args);
};

// Cache handlers since they are consistent across instances
const forwardDown = makeTouchableEvent('down', forwardWithPrevent('onDown'));
const forwardUp = makeTouchableEvent('up', forwardWithPrevent('onUp'));
const forwardTap = makeTouchableEvent('tap', forward('onTap'));
const forwardMove = makeTouchableEvent('move', forward('onMove'));

/**
 * Default config for {@link ui/Touchable.Touchable}.
 *
 * @memberof ui/Touchable.Touchable
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Configures the prop name to pass the active state to the wrapped component
	 *
	 * @type {String}
	 * @default null
	 * @memberof ui/Touchable.Touchable.defaultConfig
	 */
	activeProp: null
};

/**
 * {@link ui/Touchable.Touchable} is a Higher-order Component that provides a consistent set of
 * pointer events -- `onDown`, `onUp`, and `onTap` -- across mouse and touch interfaces along with
 * support for common gestures including `onFlick`, `onHold`, and `onHoldPulse`.
 *
 * @class Touchable
 * @memberof ui/Touchable
 * @hoc
 * @public
 */
const Touchable = hoc(defaultConfig, (config, Wrapped) => {
	const {
		activeProp
	} = config;

	return class extends React.Component {
		static displayName = 'Touchable'

		static propTypes = /** @lends ui/Touchable.Touchable.prototype */ {
			/**
			 * Controls whether the component is disabled.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			disabled: PropTypes.bool,

			/**
			 * Instance-specific overrides of the component `holdConfig`
			 *
			 * @type {Object}
			 * @public
			 */
			holdConfig: holdConfigPropType,

			/**
			 * When `true`, prevents resuming the touch events and gestures when re-entering the
			 * component.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			noResume: PropTypes.bool,

			/**
			 * Event handler for "down" pointer events
			 *
			 * @type {Function}
			 * @public
			 */
			onDown: PropTypes.func,

			/**
			 * Event handler for hold events
			 *
			 * @type {Function}
			 * @public
			 */
			onHold: PropTypes.func,

			/**
			 * Event handler for hold pulse events
			 *
			 * @type {Function}
			 * @public
			 */
			onHoldPulse: PropTypes.func,

			/**
			 * Event handler for "tap" pointer events
			 *
			 * @type {Function}
			 * @public
			 */
			onTap: PropTypes.func,

			/**
			 * Event handler for "up" pointer events
			 *
			 * @type {Function}
			 * @public
			 */
			onUp: PropTypes.func
		}

		static defaultProps = {
			disabled: false,
			noResume: false
		}

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
			this.hold.end();
			this.blurJob.stop();

			if (platform.touch) {
				off('touchend', this.handleGlobalUp, document);
			}
			off('mouseup', this.handleGlobalUp, document);
		}

		target = null
		handle = handle.bind(this)
		flick = new Flick()
		hold = new Hold()

		// State Management

		setTarget = (target) => {
			this.target = target;

			if (platform.touch) {
				on('contextmenu', preventDefault);
				this.targetBounds = this.target.getBoundingClientRect();
			}
		}

		clearTarget = () => {
			if (platform.touch) {
				off('contextmenu', preventDefault);
				this.targetBounds = null;
			}

			this.target = null;
		}

		blurJob = new Job(target => {
			if (target.blur) {
				target.blur();
			}
		}, 400);

		activate = (ev) => {
			this.setTarget(ev.currentTarget);
			if (activeProp) {
				this.setState(activate);
			}

			if (ev && 'changedTouches' in ev) {
				this.target.focus();
			}

			return true;
		}

		deactivate = (ev) => {
			if (ev && 'changedTouches' in ev) {
				this.blurJob.start(this.target);
			}

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

		// Gesture Support

		startGesture = (ev, props) => {
			const coords = getEventCoordinates(ev);

			const {hold, flick} = getConfig();

			this.hold.begin(hold, props, coords);
			this.flick.begin(flick, props, coords);

			return true;
		}

		moveGesture = (ev) => {
			const coords = getEventCoordinates(ev);

			this.hold.move(coords);
			this.flick.move(coords);

			return true;
		}

		enterGesture = () => {
			this.hold.enter();
			// this.flick.enter();

			return true;
		}

		leaveGesture = () => {
			this.hold.leave();
			// this.flick.leave();

			return true;
		}

		endGesture = () => {
			this.hold.end();
			this.flick.end();

			return true;
		}

		// Event handler utilities

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

		// Normalized handlers - Mouse and Touch events are mapped to these to trigger cross-type
		// events and initiate gestures

		handleDown = this.handle(
			forProp('disabled', false),
			forwardDown,
			this.activate,
			this.startGesture
		)

		handleUp = this.handle(
			forProp('disabled', false),
			this.endGesture,
			this.isTracking,
			forwardUp,
			forwardTap
		).finally(this.deactivate)

		handleEnter = this.handle(
			forProp('disabled', false),
			forProp('noResume', false),
			this.isPaused,
			this.activate,
			this.enterGesture
		)

		handleLeave = this.handle(
			forProp('disabled', false),
			this.leaveGesture,
			oneOf(
				[forProp('noResume', false), this.pause],
				[returnsTrue, this.deactivate]
			)
		)

		// Mouse event handlers

		handleMouseDown = this.handle(
			isNotBlocked,
			forward('onMouseDown'),
			this.handleDown
		).finally(unblock)

		handleMouseEnter = this.handle(
			forward('onMouseEnter'),
			this.handleEnter
		)

		handleMouseMove = this.handle(
			forward('onMouseMove'),
			this.moveGesture
		)

		handleMouseLeave = this.handle(
			forward('onMouseLeave'),
			this.handleLeave
		)

		handleMouseUp = this.handle(
			forward('onMouseUp'),
			this.handleUp
		)

		// Touch event handlers

		handleTouchStart = this.handle(
			forward('onTouchStart'),
			// block the next mousedown to prevent duplicate onDown events
			block,
			this.handleDown
		)

		handleTouchMove = this.handle(
			forward('onTouchMove'),
			this.isTracking,
			// we don't receive enter/leave events during a touch so we have to simulate them by
			// detecting when the touch leaves the boundary. oneOf returns the value of whichever
			// branch it follows so we append moveHold to either to handle moves that aren't
			// entering or leaving
			forwardMove,
			oneOf(
				[this.hasTouchLeftTarget, this.handleLeave],
				[returnsTrue, this.handleEnter]
			).finally(this.moveGesture)
		)

		handleTouchEnd = this.handle(
			forward('onTouchEnd'),
			this.isTracking,
			complement(this.hasTouchLeftTarget),
			this.handleUp
		)

		// Global touchend/mouseup event handler to deactivate the component
		handleGlobalUp = this.handle(
			this.isTracking,
			this.deactivate,
			this.endGesture
		)

		addHandlers (props) {
			props.onMouseDown = this.handleMouseDown;
			props.onMouseLeave = this.handleMouseLeave;
			props.onMouseMove = this.handleMouseMove;
			props.onMouseEnter = this.handleMouseEnter;
			props.onMouseUp = this.handleMouseUp;

			if (platform.touch) {
				props.onTouchStart = this.handleTouchStart;
				props.onTouchMove = this.handleTouchMove;
				props.onTouchEnd = this.handleTouchEnd;
			}
		}

		render () {
			const props = Object.assign({}, this.props);

			this.addHandlers(props);

			delete props.holdConfig;
			delete props.noResume;
			delete props.onDown;
			delete props.onFlick;
			delete props.onHold;
			delete props.onHoldPulse;
			delete props.onTap;
			delete props.onUp;

			if (activeProp) {
				props[activeProp] = this.state.active !== States.Inactive;
			}

			return (
				<Wrapped {...props} />
			);
		}
	};
});

export default Touchable;
export {
	configure,
	Touchable
};
