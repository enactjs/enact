/**
 * Minimal functional programming utilities to replace ramda.
 *
 * @module core/internal/fp
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
 * Returns a function that evaluates a list of [predicate, transformer] pairs
 * and returns the result of the first transformer whose predicate returns truthy.
 * Returns undefined if no predicate matches.
 *
 * @param {Array} pairs Array of [predicate, transformer] pairs
 * @returns {Function} A function that applies the pairs logic
 * @private
 */
function cond (pairs) {
	return function (...args) {
		for (let i = 0; i < pairs.length; i++) {
			if (pairs[i][0].apply(this, args)) {
				return pairs[i][1].apply(this, args);
			}
		}
	};
}

/**
 * Deep merges two objects using a custom key-based merge function.
 * The merge function receives (key, leftValue, rightValue) for each key conflict.
 *
 * @param {Function} fn Merge function (key, left, right) => merged
 * @param {Object} left The base object
 * @param {Object} right The override object
 * @returns {Object} The merged object
 * @private
 */
function mergeDeepWithKey (fn, left, right) {
	const result = {};
	const keys = new Set([...Object.keys(left || {}), ...Object.keys(right || {})]);

	keys.forEach((key) => {
		const leftVal = left ? left[key] : undefined; // eslint-disable-line no-undefined
		const rightVal = right ? right[key] : undefined; // eslint-disable-line no-undefined

		if (key in (left || {}) && key in (right || {})) {
			if (
				leftVal && rightVal &&
				typeof leftVal === 'object' && !Array.isArray(leftVal) &&
				typeof rightVal === 'object' && !Array.isArray(rightVal)
			) {
				result[key] = mergeDeepWithKey(fn, leftVal, rightVal);
			} else {
				result[key] = fn(key, leftVal, rightVal);
			}
		} else if (key in (left || {})) {
			result[key] = leftVal;
		} else {
			result[key] = rightVal;
		}
	});

	return result;
}

export {curry, cond, mergeDeepWithKey};
