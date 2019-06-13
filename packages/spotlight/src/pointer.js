/**
 * Exports methods and members for working with pointer events in spotlight
 *
 * @module spotlight/pointer
 * @private
 */

import {is} from '@enact/core/keymap';
import {Job} from '@enact/core/util';

/*
 * Whether Spotlight is in pointer mode (as opposed to 5-way mode).
 *
 * @type {Boolean}
 * @default true
 * @private
 */
let _pointerMode = true;

/**
 * Sets the current pointer mode
 *
 * @param   {Boolean} pointerMode `true` to enable pointer mode; `false` to disable pointer mode
 * @memberof spotlight/pointer
 * @private
 */
const setPointerMode = (pointerMode) => {
	_pointerMode = pointerMode;
};

/**
 * Gets the current pointer mode
 *
 * @returns {Boolean} The current state of pointer mode
 * @memberof spotlight/pointer
 * @private
 */
const getPointerMode = () => {
	return _pointerMode;
};

// Cached pointer position
let _pointerX = null;
let _pointerY = null;

/**
 * Returns whether or not the current pointer position matches the provided coordinates
 *
 * @param   {Number} x Pointer position relative to the left side of the viewport
 * @param   {Number} y Pointer position relative to the top side of the viewport
 *
 * @returns {Boolean}   `true` if the position was changed
 * @memberof spotlight/pointer
 * @private
 */
const hasPointerMoved = (x, y) => (
	x !== _pointerX || y !== _pointerY
);

/**
 * Updates the cached pointer position, updating the current pointer mode when the position has
 * changed.
 *
 * @param   {Number} x Pointer position relative to the left side of the viewport
 * @param   {Number} y Pointer position relative to the top side of the viewport
 *
 * @returns {Boolean}   `true` if the position was updated
 * @memberof spotlight/pointer
 * @private
 */
const updatePointerPosition = (x, y) => {
	// Chrome emits mousemove on scroll, but client coordinates do not change.
	if (hasPointerMoved(x, y)) {
		setPointerMode(true);
		_pointerX = x;
		_pointerY = y;

		return true;
	}

	return false;
};

/**
 * Returns the last known position of the pointer
 *
 * @returns {Object} Contains `x` and `y` coordinates for the pointer
 * @memberof spotlight/pointer
 * @private
 */
const getLastPointerPosition = () => {
	return {
		x: _pointerX,
		y: _pointerY
	};
};

// 30ms (_pointerHiddenToKeyTimeout) is semi-arbitrary, to account for the time it takes for the
// following directional key event to fire, and to prevent momentary spotting of the last
// focused item - needs to be a value large enough to account for the potentially-trailing
// event, but not too large that another unrelated event can be fired inside the window
const hidePointerJob = new Job(function (callback) {
	setPointerMode(false);
	if (callback) {
		callback();
	}
}, 30);


/**
 * Notifies spotlight of a change in the pointer position
 *
 * @param   {Node}     target   Node under the pointer
 * @param   {Number}   x        Horizontal position relative to the left side of the viewport
 * @param   {Number}   y        Vertical position relative to the top side of the viewport
 *
 * @returns {Boolean}           `true` if the change in position results in a change in focus
 * @memberof spotlight/pointer
 * @private
 */
const notifyPointerMove = (current, target, x, y) => {
	const priorPointerMode = getPointerMode();

	if (updatePointerPosition(x, y)) {
		// if we're entering pointer mode and the target element isn't within the currently
		// focused element, there may be a new navigable target
		return !priorPointerMode || !current || !current.contains(target);
	}

	// the pointer hasn't actually moved (surprise!)
	return false;
};

/**
 * Notifies the pointer module of key events. If the pointer should be hidden, a timer is set and
 * `callback` is invoked after the timer has expired and pointer mode has been disabled. For any
 * other type of key event, pointer mode is disabled and `false` is returned.
 *
 * @param   {Number}    keyCode     Key event key code
 * @param   {Function}  [callback]  Optional callback to invoke upon hiding the pointer.
 *
 * @returns {Boolean}               `true` for pointer hide or show key events
 * @memberof spotlight/pointer
 * @private
 */
const notifyKeyDown = (keyCode, callback) => {
	// for hide/show pointer events, handle them and return true
	if (is('pointerHide', keyCode)) {
		hidePointerJob.start(callback);
		return true;
	} else if (is('pointerShow', keyCode)) {
		setPointerMode(true);
		return true;
	} else if (!is('nonModal', keyCode) && !is('cancel', keyCode)) {
		setPointerMode(false);
	}

	return false;
};

export {
	getLastPointerPosition,
	getPointerMode,
	hasPointerMoved,
	notifyKeyDown,
	notifyPointerMove,
	setPointerMode,
	updatePointerPosition
};
