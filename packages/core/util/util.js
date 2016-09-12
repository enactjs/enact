import R from 'ramda';

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
export const coerceFunction = R.unless(R.is(Function), R.always);

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
export const coerceArray = R.unless(R.isArrayLike, R.of);

/**
 * Loosely determines if `tag` is a renderable component (either a string or a function)
 *
 * @param  {*}  tag Component to tes
 *
 * @returns {Boolean} `true` if `tag` is renderable
 */
export const isRenderable = function (tag) {
	const type = typeof tag;
	return type === 'function' || type === 'string';
};
