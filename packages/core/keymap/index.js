/**
 * Manages a map of names to key codes to simplify event handlers
 *
 * @example
 * ```
 * import {add, is} from '@enact/core/keymap';
 *
 * add('enter', 13);
 * const isEnter = is('enter');
 *
 * // within event handler
 * if (isEnter(ev.keyCode)) {
 *   // handle enter
 * }
 * ```
 *
 * @module core/keymap
 * @exports add
 * @exports addAll
 * @exports is
 * @exports remove
 * @exports removeAll
 */

// keymap uses a singleton object, map, to manage the keymap. since webpack may make multiple copies
// of the module available if the import path is different, we ensure a consistent import path for
// the singleton instance by facading it with this module.

import {addAll} from './keymap';

// Add the default 5-way navigation key codes
addAll({
	enter: [13, 16777221],
	left: 37,
	up: 38,
	right: 39,
	down: 40,
	pageUp: 33,
	pageDown: 34
});

export * from './keymap';
