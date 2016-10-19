/**
 * Provides methods to add and remove global event listeners
 *
 * @module @enact/moonstone/Cancelable/dispatcher
 */

const events = {};

const dispatcher = function (ev) {
	const name = ev.type;
	const listeners = events[name];

	if (listeners) {
		listeners.forEach((fn) => fn(ev));
	}
};

/**
 * Adds a new global event listener
 *
 * @param  {String}   name Event name
 * @param  {Function} fn   Event handler
 *
 * @returns {undefined}
 */
const on = function (name, fn) {
	let listeners = events[name];

	if (!listeners) {
		listeners = events[name] = [];
	}

	listeners.push(fn);
	if (listeners.length === 1) {
		document.addEventListener(name, dispatcher);
	}
};

/**
 * Removes a global event listener
 *
 * @param  {String}   name Event name
 * @param  {Function} fn   Event handler
 *
 * @returns {undefined}
 */
const off = function (name, fn) {
	const listeners = events[name];

	if (listeners) {
		const index = listeners.indexOf(fn);

		if (index >= 0) {
			listeners.splice(index, 1);
			if (listeners.length === 0) {
				document.removeEventListener(name, dispatcher);
			}
		}
	}
};

export {on, off};
