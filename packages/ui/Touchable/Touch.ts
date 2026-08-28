import {
	call, forward, forwardCustom, forwardCustomWithPrevent, forProp, handle, oneOf, preventDefault, returnsTrue
} from '@enact/core/handle';
import {on, off} from '@enact/core/dispatcher';
import complement from 'ramda/src/complement';
import platform from '@enact/core/platform';
import {Dispatch, PointerEvent, SetStateAction} from 'react';

import {mergeConfig, TouchableConfig} from './config';
import {States} from './state';
import ClickAllow, {EventLike} from './ClickAllow';
import {Drag, dragConfigPropType} from './Drag';
import {Flick, flickConfigPropType} from './Flick';
import {Hold, holdConfigPropType} from './Hold';
import {Pinch, pinchConfigPropType} from './Pinch';
import {TouchableProps} from './Touchable';
import {useTouchConfig} from './useTouch';

export interface PointerOrTouchEvent {
	type: string;
	clientX: number;
	clientY: number;
	targetTouches: ArrayLike<{
		clientX: number;
		clientY: number
	}>;
}

export interface SourceEvent {
	target: EventTarget | null;
	currentTarget: EventTarget | null;
	clientX?: number;
	clientY?: number;
	pageX?: number;
	pageY?: number;
	changedTouches?: ArrayLike<{
		clientX: number;
		clientY: number;
		pageX: number;
		pageY: number;
	}>;
}


export interface TouchConfig extends Partial<TouchableConfig>, Partial<useTouchConfig> {
	disabled?: boolean;
	getActive?: boolean;
}

const getEventCoordinates = (ev: PointerOrTouchEvent) => {
	let {clientX: x, clientY: y, type} = ev;
	if (type.indexOf('touch') === 0) {
		if (ev.targetTouches.length >= 2) {
			return Array.from(ev.targetTouches, (targetTouch: {clientX: number, clientY: number}) => ({
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
const makeTouchableEvent = (type: string) => (ev: SourceEvent | null) => {
	if (!ev) return;

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
	context: {
		state?: number;
		setState?: Dispatch<SetStateAction<number>>;
	} = {};
	target: HTMLElement | null = null;
	targetHadFocus;
	handle;
	drag;
	flick;
	hold;
	pinch;
	clickAllow;
	handlers;
	config: TouchConfig = {} as TouchConfig;
	props: TouchConfig | null = null;
	targetBounds: DOMRect | null = null;
	handleGlobalUp: typeof handleGlobalUp | null = null;
	handleGlobalMove: typeof handleGlobalMove | null = null;

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

	setPropsAndContext (config: TouchConfig, state: number, setState: Dispatch<SetStateAction<number>>) {
		// remapping to props for better compatibility with core/handle and binding
		this.props = config;
		this.context.state = state;
		this.context.setState = setState;
	}

	updateGestureConfig (dragConfig: dragConfigPropType, flickConfig: flickConfigPropType, holdConfig: holdConfigPropType, pinchConfig: pinchConfigPropType) {
		this.config = mergeConfig({
			drag: dragConfig,
			flick: flickConfig,
			hold: holdConfig,
			pinch: pinchConfig
		});
	}

	addGlobalHandlers () {
		// ensure we clean up our internal state
		if (this.handleGlobalUp) {
			if (platform.touchEvent) {
				on('touchend', this.handleGlobalUp, document);
			}
			on('mouseup', this.handleGlobalUp, document);
		}
		if (this.handleGlobalMove) {
			on('mousemove', this.handleGlobalMove, document);
		}
	}

	removeGlobalHandlers () {
		if (this.handleGlobalUp) {
			if (platform.touchEvent) {
				off('touchend', this.handleGlobalUp, document);
			}
			off('mouseup', this.handleGlobalUp, document);
		}
		if (this.handleGlobalMove) {
			off('mousemove', this.handleGlobalMove, document);
		}
	}

	// State Management

	setTarget (target: HTMLElement) {
		this.target = target;
	}

	clearTarget () {
		this.target = null;
	}

	activate (ev: PointerEvent<HTMLElement>) {
		this.setTarget(ev.currentTarget);
		if (this.props?.getActive && this.context.setState) {
			this.context.setState(States.Active);
		}

		return true;
	}

	deactivate () {
		this.clearTarget();
		if (this.props?.getActive && this.context.setState) {
			this.context.setState(States.Inactive);
		}

		return true;
	}

	pause () {
		if (this.context.setState && this.props?.getActive && this.context.state === States.Active) {
			this.context.setState(States.Paused);
		}

		return true;
	}

	disable () {
		this.clearTarget();
		this.hold.end();
	}

	updateProps (props: Partial<TouchableProps>) {
		// Update the props onHoldStart, onHold, and onHoldEnd on any gesture (pinch, hold, flick, drag).
		this.pinch.updateProps(props);
		this.hold.updateProps(props);
		this.flick.updateProps(props);
		this.drag.updateProps(props);
	}

	// Gesture Support

	startTouch ({target, currentTarget}: {target: HTMLElement, currentTarget: HTMLElement}) {
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

	startGesture (ev: PointerOrTouchEvent, props: Partial<TouchableProps>) {
		const coords = getEventCoordinates(ev);
		let {pinch, hold, flick, drag} = this.config;

		if (Array.isArray(coords)) {
			if (pinch && this.target) {
				this.pinch.begin(pinch, props, coords, this.target);
			}
		} else if (!Array.isArray(coords)) {
			if (hold && this.target) {
				this.hold.begin(hold, props, coords);
			}
			if (flick && this.target) {
				this.flick.begin(flick, props, coords);
			}
			if (drag && this.target) {
				this.drag.begin(drag, props, coords, this.target);
			}
		}
		this.targetHadFocus = this.target === document.activeElement;

		return true;
	}

	moveGesture (ev: PointerOrTouchEvent) {
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

	hasTouchLeftTarget (ev: TouchEvent) {
		return Array.from(ev.changedTouches).reduce((hasLeft, {pageX, pageY}) => {
			const {left = 0, right = 0, top = 0, bottom = 0} = this.targetBounds || {};
			return hasLeft && left > pageX || right < pageX || top > pageY || bottom < pageY;
		}, true);
	}

	containsCurrentTarget ({target}: {target: HTMLElement}) {
		return !this.target?.contains(target);
	}

	shouldAllowMouseEvent (ev: EventLike) {
		return this.clickAllow.shouldAllowMouseEvent(ev);
	}

	shouldAllowTap (ev: EventLike) {
		return this.clickAllow.shouldAllowTap(ev);
	}

	setLastMouseUp (ev: EventLike) {
		this.clickAllow.setLastMouseUp(ev);
	}

	setLastTouchEnd (ev: EventLike) {
		this.clickAllow.setLastTouchEnd(ev);
	}

	getHandlers = () => (this.handlers);
}

export default Touch;
export {
	Touch
};
