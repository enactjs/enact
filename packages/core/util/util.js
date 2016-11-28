import rMap from 'ramda/src/map';
import rProp from 'ramda/src/prop';
import rCompose from 'ramda/src/compose';
import rSort from 'ramda/src/sort';
import rUseWith from 'ramda/src/useWith';
import rEquals from 'ramda/src/equals';
import rUnless from 'ramda/src/unless';
import rIs from 'ramda/src/is';
import rAlways from 'ramda/src/always';
import rIsArrayLike from 'ramda/src/isArrayLike';
import rOf from 'ramda/src/of';
import React from 'react';

const orderedKeys = rMap(rProp('key'));
const unorderedKeys = rCompose(rSort((a, b) => a - b), orderedKeys);
const unorderedEquals = rUseWith(rEquals, [unorderedKeys, unorderedKeys]);
const orderedEquals = rUseWith(rEquals, [orderedKeys, orderedKeys]);

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

		return rEquals(c1, c2);
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
const coerceFunction = rUnless(rIs(Function), rAlways);

/**
 * If `arg` is array-like, return it. Otherwise returns a single element array containing `arg`
 *
 * @example
 *	const returnsArray = coerceArray(0); // [0]
 *	const returnsArg = coerceArray([0]); // [0]
 *	const returnsObjArg = coerceArray({0: 'zeroth', length: 1});
 *
 * @see http://ramdajs.com/docs/#isArrayLike
 * @param {*} arg Array or value
 * @method
 */
const coerceArray = rUnless(rIsArrayLike, rOf);

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
