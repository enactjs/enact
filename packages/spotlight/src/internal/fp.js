/**
 * Minimal functional programming utilities to replace ramda.
 *
 * @module spotlight/internal/fp
 * @private
 */

/**
 * Returns a curried version of the provided function.
 * The returned function will accumulate arguments until the original function's
 * declared arity is met, then invoke it.
 *
 * @param {Function} fn The function to curry
 * @returns {Function} The curried function
 * @private
 */
function curry (fn) {
	const arity = fn.length;

	function curried (...args) {
		if (args.length >= arity) {
			return fn.apply(this, args);
		}
		return (...moreArgs) => curried.apply(this, args.concat(moreArgs));
	}

	// Preserve the original function's length for introspection
	Object.defineProperty(curried, 'length', {value: arity});
	return curried;
}

/**
 * Returns the last element of an array.
 *
 * @param {Array} arr The array
 * @returns {*} The last element
 * @private
 */
function last (arr) {
	if (arr && arr.length > 0) {
		return arr[arr.length - 1];
	}
}

/**
 * Restricts a number to be within a range.
 *
 * @param {Number} min The minimum value
 * @param {Number} max The maximum value
 * @param {Number} value The value to clamp
 * @returns {Number} The clamped value
 * @private
 */
function clamp (min, max, value) {
	if (value < min) return min;
	if (value > max) return max;
	return value;
}

/**
 * Concatenates two arrays.
 *
 * @param {Array} a First array
 * @param {Array} b Second array
 * @returns {Array} The concatenated array
 * @private
 */
function concat (a, b) {
	return a.concat(b);
}

/**
 * Returns the intersection of two arrays.
 *
 * @param {Array} a First array
 * @param {Array} b Second array
 * @returns {Array} Array containing elements present in both arrays
 * @private
 */
function intersection (a, b) {
	const setB = new Set(b);
	return [...new Set(a)].filter(x => setB.has(x));
}

export {curry, last, clamp, concat, intersection};
