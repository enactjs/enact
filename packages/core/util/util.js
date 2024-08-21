/**
 * A collection of utility methods.
 *
 * @module core/util
 * @exports cap
 * @exports clamp
 * @exports coerceArray
 * @exports coerceFunction
 * @exports extractAriaProps
 * @exports isRenderable
 * @exports Job
 * @exports memoize
 * @exports mergeClassNameMaps
 * @exports perfNow
 * @exports mapAndFilterChildren
 * @exports shallowEqual
 */
import always from 'ramda/src/always';
import isType from 'ramda/src/is';
import unless from 'ramda/src/unless';
import {Children} from 'react';
import * as ReactIs from 'react-is';

import Job from './Job';

/**
 * Capitalizes a given string (not locale-aware).
 *
 * @function
 * @param   {String}    str   The string to capitalize.
 *
 * @returns {String}          The capitalized string.
 * @memberof core/util
 * @public
 */
const cap = function (str) {
	return str.slice(0, 1).toUpperCase() + str.slice(1);
};

/**
 * Limits `value` to be between `min` and `max`.
 *
 * If `min` is greater than `max`, `min` is returned.
 *
 * @function
 * @param   {Number}    min   The minimum value of the range
 * @param   {Number}    max   The maximum value of the range
 * @param   {Number}    value The value that must be within the range
 *
 * @returns {Number}          The clamped value
 * @memberof core/util
 * @public
 */
const clamp = (min, max, value) => {
	if (min > max || value < min) return min;
	if (value > max) return max;
	return value;
};

/**
 * If `arg` is a function, return it. Otherwise returns a function that returns `arg`.
 *
 * Example:
 * ```
 *	const returnsZero = coerceFunction(0);
 *	const returnsArg = coerceFunction(() => 0);
 * ```
 * @function
 * @param {*}    arg    Function or value
 *
 * @returns {Function}  Either `arg` if `arg` is a function, or a function that returns `arg`
 * @memberof core/util
 * @public
 */
const coerceFunction = unless(isType(Function), always);

/**
 * If `arg` is array-like, return it. Otherwise returns a single element array containing `arg`.
 *
 * Example:
 * ```
 *	const returnsArray = coerceArray(0); // [0]
 *	const returnsArg = coerceArray([0]); // [0]
 *	const returnsObjArg = coerceArray({0: 'zeroth', length: 1});
 * ```
 * @see http://ramdajs.com/docs/#isArrayLike
 * @function
 * @param {*}    array    Array or value
 *
 * @returns {Array}       Either `array` or `[array]`
 * @memberof core/util
 * @public
 */
const coerceArray = function (array) {
	return Array.isArray(array) ? array : [array];
};

/**
 * Loosely determines if `tag` is a renderable component (either a string or a function).
 *
 * @function
 * @param {*}    tag    Component to test
 *
 * @returns {Boolean}   `true` if `tag` is either a string or a function
 * @memberof core/util
 * @public
 */
const isRenderable = function (tag) {
	return ReactIs.isValidElementType(tag);
};

/**
 * Removes ARIA-related props from `props` and returns them in a new object.
 *
 * Specifically, it removes the `role` prop and any prop prefixed with `aria-`. This is useful when
 * redirecting ARIA-related props from a non-focusable root element to a focusable child element.
 *
 * @function
 * @param   {Object}    props    Props object
 *
 * @returns {Object}             ARIA-related props
 * @memberof core/util
 * @public
 */
const extractAriaProps = function (props) {
	const aria = {};
	Object.keys(props).forEach(key => {
		if (key === 'role' || key.indexOf('aria-') === 0) {
			aria[key] = props[key];
			delete props[key];
		}
	});

	return aria;
};

/**
 * Gets the current timestamp of either `window.performance.now` or `Date.now`
 *
 * @function
 *
 * @returns {Number}                    The timestamp from `window.performance.now` or `Date.now`
 * @memberof core/util
 * @public
 */
/* istanbul ignore next */
const perfNow = function () {
	if (typeof window === 'object') {
		return window.performance.now();
	} else {
		return Date.now();
	}
};

