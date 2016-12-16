import {forKeyCode} from '@enact/core/handle';

/**
 * Array of cancel handlers. If any of these returns `false`, `forCancel` will return `false`;
 *
 * @type {Function[]}
 * @private
 */
const cancelHandlers = [
	// always support the Escape key
	forKeyCode(27)
];

/**
 * Event handler compatible with {@link core/handle} that allows the handler chain to
 * continue for any cancel event. A cancel event is an Escape key press by default but can be
 * extended adding additional handlers using
 * {@link ui/Cancelable/cancelHandler.addCancelHandler}.
 *
 * @param  {Object} ev Event object
 * @returns {Boolean} `true` to stop the handler chain
 * @private
 */
const forCancel = function (ev) {
	let stop = true;
	cancelHandlers.forEach(fn => {
		// if any handler returns false, do not stop the handler chain
		stop = stop && fn(ev);
	});

	return stop;
};

/**
 * Adds an event handler to filter cancel events.
 *
 * @memberof ui/Cancelable
 * @param {Function} handler	Function that will receive the event and should return `false` if
 *								the event is a cancel event.
 * @returns {undefined}
 * @public
 */
const addCancelHandler = function (handler) {
	if (cancelHandlers.indexOf(handler) < 0) {
		cancelHandlers.push(handler);
	}
};

/**
 * Removes an event handler to filter cancel events
 *
 * @memberof ui/Cancelable
 * @param  {Function} handler A previously added filter function
 * @returns {undefined}
 * @public
 */
const removeCancelHandler = function (handler) {
	const index = cancelHandlers.indexOf(handler);
	if (index >= 0) {
		cancelHandlers.splice(index, 1);
	}
};

export {
	addCancelHandler,
	forCancel,
	removeCancelHandler
};
