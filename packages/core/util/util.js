/**
 * A collection of utility methods.
 *
 * @module core/util
 * @exports cap
 * @exports coerceArray
 * @exports coerceFunction
 * @exports extractAriaProps
 * @exports isRenderable
 * @exports Job
 * @exports memoize
 * @exports mergeClassNameMaps
 * @exports perfNow
 * @exports withContextFromProps
 */
import always from 'ramda/src/always';
import isType from 'ramda/src/is';
import unless from 'ramda/src/unless';
import withContext from 'recompose/withContext';

import Job from './Job';

/**
 * Capitalizes a given string (not locale-aware).
 *
 * @function
 * @memberof core/util
 * @param   {String}    str   The string to capitalize.
 * @returns {String}          The capitalized string.
 * @public
 */
const cap = function (str) {
	return str.slice(0, 1).toUpperCase() + str.slice(1);
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
 * @memberof core/util
 * @param {*}    arg    Function or value
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
 * @memberof core/util
 * @param {*}    array    Array or value
 * @returns {Array}       Either `array` or `[array]`
 */
const coerceArray = function (array) {
	return Array.isArray(array) ? array : [array];
};

/**
 * Loosely determines if `tag` is a renderable component (either a string or a function).
 *
 * @function
 * @memberof core/util
 * @param {*}    tag    Component to test
 * @returns {Boolean}   `true` if `tag` is either a string or a function
 */
const isRenderable = function (tag) {
	const type = typeof tag;
	return type === 'function' || type === 'string';
};

/**
 * Removes `aria-` prefixed props and the `role` prop from `props` and returns them in a new object.
 * This is useful when redirecting ARIA-related props from a non-focusable root element to a focusable
 * child element.
 *
 * @function
 * @memberof core/util
 * @param   {Object}    props    Props object
 * @returns {Object}             ARIA-related props
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
 * Accepts a `contextTypes` object and a component, then matches those context types with incoming
 * props on the component, and sends them to context on that component for children to to access.
 *
 * Example:
 * ```
 * const contextTypes = {
 * 	alignment: PropTypes.string
 * };
 *
 * const Component = withContextFromProps(contextTypes, BaseBase);
 *
 * // `alignment` will now be available as a context key in `Component`'s children.
 * ```
 *
 * @function
 * @param  {Object}       propsList    Keys to be used as prop->context and their `PropTypes` as keys
 * @param  {Component}    Wrapped      The component that will receive the context
 *
 * @returns {Component}                The component, now with context on it
 * @private
 */
const withContextFromProps = (propsList, Wrapped) => withContext(propsList, (props) => {
	return Object.keys(propsList).reduce((obj, key) => {
		obj[key] = props[key];
		return obj;
	}, {});
})(Wrapped);

/**
 * Gets the current timestamp of either `window.performance.now` or `Date.now`
 *
 * @function
 * @memberof core/util
 * @returns {Number}
 */
const perfNow = function () {
	if (typeof window === 'object') {
		return window.performance.now();
	} else {
		return Date.now();
	}
};

/**
 * Merges two class name maps into one. The resulting map will only contain the class names defined
 * in the `baseMap` and will be appended with the value from `additiveMap` if it exists. Further,
 * `allowedClassNames` may optionally limit which keys will be merged from `additiveMap` into
 * `baseMap`.
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
 * @memberof core/util
 * @param {Object}     baseMap             The source mapping of logical class name to physical
 *                                         class name
 * @param {Object}     additiveMap         Mapping of logical to physical class names which are
 *                                         concatenated with `baseMap` where the logical names match
 * @param {String[]}  [allowedClassNames]  Array of logical class names that can be augmented. When
 *                                         set, the logical class name must exist in `baseMap`,
 *                                         `additiveMap`, and this array to be concatenated.
 * @returns {Object}                       The merged class name map.
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
	}

	return css;
};

/**
 * Creates a function that memoizes the result of `fn`. Note that this function is a naive
 * implementation and only checks the first argument for memoization.
 *
 * @function
 * @memberof core/util
 * @param {Function}    fn    The function to have its output memoized.
 * @returns {Function}        The new memoized function.
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

export {
	cap,
	coerceArray,
	coerceFunction,
	extractAriaProps,
	isRenderable,
	Job,
	memoize,
	mergeClassNameMaps,
	perfNow,
	withContextFromProps
};
