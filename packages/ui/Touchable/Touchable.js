/**
 * Provides the [Touchable]{@link ui/Touchable.Touchable} Higher-order Component (HOC) to add
 * gesture support to components and the [configure()]{@link ui/Touchable.configure} method for
 * configuring gestures for the application.
 *
 * @module ui/Touchable
 */

import {forward, forwardWithPrevent, forEventProp, forProp, handle, oneOf, preventDefault, returnsTrue} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {Job} from '@enact/core/util';
import {on, off} from '@enact/core/dispatcher';
import complement from 'ramda/src/complement';
import platform from '@enact/core/platform';
import PropTypes from 'prop-types';
import React from 'react';

import {configure, mergeConfig} from './config';
import {activate, deactivate, pause, States} from './state';
import {block, unblock, isNotBlocked} from './block';

import {Drag, dragConfigPropType} from './Drag';
import {Flick, flickConfigPropType} from './Flick';
import {Hold, holdConfigPropType} from './Hold';

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
 * support for common gestures including `onFlick`, `onDrag`, onHold`, and `onHoldPulse`.
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
			 * Instance-specific overrides of the drag configuration
			 *
			 * @see ui/Touchable.configure
			 * @type {Object}
			 * @public
			 */
			dragConfig: dragConfigPropType,

			/**
			 * Instance-specific overrides of the flick configuration
			 *
			 * @see ui/Touchable.configure
			 * @type {Object}
			 * @public
			 */
			flickConfig: flickConfigPropType,

			/**
			 * Instance-specific overrides of the hold configuration
			 *
			 * @see ui/Touchable.configure
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
			 * Event handler for a drag gesture
			 *
 			 * Event payload includes:
			 *
			 * * `type` - Type of event, `"onDrag"`
			 * * `x` - Horizontal position of the drag, relative to the viewport
			 * * `y` - Vertical position of the drag, relative to the viewport
			 *
			 * @type {Function}
			 * @public
			 */
			onDrag: PropTypes.func,

			/**
			 * Event handler for end of a drag gesture
			 *
 			 * Event payload includes:
			 *
			 * * `type` - Type of event, `"onDragEnd"`
			 *
			 * @type {Function}
			 * @public
			 */
			onDragEnd: PropTypes.func,

			/**
			 * Event handler for the start of a drag gesture
			 *
 			 * Event payload includes:
			 *
			 * * `type` - Type of event, `"onDragStart"`
			 * * `x` - Horizontal position of the drag, relative to the viewport
			 * * `y` - Vertical position of the drag, relative to the viewport
			 *
			 * @type {Function}
			 * @public
			 */
			onDragStart: PropTypes.func,

			/**
			 * Event handler for a flick gesture
			 *
			 * Event payload includes:
			 *
			 * * `type` - Type of event, `"onFlick"`
			 * * `direction` - Primary direction of the flick, either `"horizontal"` or `"vertical"`
			 * * `velocity` - Velocity of flick
			 * * `velocityX` - Velocity of flick along te horizontal axis
			 * * `velocityY` - Velocity of flick along te vertical axis
			 *
			 * @type {Function}
			 * @public
			 */
			onFlick: PropTypes.func,

			/**
			 * Event handler for hold events
			 *
			 * Event payload includes:
			 *
			 * * `type` - Type of event, `"onFlick"`
			 * * `name` - The name of the hold as configured in the events list
			 * * `time` - Time, in milliseconds, configured for this hold which may vary slightly
			 *            from time since the hold began
			 *
			 * @type {Function}
			 * @public
			 */
			onHold: PropTypes.func,

			/**
			 * Event handler for hold pulse events
			 *
			 * Event payload includes:
			 *
			 * * `type` - Type of event, `"onHold"`
			 * * `time` - Time, in milliseconds, since the hold began
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

		constructor (props) {
			super(props);

			this.state = {
				active: States.Inactive
			};

			this.config = mergeConfig({
				drag: props.dragConfig,
				flick: props.flickConfig,
				hold: props.holdConfig
			});
		}

		componentDidMount () {
			// ensure we clean up our internal state
			if (platform.touch) {
				on('touchend', this.handleGlobalUp, document);
			}
			on('mouseup', this.handleGlobalUp, document);
			on('mousemove', this.handleGlobalMove, document);
		}

		componentWillReceiveProps (nextProps) {
			if (!this.props.disabled && nextProps.disabled) {
				this.deactivate();
				this.hold.end();
			}

			this.config = mergeConfig({
				drag: nextProps.dragConfig,
				flick: nextProps.flickConfig,
				hold: nextProps.holdConfig
			});
		}

		componentWillUnmount () {
			this.clearTarget();
			this.hold.end();
			this.blurJob.stop();

			if (platform.touch) {
				off('touchend', this.handleGlobalUp, document);
			}
			off('mouseup', this.handleGlobalUp, document);
			off('mousemove', this.handleGlobalMove, document);
		}

		target = null
		handle = handle.bind(this)
		drag = new Drag()
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
			let {hold, flick, drag} = this.config;

			this.hold.begin(hold, props, coords);
			this.flick.begin(flick, props, coords);
			this.drag.begin(drag, props, coords, this.target);

			return true;
		}

		moveGesture = (ev) => {
			const coords = getEventCoordinates(ev);

			this.hold.move(coords);
			this.flick.move(coords);
			this.drag.move(coords);

			return true;
		}

		enterGesture = () => {
			this.drag.enter();
			this.hold.enter();

			return true;
		}

		leaveGesture = () => {
			this.drag.leave();
			this.hold.leave();

			return true;
		}

		endGesture = () => {
			this.hold.end();
			this.flick.end();
			this.drag.end();

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
			this.enterGesture,
			this.isPaused,
			this.activate
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
			forEventProp('button', 0),
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
			this.deactivate
		).finally(this.endGesture)

		handleGlobalMove = this.handle(
			this.isTracking,
			({target}) => !this.target.contains(target),
			this.moveGesture
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

			delete props.dragConfig;
			delete props.flickConfig;
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
