/**
 * Application support for gestures.
 *
 * @module ui/Touchable
 * @exports Touchable
 * @exports configure
 */

import {adaptEvent, call, forward, forwardWithPrevent, forProp, handle, oneOf, preventDefault, returnsTrue, stop} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {Job} from '@enact/core/util';
import {on, off} from '@enact/core/dispatcher';
import complement from 'ramda/src/complement';
import platform from '@enact/core/platform';
import PropTypes from 'prop-types';
import React from 'react';

import {configure, mergeConfig} from './config';
import {activate, deactivate, pause, States} from './state';
import ClickAllow from './ClickAllow';

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
const makeTouchableEvent = (type) => (ev) => {
	const {target, currentTarget} = ev;
	let {clientX, clientY, pageX, pageY} = ev;

	if (ev.changedTouches) {
		clientX = ev.changedTouches[0].clientX;
		clientY = ev.changedTouches[0].clientY;
		pageX = ev.changedTouches[0].pageX;
		pageY = ev.changedTouches[0].pageY;
	}

	return {
		type,
		target,
		currentTarget,
		clientX,
		clientY,
		pageX,
		pageY
	};
};

const isEnabled = forProp('disabled', false);

const handleDown = handle(
	isEnabled,
	adaptEvent(makeTouchableEvent('onDown'), forwardWithPrevent('onDown')),
	call('activate'),
	call('startGesture')
).named('handleDown');

const handleUp = handle(
	isEnabled,
	call('endGesture'),
	call('isTracking'),
	adaptEvent(makeTouchableEvent('onUp'), forwardWithPrevent('onUp')),
	adaptEvent(makeTouchableEvent('onTap'), forward('onTap'))
).finally(call('deactivate')).named('handleUp');

const handleEnter = handle(
	isEnabled,
	forProp('noResume', false),
	call('enterGesture'),
	call('isPaused'),
	call('activate')
).named('handleEnter');

const handleLeave = handle(
	isEnabled,
	call('leaveGesture'),
	oneOf(
		[forProp('noResume', false), call('pause')],
		[returnsTrue, call('deactivate')]
	)
).named('handleLeave');

// Mouse event handlers

const handleMouseDown = handle(
	forward('onMouseDown'),
	call('shouldAllowMouseEvent'),
	handleDown
);

const handleMouseEnter = handle(
	forward('onMouseEnter'),
	handleEnter
);

const handleMouseMove = handle(
	forward('onMouseMove'),
	call('moveGesture')
);

const handleMouseLeave = handle(
	forward('onMouseLeave'),
	handleLeave
);

const handleMouseUp = handle(
	returnsTrue(call('setLastMouseUp')),
	forward('onMouseUp'),
	handleUp
);

const handleClick = handle(
	isEnabled,
	// wrapping another handler to always forward onClick but, if onTap should occur, it should
	// occur first to keep in sync with the up handler which emits onTap first
	handle(
		call('shouldAllowTap'),
		call('activate'),
		handleUp
	).finally(forward('onClick'))
);

// Touch event handlers

const handleTouchStart = handle(
	forward('onTouchStart'),
	handleDown
);

const handleTouchMove = handle(
	forward('onTouchMove'),
	call('isTracking'),
	// we don't receive enter/leave events during a touch so we have to simulate them by
	// detecting when the touch leaves the boundary. oneOf returns the value of whichever
	// branch it follows so we append moveHold to either to handle moves that aren't
	// entering or leaving
	adaptEvent(makeTouchableEvent('onMove'), forward('onMove')),
	oneOf(
		[call('hasTouchLeftTarget'), handleLeave],
		[returnsTrue, handleEnter]
	).finally(call('moveGesture'))
);

const handleTouchEnd = handle(
	forward('onTouchEnd'),
	// block the next mousedown to prevent duplicate touchable events
	returnsTrue(call('setLastTouchEnd')),
	call('isTracking'),
	complement(call('hasTouchLeftTarget')),
	handleUp
);

// Global touchend/mouseup event handler to deactivate the component
const handleGlobalUp = handle(
	call('isTracking'),
	call('deactivate')
).finally(call('endGesture'));

const handleGlobalMove = handle(
	call('isTracking'),
	call('containsCurrentTarget'),
	call('moveGesture')
);

const handleBlur = handle(
	forward('onBlur'),
	call('hasFocus'),
	call('blurGesture')
);

