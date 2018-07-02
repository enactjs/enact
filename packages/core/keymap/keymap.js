import curry from 'ramda/src/curry';

/*
 * The singleton map of names to keyCodes. If a name doesn't have any keyCodes mapped to it, it will
 * not exist in this map. If it does, its value will be an array of its keyCodes.
 *
 * @type {Object}
 * @private
 */
const map = {};

/*
 * Safely converts keymap name to lowercase.
 *
 * @function
 * @param   {String} name  Name for keyCode
 *
 * @returns {String}       Name for keyCode in lowercase
 * @memberof core/keymap
 * @private
 */
const toLowerCase = (name) => name ? name.toLowerCase() : '';

/*
 * Iterates over `set` and invokes `fn` with the key and value of each item.
 *
 * @function
 * @param   {Function}  fn   Function to invoke
 * @param   {Object}    set  A map of names to keyCodes
 *
 * @returns {undefined}
 * @memberof core/keymap
 * @private
 */
const forEachObj = curry(function (fn, set) {
	Object.keys(set).forEach(name => fn(name, set[name]));
});

/*
 * Invokes `fn` with `name` and `keyCode` for each key code provided.
 *
 * @function
 * @param   {Function}        fn       Function to invoke
 * @param   {String}          name     Name for the key codes
 * @param   {Number|Number[]} keyCode  A key code or array of key codes
 *
 * @returns {undefined}
 * @memberof core/keymap
 * @private
 */
const oneOrArray = curry(function (fn, name, keyCode) {
	if (Array.isArray(keyCode)) {
		keyCode.forEach(fn(name));
	} else {
		fn(name, keyCode);
	}
});

/*
 * Adds `keyCode` to `name`.
 *
 * @function
 * @param   {String}    name     Name for the key code
 * @param   {Number}    keyCode  A key code
 *
 * @returns {undefined}
 * @memberof core/keymap
 * @private
 */
const addOne = curry(function (name, keyCode) {
	name = toLowerCase(name);
	if (name in map) {
		const index = map[name].indexOf(keyCode);
		if (index === -1) {
			map[name].push(keyCode);
		}
	} else if (name) {
		map[name] = [keyCode];
	}
});

/*
 * Removes `keyCode` from `name`.
 *
 * @function
 * @param   {String}    name     Name for the key code
 * @param   {Number}    keyCode  A key code
 *
 * @returns {undefined}
 * @memberof core/keymap
 * @private
 */
const removeOne = curry(function (name, keyCode) {
	name = toLowerCase(name);
	if (name in map) {
		const keys = map[name];
		const index = keys.indexOf(keyCode);
		if (index === -1) {
			delete map[name];
		} else {
			keys.splice(index, 1);
		}
	}
});

/**
 * Registers `keyCode` for `name`.
 *
 * @function add
 * @param   {String}          name     Name for the key code
 * @param   {Number|Number[]} keyCode  A key code or array of key codes
 *
 * @returns {undefined}
 * @memberof core/keymap
 * @public
 */
const add = oneOrArray(addOne);

/**
 * Registers a set of key codes.
 *
 * @function addAll
 * @param   {Object}    set  A map of names to keyCodes
 *
 * @returns {undefined}
 * @memberof core/keymap
 * @public
 */
const addAll = forEachObj(add);

/**
 * Unregisters `keyCode` from `name`.
 *
 * @function remove
 * @param   {String}          name     Name for the key code
 * @param   {Number|Number[]} keyCode  A key code or array of key codes
 *
 * @returns {undefined}
 * @memberof core/keymap
 * @public
 */
const remove = oneOrArray(removeOne);

/**
 * Unregisters a set of key codes.
 *
 * @function removeAll
 * @param   {Object}    set  A map of names to keyCodes
 *
 * @returns {undefined}
 * @memberof core/keymap
 * @public
 */
const removeAll = forEachObj(remove);

/**
 * Determines if `keyCode` is mapped to `name`.
 *
 * @function is
 * @param   {String}    name     Name for the key code
 * @param   {Number}    keyCode  A key code
 *
 * @returns {Boolean}            `true` if `keyCode` is mapped to `name`
 * @memberof core/keymap
 * @public
 */
const is = curry(function (name, keyCode) {
	name = toLowerCase(name);
	return name in map && map[name].indexOf(keyCode) >= 0;
});

export {
	add,
	addAll,
	is,
	remove,
	removeAll
};
