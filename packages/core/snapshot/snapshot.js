/**
 * Utilities to facilitate integration with v8 snapshot builds
 *
 * @module core/snapshot
 * @public
 */

import invariant from 'invariant';

const windowCallbacks = [];

/**
 * Determines if the `window` is available
 *
 * @returns {Boolean} `true` when `window` is ready
 * @memberof core/snapshot
 * @public
 */
function isWindowReady () {
	return typeof window !== 'undefined';
}

/**
 * Executes a callback, such as registering event handlers, when a valid `window` is available.
 *
 * During normal operation, the callback will be executed immediately. During a pre-rendering pass,
 * the callback is not be executed at all. When using snapshot, the callback is added to a queued
 * and is executed in order once the window is available.
 *
 * *Important Notes*
 * * The callback should not alter the initial HTML state. If it does, it will invalidate the
 * pre-render state and interfere with React rehydration.
 * * The callback should be limited to module-scoped actions and not component instance actions. If
 * the action is tied to a component, it should be invoked from within the component's lifecycle
 * methods.
 *
 * @param   {Function} callback Function to run when the window is ready
 * @memberof core/snapshot
 * @public
 */
function onWindowReady (callback) {
	if (isWindowReady()) {
		callback();
	} else {
		windowCallbacks.push(callback);
	}
}

/**
 * Executes all queued window callbacks.
 *
 * Requires that the window be, in fact, available and will throw an `Error` if not.
 *
 * @memberof core/snapshot
 * @public
 */
function windowReady () {
	invariant(
		isWindowReady(),
		'windowReady cannot be run until the window is available'
	);

	windowCallbacks.forEach(f => f());
}

export default onWindowReady;
export {
	isWindowReady,
	onWindowReady,
	windowReady
};