/**
 * Default config for `Touchable`.
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
 * A higher-order component that provides a consistent set of pointer events -- `onDown`, `onUp`,
 * and `onTap` -- across mouse and touch interfaces along with support for common gestures including
 * `onFlick`, `onDrag`, `onHold`, and `onHoldPulse`.
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
			 * Disables the component.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			disabled: PropTypes.bool,

			/**
			 * Instance-specific overrides of the drag configuration.
			 *
			 * @see ui/Touchable.configure
			 * @type {Object}
			 * @public
			 */
			dragConfig: dragConfigPropType,

			/**
			 * Instance-specific overrides of the flick configuration.
			 *
			 * @see ui/Touchable.configure
			 * @type {Object}
			 * @public
			 */
			flickConfig: flickConfigPropType,

			/**
			 * Instance-specific overrides of the hold configuration.
			 *
			 * @see ui/Touchable.configure
			 * @type {Object}
			 * @public
			 */
			holdConfig: holdConfigPropType,

			/**
			 * Prevents resuming the touch events and gestures when re-entering the component.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			noResume: PropTypes.bool,

			/**
			 * Event handler for 'down' pointer events.
			 *
			 * @type {Function}
			 * @public
			 */
			onDown: PropTypes.func,

			/**
			 * Event handler for a drag gesture.
			 *
 			 * Event payload includes:
			 *
			 * * `type` - Type of event, `'onDrag'`
			 * * `x` - Horizontal position of the drag, relative to the viewport
			 * * `y` - Vertical position of the drag, relative to the viewport
			 *
			 * @type {Function}
			 * @public
			 */
			onDrag: PropTypes.func,

			/**
			 * Event handler for the end of a drag gesture.
			 *
 			 * Event payload includes:
			 *
			 * * `type` - Type of event, `'onDragEnd'`
			 *
			 * @type {Function}
			 * @public
			 */
			onDragEnd: PropTypes.func,

			/**
			 * Event handler for the start of a drag gesture.
			 *
 			 * Event payload includes:
			 *
			 * * `type` - Type of event, `'onDragStart'`
			 * * `x` - Horizontal position of the drag, relative to the viewport
			 * * `y` - Vertical position of the drag, relative to the viewport
			 *
			 * @type {Function}
			 * @public
			 */
			onDragStart: PropTypes.func,

			/**
			 * Event handler for a flick gesture.
			 *
			 * Event payload includes:
			 *
			 * * `type` - Type of event, `'onFlick'`
			 * * `direction` - Primary direction of the flick, either `'horizontal'` or `'vertical'`
			 * * `velocity` - Velocity of flick
			 * * `velocityX` - Velocity of flick along te horizontal axis
			 * * `velocityY` - Velocity of flick along te vertical axis
			 *
			 * @type {Function}
			 * @public
			 */
			onFlick: PropTypes.func,

			/**
			 * Event handler for hold events.
			 *
			 * Event payload includes:
			 *
			 * * `type` - Type of event, `'onHold'`
			 * * `name` - The name of the hold as configured in the events list
			 * * `time` - Time, in milliseconds, configured for this hold which may vary slightly
			 *            from time since the hold began
			 *
			 * @type {Function}
			 * @public
			 */
			onHold: PropTypes.func,

			/**
			 * Event handler for the end of hold events.
			 *
			 * Event payload includes:
			 *
			 * * `type` - Type of event, `'onHoldEnd'`
			 * * `time` - Time, in milliseconds, since the hold began
			 *
			 * @type {Function}
			 * @public
			 */
			onHoldEnd: PropTypes.func,

			/**
			 * Event handler for hold pulse events
			 *
			 * Event payload includes:
			 *
			 * * `type` - Type of event, `'onHoldPulse'`
			 * * `time` - Time, in milliseconds, since the hold began
			 *
			 * @type {Function}
			 * @public
			 */
			onHoldPulse: PropTypes.func,

			/**
			 * Event handler for 'tap' pointer events
			 *
			 * @type {Function}
			 * @public
			 */
			onTap: PropTypes.func,

			/**
			 * Event handler for 'up' pointer events
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
				active: States.Inactive,
				prevDisabled: props.disabled
			};

			this.config = mergeConfig({
				drag: props.dragConfig,
				flick: props.flickConfig,
				hold: props.holdConfig
			});

			this.target = null;
			this.targetHadFocus = false;
			this.handle = handle.bind(this);
			this.drag = new Drag();
			this.flick = new Flick();
			this.hold = new Hold();
			this.blurJob = new Job(target => {
				if (target.blur) {
					target.blur();
				}
			}, 400);

			this.clickAllow = new ClickAllow();

			handleClick.bindAs(this, 'handleClick');
			handleBlur.bindAs(this, 'handleBlur');
			handleMouseDown.bindAs(this, 'handleMouseDown');
			handleMouseEnter.bindAs(this, 'handleMouseEnter');
			handleMouseMove.bindAs(this, 'handleMouseMove');
			handleMouseLeave.bindAs(this, 'handleMouseLeave');
			handleMouseUp.bindAs(this, 'handleMouseUp');
			handleTouchStart.bindAs(this, 'handleTouchStart');
			handleTouchMove.bindAs(this, 'handleTouchMove');
			handleTouchEnd.bindAs(this, 'handleTouchEnd');
			handleGlobalUp.bindAs(this, 'handleGlobalUp');
			handleGlobalMove.bindAs(this, 'handleGlobalMove');
		}

		static getDerivedStateFromProps (props, state) {
			const {disabled} = props;
			const {prevDisabled} = state;

			if (prevDisabled !== disabled) {
				return {
					...(activeProp && !prevDisabled && disabled && deactivate(state)),
					prevDisabled: disabled
				};
			}
			return null;
		}

		componentDidMount () {
			// ensure we clean up our internal state
			if (platform.touch) {
				on('touchend', this.handleGlobalUp, document);
			}
			on('mouseup', this.handleGlobalUp, document);
			on('mousemove', this.handleGlobalMove, document);
		}

		componentDidUpdate (prevProps) {
			if (!prevProps.disabled && this.props.disabled) {
				this.clearTarget();
				this.hold.end();
			}

			this.config = mergeConfig({
				drag: this.props.dragConfig,
				flick: this.props.flickConfig,
				hold: this.props.holdConfig
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

		// State Management

		setTarget (target) {
			this.target = target;

			if (platform.touch) {
				on('contextmenu', preventDefault);
				this.targetBounds = this.target.getBoundingClientRect();
			}
		}

		clearTarget () {
			if (platform.touch) {
				off('contextmenu', preventDefault);
				this.targetBounds = null;
			}

			this.target = null;
		}

		activate (ev) {
			this.setTarget(ev.currentTarget);
			if (activeProp) {
				this.setState(activate);
			}

			if (ev && 'changedTouches' in ev) {
				this.target.focus();
			}

			return true;
		}

		deactivate (ev) {
			if (ev && 'changedTouches' in ev) {
				this.blurJob.start(this.target);
			}

			this.clearTarget();
			if (activeProp) {
				this.setState(deactivate);
			}

			return true;
		}

		pause () {
			if (activeProp) {
				this.setState(pause);
			}

			return true;
		}

		// Gesture Support

		startGesture (ev, props) {
			const coords = getEventCoordinates(ev);
			let {hold, flick, drag} = this.config;

			this.hold.begin(hold, props, coords);
			this.flick.begin(flick, props, coords);
			this.drag.begin(drag, props, coords, this.target);

			this.targetHadFocus = this.target === document.activeElement;

			return true;
		}

		moveGesture (ev) {
			const coords = getEventCoordinates(ev);

			this.hold.move(coords);
			this.flick.move(coords);
			this.drag.move(coords);

			return true;
		}

		enterGesture () {
			this.drag.enter();
			this.hold.enter();

			return true;
		}

		leaveGesture () {
			this.drag.leave();
			this.hold.leave();

			return true;
		}

		blurGesture () {
			this.targetHadFocus = false;

			this.hold.blur();
			this.flick.blur();
			this.drag.blur();

			return true;
		}

		endGesture () {
			this.targetHadFocus = false;

			this.hold.end();
			this.flick.end();
			this.drag.end();

			return true;
		}

		// Event handler utilities

		isTracking () {
			// verify we had a target and the up target is still within the current node
			return this.target;
		}

		isPaused () {
			return this.state.active === States.Paused;
		}

		hasFocus () {
			return this.targetHadFocus;
		}

		hasTouchLeftTarget (ev) {
			return Array.from(ev.changedTouches).reduce((hasLeft, {pageX, pageY}) => {
				const {left, right, top, bottom} = this.targetBounds;
				return hasLeft && left > pageX || right < pageX || top > pageY || bottom < pageY;
			}, true);
		}

		containsCurrentTarget ({target}) {
			return !this.target.contains(target);
		}

		shouldAllowMouseEvent (ev) {
			return this.clickAllow.shouldAllowMouseEvent(ev);
		}

		shouldAllowTap (ev) {
			return this.clickAllow.shouldAllowTap(ev);
		}

		setLastMouseUp (ev) {
			this.clickAllow.setLastMouseUp(ev);
		}

		setLastTouchEnd (ev) {
			this.clickAllow.setLastTouchEnd(ev);
		}

		addHandlers (props) {
			props.onClick = this.handleClick;
			props.onMouseDown = this.handleMouseDown;
			props.onMouseLeave = this.handleMouseLeave;
			props.onMouseMove = this.handleMouseMove;
			props.onMouseEnter = this.handleMouseEnter;
			props.onMouseUp = this.handleMouseUp;
			props.onBlur = this.handleBlur;

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
			delete props.onHoldEnd;
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
