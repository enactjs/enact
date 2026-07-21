/**
 * Minimal functional programming utilities to replace ramda.
 *
 * @module ui/internal/fp
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

	Object.defineProperty(curried, 'length', {value: arity});
	return curried;
}

/**
 * Composes functions from right to left.
 *
 * @param {...Function} fns The functions to compose
 * @returns {Function} The composed function
 * @private
 */
function compose (...fns) {
	return function (...args) {
		let result = fns[fns.length - 1].apply(this, args);
		for (let i = fns.length - 2; i >= 0; i--) {
			result = fns[i](result);
		}
		return result;
	};
}

/**
 * Restricts a number to be within a range. Auto-curried to support partial application.
 *
 * @param {Number} min The minimum value
 * @param {Number} max The maximum value
 * @param {Number} value The value to clamp
 * @returns {Number|Function} The clamped value, or a partially applied function
 * @private
 */
function clamp (min, max, value) {
	if (arguments.length === 2) {
		return (v) => {
			if (v < min) return min;
			if (v > max) return max;
			return v;
		};
	}
	if (value < min) return min;
	if (value > max) return max;
	return value;
}

/**
 * Returns a new object containing only the specified keys.
 *
 * @param {String[]} keys The keys to pick
 * @param {Object} obj The source object
 * @returns {Object} A new object with only the specified keys
 * @private
 */
function pick (keys, obj) {
	const result = {};
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		if (key in obj) {
			result[key] = obj[key];
		}
	}
	return result;
}

/**
 * Performs a deep equality comparison between two values.
 *
 * @param {*} a First value
 * @param {*} b Second value
 * @returns {Boolean} Whether the values are deeply equal
 * @private
 */
function equals (a, b) {
	if (a === b) return true;
	if (a == null || b == null) return a === b;
	if (typeof a !== typeof b) return false;

	if (Array.isArray(a)) {
		if (!Array.isArray(b) || a.length !== b.length) return false;
		for (let i = 0; i < a.length; i++) {
			if (!equals(a[i], b[i])) return false;
		}
		return true;
	}

	if (typeof a === 'object') {
		const keysA = Object.keys(a);
		const keysB = Object.keys(b);
		if (keysA.length !== keysB.length) return false;
		for (let i = 0; i < keysA.length; i++) {
			const key = keysA[i];
			if (!Object.prototype.hasOwnProperty.call(b, key) || !equals(a[key], b[key])) {
				return false;
			}
		}
		return true;
	}

	return false;
}

/**
 * Returns the complement (logical negation) of a predicate function.
 *
 * @param {Function} fn The predicate function
 * @returns {Function} A function that returns the negation of fn
 * @private
 */
function complement (fn) {
	return function (...args) {
		return !fn.apply(this, args);
	};
}

/**
 * Identity function - returns its argument unchanged.
 *
 * @param {*} x The value
 * @returns {*} The same value
 * @private
 */
function identity (x) {
	return x;
}

/**
 * Returns the value of a named property of an object.
 *
 * @param {String} key The property name
 * @param {Object} obj The object
 * @returns {*} The property value
 * @private
 */
function prop (key, obj) {
	if (arguments.length === 1) {
		return (o) => o[key];
	}
	return obj[key];
}

/**
 * Returns true if the specified object property is equal to the given value.
 *
 * @param {String} key The property name
 * @param {*} val The value to compare against
 * @param {Object} obj The object to check
 * @returns {Boolean|Function} Whether the property equals the value, or a partially applied function
 * @private
 */
function propEq (key, val, obj) {
	if (arguments.length === 2) {
		return (o) => o[key] === val;
	}
	return obj[key] === val;
}

/**
 * Returns true if two values are equal after applying a function to both.
 *
 * @param {Function} fn The function to apply
 * @param {*} a First value
 * @param {*} b Second value
 * @returns {Boolean|Function} Whether fn(a) equals fn(b)
 * @private
 */
function eqBy (fn, a, b) {
	if (arguments.length === 1) {
		return (_a, _b) => equals(fn(_a), fn(_b));
	}
	if (arguments.length === 2) {
		return (_b) => equals(fn(a), fn(_b));
	}
	return equals(fn(a), fn(b));
}

/**
 * Returns the index of the first element that satisfies the predicate.
 *
 * @param {Function} pred The predicate function
 * @param {Array} arr The array to search
 * @returns {Number} The index, or -1 if not found
 * @private
 */
function findIndex (pred, arr) {
	if (arguments.length === 1) {
		return (_arr) => _arr.findIndex(pred);
	}
	return arr.findIndex(pred);
}

/**
 * Removes elements from an array starting at index.
 *
 * @param {Number} start The start index
 * @param {Number} count The number of elements to remove
 * @param {Array} arr The array
 * @returns {Array} A new array with elements removed
 * @private
 */
function remove (start, count, arr) {
	const result = arr.slice();
	result.splice(start, count);
	return result;
}

/**
 * Returns a union of two arrays, using the provided function to determine equality.
 *
 * @param {Function} eqFn Equality function returning boolean
 * @param {Array} a First array
 * @param {Array} b Second array
 * @returns {Array|Function} The union, or a partially applied function
 * @private
 */
function unionWith (eqFn, a, b) {
	if (arguments.length === 1) {
		return (_a, _b) => {
			if (arguments.length === 1) {
				return (__b) => _unionWith(eqFn, _a, __b);
			}
			return _unionWith(eqFn, _a, _b);
		};
	}
	if (arguments.length === 2) {
		return (_b) => _unionWith(eqFn, a, _b);
	}
	return _unionWith(eqFn, a, b);
}

function _unionWith (eqFn, a, b) {
	const result = a.slice();
	for (let i = 0; i < b.length; i++) {
		const item = b[i];
		let found = false;
		for (let j = 0; j < result.length; j++) {
			if (eqFn(item, result[j])) {
				found = true;
				break;
			}
		}
		if (!found) {
			result.push(item);
		}
	}
	return result;
}

/**
 * Accepts a function and a list of transformer functions, applying the
 * corresponding transformer to each argument before passing to the main function.
 *
 * @param {Function} fn The main function
 * @param {Function[]} transformers The transformer functions
 * @returns {Function} The composed function
 * @private
 */
function useWith (fn, transformers) {
	return function (...args) {
		const transformedArgs = args.map((arg, i) => {
			return transformers[i] ? transformers[i](arg) : arg;
		});
		return fn.apply(this, transformedArgs);
	};
}

export {
	clamp,
	complement,
	compose,
	curry,
	eqBy,
	equals,
	findIndex,
	identity,
	pick,
	prop,
	propEq,
	remove,
	unionWith,
	useWith
};
