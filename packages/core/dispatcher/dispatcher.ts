/**
 * Provides methods to add and remove global event listeners.
 *
 * @module core/dispatcher
 * @exports off
 * @exports on
 * @exports once
 */

import curry from 'ramda/src/curry';

import {Callback} from '../types';

import {getListeners, addListener} from './listeners';

let defaultTarget: Node | null = typeof document === 'object' ? document : null;
let rootId: string;

/*
 * Sets a selector for the default target. If no selector is set, `document` is the default target.
 *
 * @param	{String}	id	Node id of the default target
 *
 * @memberof core/dispatcher
 * @private
 */
const setDefaultTargetById = (id: string) => {
	defaultTarget = typeof document === 'object' && document.querySelector('#' + id) || defaultTarget;
	rootId = id;
};

/*
 * Checks if the default target of `document` exists before returning it, otherwise returns `false`.
 * If the default target is falsy and the stored id of the root exists, it tries to find the
 * default target based on the id.
 *
 * @memberof core/dispatcher
 * @private
 */
const getDefaultTarget = () => {
	if (!defaultTarget && rootId) {
		setDefaultTargetById(rootId);
	}

	return defaultTarget;
};

/*
 * Wraps event callbacks with a try-catch block to prevent unrelated code from blocking.
 *
 * @param	{Event}		ev	Event payload
 * @param	{Function}	fn	Event callback
 *
 * @memberof core/dispatcher
 * @private
 */
const invoker = curry(function (ev: Event, fn: Callback) {
	try {
		fn(ev);
	} catch (e: unknown) {
		if (e instanceof Error) {
			// eslint-disable-next-line no-console
			console.error(`A ${e.name} occurred during event handling with the message '${e.message}'`);
		}
	}
});

/*
 * Dispatches an event to the registered handlers.
 *
 * @param	{Event}		ev	Event payload
 *
 * @memberof core/dispatcher
 * @private
 */
const dispatcher = function (ev: Event): undefined {
	const name = ev.type;
	const target = ev.currentTarget;

	if (target) {
		const listeners = getListeners(target, name);

		if (listeners.length > 0) {
			const inv = invoker(ev);
			listeners.forEach(inv);
		}
	}
};

/**
 * Adds a new global event listener. Duplicate event handlers will be discarded.
 *
 * @param	{String}	name				Event name
 * @param	{Function}	fn					Event handler
 * @param	{Node}		[target='document']	Event listener target
 *
 * @memberof core/dispatcher
 * @public
 */
const on = function (name: string, fn: Callback, target: Node | Window | null = getDefaultTarget()) {
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
 * @param	{String}	name				Event name
 * @param	{Function}	fn					Event handler
 * @param	{Node}		[target=`document`]	Event listener target
 *
 * @memberof core/dispatcher
 * @public
 */
const off = function (name: string, fn: Callback, target = getDefaultTarget()) {
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
 * @param	{String}	name		Event name
 * @param	{Function}	fn			Event handler
 * @param	{Node}		[target]	Event listener target
 *
 * @returns {Function}				The single-use handler. To remove the handler manually, call
 *									the `off()` function with this as the 2nd parameter.
 * @memberof core/dispatcher
 * @public
 */
const once = function (name: string, fn: Callback, target: Node): Callback {
	const onceFn = function (ev: Event) {
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
