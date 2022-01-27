/**
 * Provides methods to add and remove global event listeners.
 *
 * @module core/dispatcher
 * @exports off
 * @exports on
 * @exports once
 */

import curry from 'ramda/src/curry';

import {getListeners, addListener} from './listeners';

let defaultTarget = typeof document === 'object' && document;

/*
 * Sets a selector for the default target. If no selector is set, `document` is the default target.
 *
 * @function
 * @param	{String}	id	Node id of the default target
 *
 * @returns {undefined}
 * @memberof core/dispatcher
 * @private
 */
const setDefaultTargetById = (id) => {
	defaultTarget = typeof document === 'object' && document.querySelector('#' + id) || defaultTarget;
};

/*
 * Checks if the default target of `document` exists before returning it, otherwise returns `false`.
 *
 * @function
 *
 * @returns {Node|Boolean}
 * @memberof core/dispatcher
 * @private
 */
const getDefaultTarget = () => defaultTarget;

/*
 * Wraps event callbacks with a try-catch block to prevent unrelated code from blocking.
 *
 * @function
 * @param	{Event}		ev	Event payload
 * @param	{Function}	fn	Event callback
 *
 * @returns	{undefined}
 * @memberof core/dispatcher
 * @private
 */
const invoker = curry(function (ev, fn) {
	try {
		fn(ev);
	} catch (e) {
		// eslint-disable-next-line no-console
		console.error(`A ${e.name} occurred during event handling with the message '${e.message}'`);
	}
});

/*
 * Dispatches an event to the registered handlers.
 *
 * @function
 * @param	{Event}		ev	Event payload
 *
 * @returns {undefined}
 * @memberof core/dispatcher
 * @private
 */
const dispatcher = function (ev) {
	const name = ev.type;
	const listeners = getListeners(ev.currentTarget, name);

	if (listeners) {
		const inv = invoker(ev);
		listeners.forEach(inv);
	}
};

/**
 * Adds a new global event listener. Duplicate event handlers will be discarded.
 *
 * @function
 * @param	{String}	name				Event name
 * @param	{Function}	fn					Event handler
 * @param	{Node}		[target='document']	Event listener target
 *
 * @returns {undefined}
 * @memberof core/dispatcher
 * @public
 */
const on = function (name, fn, target = getDefaultTarget()) {
	if (target) {
		const added = addListener(target, name, fn);

		if (added && getListeners(target, name).length === 1) {
			target.addEventListener(name, dispatcher);
		}
	}
};

/**
 * Removes a global event listener.
 *
 * @function
 * @param	{String}	name				Event name
 * @param	{Function}	fn					Event handler
 * @param	{Node}		[target=`document`]	Event listener target
 *
 * @returns {undefined}
 * @memberof core/dispatcher
 * @public
 */
const off = function (name, fn, target = getDefaultTarget()) {
	if (target) {
		const listeners = getListeners(target, name);
		const index = listeners.indexOf(fn);

		if (index >= 0) {
			listeners.splice(index, 1);
			if (listeners.length === 0) {
				target.removeEventListener(name, dispatcher);
			}
		}
	}
};

/**
 * Adds a new global event listener that removes itself after handling one event.
 *
 * @function
 * @param	{String}	name		Event name
 * @param	{Function}	fn			Event handler
 * @param	{Node}		[target]	Event listener target
 *
 * @returns {Function}				The single-use handler. To remove the handler manually, call
 *									the `off()` function with this as the 2nd parameter.
 * @memberof core/dispatcher
 * @public
 */
const once = function (name, fn, target) {
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
	once,
	setDefaultTargetById
};
