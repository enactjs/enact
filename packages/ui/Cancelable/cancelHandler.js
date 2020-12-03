import {forKey} from '@enact/core/handle';

/**
 * Array of cancel handlers. If any of these returns `false`, `forCancel` will return `false`;
 *
 * @type {Function[]}
 * @private
 */
const cancelHandlers = [
	// always support the Escape key
	forKey('cancel')
];

/**
 * Event handler compatible with {@link core/handle} that allows the handler chain to
 * continue for any cancel event. A cancel event is an Escape key press by default but can be
 * extended adding additional handlers using
 * {@link ui/Cancelable/cancelHandler.addCancelHandler}.
 *
 * @function
 * @memberof ui/Cancelable
 * @param  {Object} ev Event object
 * @returns {Boolean} `true` to stop the handler chain
 * @private
 */
const forCancel = function (ev) {
	let ok = false;
	cancelHandlers.forEach(fn => {
		// if any handler returns true, we don't need to call any more
		ok = ok || fn(ev);
	});

	return ok;
};

/**
 * Adds an event handler to filter cancel events.
 *
 * @function
 * @memberof ui/Cancelable
 * @param {Function} handler	Function that will receive the event and should return `true` if
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
 * @function
 * @memberof ui/Cancelable
 * @param {Function} handler A previously added filter function
 * @returns {undefined}
 * @public
 */
const removeCancelHandler = function (handler) {
	const index = cancelHandlers.indexOf(handler);
	if (index >= 0) {
		cancelHandlers.splice(index, 1);
	}
};

/**
 * Dispatch cancel events
 *
 * @function
 * @memberof ui/Cancelable
 * @param {Function} handler Call onCancel event handler
 * @returns {Boolean} `false` to stop the handler chain
 * @public
 */
const dispatchCancelToConfig = (onCancel) => (props) => {
	// by default, we return false which allows event propagation because it will "break" the
	// handler chain and not call `stop` and `stopImmediate` below
	let stopped = false;

	const cancelEvent = {
		type: 'onCancel',
		stopPropagation: () => {
			stopped = true;
		}
	};

	if (onCancel) {
		onCancel(cancelEvent, props);
	}

	return stopped;
};

export {
	addCancelHandler,
	dispatchCancelToConfig,
	forCancel,
	removeCancelHandler
};
