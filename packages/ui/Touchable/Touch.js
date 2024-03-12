import {call, forward, forwardCustom, forwardCustomWithPrevent, forProp, handle, oneOf, preventDefault, returnsTrue} from '@enact/core/handle';
import {on, off} from '@enact/core/dispatcher';
import complement from 'ramda/src/complement';
import platform from '@enact/core/platform';

import {mergeConfig} from './config';
import {States} from './state';
import ClickAllow from './ClickAllow';

import {Drag} from './Drag';
import {Flick} from './Flick';
import {Hold} from './Hold';
import {Pinch} from './Pinch';

const getEventCoordinates = (ev) => {
	let {clientX: x, clientY: y, type} = ev;
	if (type.indexOf('touch') === 0) {
		if (ev.targetTouches.length >= 2) {
			return Array.from(ev.targetTouches, (targetTouch) => ({
				x: targetTouch.clientX,
				y: targetTouch.clientY
			}));
		} else {
			x = ev.targetTouches[0].clientX;
			y = ev.targetTouches[0].clientY;
		}
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
	forwardCustomWithPrevent('onDown', makeTouchableEvent('onDown')),
	call('activate'),
	call('startGesture')
).named('handleDown');

const handleUp = handle(
	isEnabled,
	call('endGesture'),
	call('isTracking'),
	forwardCustomWithPrevent('onUp', makeTouchableEvent('onUp')),
	forwardCustom('onTap', makeTouchableEvent('onTap'))
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
	call('startTouch'),
	handleDown
);

const handleTouchMove = handle(
	forward('onTouchMove'),
	call('isTracking'),
	// we don't receive enter/leave events during a touch so we have to simulate them by
	// detecting when the touch leaves the boundary. oneOf returns the value of whichever
	// branch it follows so we append moveHold to either to handle moves that aren't
	// entering or leaving
	forwardCustom('onMove', makeTouchableEvent('onMove')),
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
	returnsTrue(call('endTouch')),
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

class Touch {
	constructor () {
		this.context = {};

		this.target = null;
		this.targetHadFocus = false;
		this.handle = handle.bind(this);
		this.drag = new Drag();
		this.flick = new Flick();
		this.hold = new Hold();
		this.pinch = new Pinch();

		this.clickAllow = new ClickAllow();

		this.handlers = {
			onClick: handleClick.bindAs(this, 'handleClick'),
			onBlur: handleBlur.bindAs(this, 'handleBlur'),
			onMouseDown: handleMouseDown.bindAs(this, 'handleMouseDown'),
			onMouseEnter: handleMouseEnter.bindAs(this, 'handleMouseEnter'),
			onMouseMove: handleMouseMove.bindAs(this, 'handleMouseMove'),
			onMouseLeave: handleMouseLeave.bindAs(this, 'handleMouseLeave'),
			onMouseUp: handleMouseUp.bindAs(this, 'handleMouseUp')
		};

		if (platform.touchEvent) {
			Object.assign(this.handlers, {
				onTouchStart: handleTouchStart.bindAs(this, 'handleTouchStart'),
				onTouchMove: handleTouchMove.bindAs(this, 'handleTouchMove'),
				onTouchEnd: handleTouchEnd.bindAs(this, 'handleTouchEnd')
			});
		}

		handleGlobalUp.bindAs(this, 'handleGlobalUp');
		handleGlobalMove.bindAs(this, 'handleGlobalMove');
	}

	setPropsAndContext (config, state, setState) {
		// remapping to props for better compatibility with core/handle and binding
		this.props = config;
		this.context.state = state;
		this.context.setState = setState;
	}

	updateGestureConfig (dragConfig, flickConfig, holdConfig, pinchConfig) {
		this.config = mergeConfig({
			drag: dragConfig,
			flick: flickConfig,
			hold: holdConfig,
			pinch: pinchConfig
		});
	}

	addGlobalHandlers () {
		// ensure we clean up our internal state
		if (platform.touchEvent) {
			on('touchend', this.handleGlobalUp, document);
		}
		on('mouseup', this.handleGlobalUp, document);
		on('mousemove', this.handleGlobalMove, document);
	}

	removeGlobalHandlers () {
		if (platform.touchEvent) {
			off('touchend', this.handleGlobalUp, document);
		}
		off('mouseup', this.handleGlobalUp, document);
		off('mousemove', this.handleGlobalMove, document);
	}

	// State Management

	setTarget (target) {
		this.target = target;
	}

	clearTarget () {
		this.target = null;
	}

	activate (ev) {
		this.setTarget(ev.currentTarget);
		if (this.props.getActive) {
			this.context.setState(States.Active);
		}

		return true;
	}

	deactivate () {
		this.clearTarget();
		if (this.props.getActive) {
			this.context.setState(States.Inactive);
		}

		return true;
	}

	pause () {
		if (this.props.getActive && this.context.state === States.Active) {
			this.context.setState(States.Paused);
		}

		return true;
	}

	disable () {
		this.clearTarget();
		this.hold.end();
	}

	updateProps (props) {
		// Update the props onHoldStart, onHold, and onHoldEnd on any gesture (pinch, hold, flick, drag).
		this.pinch.updateProps(props);
		this.hold.updateProps(props);
		this.flick.updateProps(props);
		this.drag.updateProps(props);
	}

	// Gesture Support

	startTouch ({target, currentTarget}) {
		if (currentTarget.contains(target)) {
			on('contextmenu', preventDefault);
			this.targetBounds = currentTarget.getBoundingClientRect();
			return true;
		}
		return false;
	}

	endTouch () {
		off('contextmenu', preventDefault);
		this.targetBounds = null;
	}

	startGesture (ev, props) {
		const coords = getEventCoordinates(ev);
		let {pinch, hold, flick, drag} = this.config;

		if (Array.isArray(coords)) {
			this.pinch.begin(pinch, props, coords, this.target);
		} else {
			this.hold.begin(hold, props, coords);
			this.flick.begin(flick, props, coords);
			this.drag.begin(drag, props, coords, this.target);
		}
		this.targetHadFocus = this.target === document.activeElement;

		return true;
	}

	moveGesture (ev) {
		const coords = getEventCoordinates(ev);

		if (Array.isArray(coords)) {
			this.pinch.move(coords);
		} else {
			this.hold.move(coords);
			this.flick.move(coords);
			this.drag.move(coords);
		}

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

		this.pinch.end();
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
		return this.context.state === States.Paused;
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

	getHandlers = () => (this.handlers);
}

export default Touch;
export {
	Touch
};
