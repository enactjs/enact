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
	down: 40
});

// Add other generic keys except for default 5-way key codes
addAll({
	pageUp: 33,
	pageDown: 34
});

export * from './keymap';