/**
 * Merges two class name maps into one.
 *
 * The resulting map will only contain the class names defined in the `baseMap` and will be appended
 * with the value from `additiveMap` if it exists. Further, `allowedClassNames` may optionally limit
 * which keys will be merged from `additiveMap` into `baseMap`.
 *
 * Example:
 * ```
 * // merges all matching class names from additiveMap1 with baseMap1
 * const newMap1 = mergeClassNameMaps(baseMap1, additiveMap1);
 *
 * // merge only 'a' and 'b' class names from additiveMap2 with baseMap2
 * const newMap2 = mergeClassNameMaps(baseMap2, additiveMap2, ['a', 'b']);
 * ```
 *
 * @function
 * @param {Object}     baseMap             The source mapping of logical class name to physical
 *                                         class name
 * @param {Object}     additiveMap         Mapping of logical to physical class names which are
 *                                         concatenated with `baseMap` where the logical names match
 * @param {String[]}  [allowedClassNames]  Array of logical class names that can be augmented. When
 *                                         set, the logical class name must exist in `baseMap`,
 *                                         `additiveMap`, and this array to be concatenated.
 *
 * @returns {Object}                       The merged class name map.
 * @memberof core/util
 * @public
 */
const mergeClassNameMaps = (baseMap, additiveMap, allowedClassNames) => {
	let css = baseMap;
	if (baseMap && additiveMap) {
		allowedClassNames = allowedClassNames || Object.keys(additiveMap);
		// if the props includes a css map, merge them together now
		css = Object.assign({}, baseMap);
		allowedClassNames.forEach(key => {
			if (baseMap[key] && additiveMap[key]) {
				css[key] = baseMap[key] + ' ' + additiveMap[key];
			}
		});

		if (process.env.NODE_ENV === 'test') {
			return new Proxy({}, {
				get (target, key) {
					// use the merged value if it exists and the key otherwise
					return css[key] || key;
				}
			});
		}
	}

	return css;
};

/**
 * Creates a function that memoizes the result of `fn`.
 *
 * Note that this function is a naive implementation and only checks the first argument for
 * memoization.
 *
 * @function
 * @param {Function}    fn    The function to have its output memoized.
 *
 * @returns {Function}        The new memoized function.
 * @memberof core/util
 * @public
 */
const memoize = (fn) => {
	let cache = {};
	return (...args) => {
		let n = args[0];
		if (n in cache) {
			return cache[n];
		} else {
			let result = fn(...args);
			cache[n] = result;
			return result;
		}
	};
};

/**
 * Maps over the `children`, discarding any `null` children before and after calling the callback.
 *
 * A replacement for `React.Children.map`.
 *
 * @function
 * @param {*}        children  Children to map over
 * @param {Function} callback  Function to apply to each child. Will not be called if the child is
 *                              `null`. If `callback` returns `null`, the child will be removed from
 *                              the result. If `null` is returned, the item will not be included in
 *                              the final output, regardless of the filter function.
 * @param {Function} [filter]  Filter function applied after mapping.
 *
 * @returns {*}                The processed children or the value of `children` if not an array.
 * @memberof core/util
 * @see https://react.dev/reference/react/Children#children-map
 * @public
 */
const mapAndFilterChildren = (children, callback, filter) => {
	const result = Children.map(children, (child, ...rest) => {
		if (child != null) {
			return callback(child, ...rest);
		} else {
			return child;
		}
	});
	if (result && filter) {
		return result.filter(filter);
	} else {
		return result;
	}
};

/**
 * Sets props that are missing or `undefined` to default values
 *
 * @function
 * @param {Obejct}        props           Props object
 * @param {Obejct}        defaultProps    Default value object
 *
 * @returns {Object}                      Props with default values
 * @memberof core/util
 * @public
 */
const setDefaultProps = (props, defaultProps = {}) => {
	const result = Object.assign({}, props);

	for (const prop in defaultProps) {
		// eslint-disable-next-line no-undefined
		if (props[prop] === undefined) {
			result[prop] = defaultProps[prop];
		}
	}

	return result;
};

/**
 * Performs shallow comparison for given objects.
 *
 * @function
 * @param {Obejct}        a    An object to compare.
 * @param {Obejct}        b    An object to compare.
 *
 * @returns {Boolean}          `true` if the values of all keys are strictly equal.
 * @memberof core/util
 * @public
 */
const shallowEqual = (a, b) => {
	if (Object.is(a, b)) {
		return true;
	}

	if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
		return false;
	}

	const aKeys = Object.keys(a);
	const bKeys = Object.keys(b);

	// early bail out if the objects have a different number of keys
	if (aKeys.length !== bKeys.length) {
		return false;
	}

	const hasOwn = Object.prototype.hasOwnProperty.bind(b);
	for (let i = 0; i < aKeys.length; i++) {
		const prop = aKeys[i];
		if (!hasOwn(prop) || !Object.is(a[prop], b[prop])) {
			return false;
		}
	}

	return true;
};

export {
	cap,
	clamp,
	coerceArray,
	coerceFunction,
	extractAriaProps,
	isRenderable,
	Job,
	memoize,
	mergeClassNameMaps,
	perfNow,
	mapAndFilterChildren,
	setDefaultProps,
	shallowEqual
};
