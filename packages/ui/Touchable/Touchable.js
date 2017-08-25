/**
 * Exports the {@link ui/Touchable.Touchable} Higher-order Component (HOC).
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

import {activate, deactivate, pause, States} from './state';
import {block, unblock, isNotBlocked} from './block';
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
	const payload = {type, target, currentTarget};

	return fn(payload, ...args);
};

// Cache handlers since they are consistent across instances
const forwardDown = makeTouchableEvent('down', forwardWithPrevent('onDown'));
const forwardUp = makeTouchableEvent('up', forwardWithPrevent('onUp'));
const forwardTap = makeTouchableEvent('tap', forward('onTap'));

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
	activeProp: null,

	/**
	 * Configures the behavior of the hold gesture. It accepts the following parameters
	 *
	 * * `cancelOnMove` - When `true`, the hold is cancelled when moving beyond the `moveTolerance`.
	 *   Defaults to `false`
	 * * `moveTolerance` - The number of pixels from the start position of the hold that the pointer
	 *   may move before cancelling the hold. Ignored when `cancelOnMove` is `false`. Defaults to
	 *   `16`.
	 * * `frequency` - The time, in milliseconds, to poll for hold events. Defaults to `200`.
	 * * `events` - An array of `onHold` events which each contain a `name` and `time`. The `time`
	 *   controls the amount of time that must pass before this `onHold` event is fired and should
	 *   be a multiple of `frequency`.
	 * 
	 * @type {Object}
	 * @memberof ui/Touchable.Touchable.defaultConfig
	 */
	holdConfig: {
		cancelOnMove: false,
		moveTolerance: 16,
		frequency: 200,
		events: [
			{name: 'hold', time: 200}
		]
	}
};

/**
 * {@link ui/Touchable.Touchable} is a Higher-order Component that provides a consistent set of
 * pointer events -- `onDown`, `onUp`, and `onTap` -- across mouse and touch interfaces along with
 * support for common gestures including `onHold` and `onHoldPulse`.
 *
 * @class Touchable
 * @memberof ui/Touchable
 * @hoc
 * @public
 */
const Touchable = hoc(defaultConfig, (config, Wrapped) => {
	const {
		activeProp,
		holdConfig: defaultHoldConfig
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

			this.target = null;
			this.handle = handle.bind(this);
			this.hold = new Hold();

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

			if ('changedTouches' in ev) {
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

		startHold = (ev, {holdConfig, noResume, onHold, onHoldPulse}) => {
			if (onHold || onHoldPulse) {
				this.hold.begin({
					...defaultHoldConfig,
					...holdConfig,
					onHold,
					onHoldPulse,
					resume: !noResume
				}, getEventCoordinates(ev));
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
			forProp('noResume', false),
			this.isPaused,
			this.activate,
			this.enterHold
		)

		handleLeave = this.handle(
			forProp('disabled', false),
			this.leaveHold,
			oneOf(
				[forProp('noResume', false), this.pause],
				[returnsTrue, this.deactivate]
			)
		)

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
			this.moveHold
		)

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
			oneOf(
				[this.hasTouchLeftTarget, this.handleLeave],
				[returnsTrue, this.handleEnter]
			).finally(this.moveHold)
		)

		handleTouchEnd = this.handle(
			forward('onTouchEnd'),
			this.isTracking,
			complement(this.hasTouchLeftTarget),
			this.handleUp
		)

		handleGlobalUp = this.handle(
			this.isTracking,
			this.deactivate
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

			delete props.noResume;
			delete props.onDown;
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
	Touchable
};
