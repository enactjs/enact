import always from 'ramda/src/always';
import compose from 'ramda/src/compose';
import equals from 'ramda/src/equals';
import isArrayLike from 'ramda/src/isArrayLike';
import isType from 'ramda/src/is';
import map from 'ramda/src/map';
import prop from 'ramda/src/prop';
import React from 'react';
import sort from 'ramda/src/sort';
import unless from 'ramda/src/unless';
import useWith from 'ramda/src/useWith';

const orderedKeys = map(prop('key'));
const unorderedKeys = compose(sort((a, b) => a - b), orderedKeys);
const unorderedEquals = useWith(equals, [unorderedKeys, unorderedKeys]);
const orderedEquals = useWith(equals, [orderedKeys, orderedKeys]);

/**
 * Compares the keys of two sets of children and returns `true` if they are equal.
 *
 * @param  {Node[]}		prev		Array of children
 * @param  {Node[]}		next		Array of children
 * @param  {Boolean}	[ordered]	`true` to require the same order
 *
 * @returns {Boolean}				`true` if the children are the same
 */
const childrenEquals = (prev, next, ordered = false) => {
	const prevChildren = React.Children.toArray(prev);
	const nextChildren = React.Children.toArray(next);

	if (prevChildren.length !== nextChildren.length) {
		return false;
	} else if (prevChildren.length === 1 && nextChildren.length === 1) {
		const c1 = prevChildren[0];
		const c2 = nextChildren[0];

		return equals(c1, c2);
	} else if (ordered) {
		return orderedEquals(prevChildren, nextChildren);
	} else {
		return unorderedEquals(prevChildren, nextChildren);
	}
};

/**
* Capitalizes a given string.
*
* @param {String} str - The string to capitalize.
* @returns {String} The capitalized string.
* @public
*/
const cap = function (str) {
	return str.slice(0, 1).toUpperCase() + str.slice(1);
};

/**
 * If `arg` is a function, return it. Otherwise returns a function that returns `arg`
 *
 * @example
 *	const returnsZero = coerceFunction(0);
 *	const returnsArg = coerceFunction(() => 0);
 *
 * @param {*} arg Function or value
 * @method
 */
const coerceFunction = unless(isType(Function), always);

/**
 * If `arg` is array-like, return it. Otherwise returns a single element array containing `arg`
 *
 * @example
 *	const returnsArray = coerceArray(0); // [0]
 *	const returnsArg = coerceArray([0]); // [0]
 *	const returnsObjArg = coerceArray({0: 'zeroth', length: 1});
 *
 * @see http://ramdajs.com/docs/#isArrayLike
 * @param {*} array Array or value
 * @returns {Array}	Either `array` or `[array]`
 * @method
 */
const coerceArray = function (array) {
	return isArrayLike(array) ? array : [array];
};

/**
 * Loosely determines if `tag` is a renderable component (either a string or a function)
 *
 * @param  {*}  tag Component to tes
 *
 * @returns {Boolean} `true` if `tag` is renderable
 */
const isRenderable = function (tag) {
	const type = typeof tag;
	return type === 'function' || type === 'string';
};

export {
	cap,
	childrenEquals,
	coerceFunction,
	coerceArray,
	isRenderable
};
