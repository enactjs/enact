/**
 * Provides methods to add and remove global event listeners
 *
 * @module @enact/core/dispatcher
 */

import R from 'ramda';

import getListeners from './listeners';

/**
 * Wraps event callbacks with a try-catch block to prevent unrelated code from blocking
 *
 * @param	{Event}		ev	Event payload
 * @param	{Function}	fn	Event callback
 *
 * @returns	{undefined}
 */
const invoker = R.curry(function (ev, fn) {
	try {
		fn(ev);
	} catch (e) {
		// eslint-disable-next-line no-console
		console.error(`A ${e.name} occurred during event handling with the message '${e.message}'`);
	}
});

/**
 * Dispatches an event to the registered handlers
 *
 * @param	{Event}		ev	Event payload
 *
 * @returns {undefined}
 */
const dispatcher = function (ev) {
	const name = ev.type;
	const listeners = getListeners(ev.target, name);

	if (listeners) {
		const inv = invoker(ev);
		listeners.forEach(inv);
	}
};

/**
 * Adds a new global event listener
 *
 * @param	{String}	name				Event name
 * @param	{Function}	fn					Event handler
 * @param	{Node}		[target=`document`]	Event listener target
 *
 * @returns {undefined}
 */
const on = function (name, fn, target = document) {
	const listeners = getListeners(target, name);

	const length = listeners.push(fn);
	if (length === 1) {
		target.addEventListener(name, dispatcher);
	}
};

/**
 * Removes a global event listener
 *
 * @param	{String}	name				Event name
 * @param	{Function}	fn					Event handler
 * @param	{Node}		[target=`document`]	Event listener target
 *
 * @returns {undefined}
 */
const off = function (name, fn, target = document) {
	const listeners = getListeners(target, name);
	const index = listeners.indexOf(fn);

	if (index >= 0) {
		listeners.splice(index, 1);
		if (listeners.length === 0) {
			target.removeEventListener(name, dispatcher);
		}
	}
};

/**
 * Adds a new global event listener that removes itself after handling one event
 *
 * @param	{String}	name				Event name
 * @param	{Function}	fn					Event handler
 * @param	{Node}		[target=`document`]	Event listener target
 *
 * @returns {Function}						The single-use handler which can be passed to `off` to
 *											remove it.
 */
const once = function (name, fn, target = document) {
	const onceFn = function (ev) {
		fn(ev);
		off(name, onceFn, target);
	};

	on(name, onceFn, target);

	return onceFn;
};

export {
	off,
	on,
	once
};
