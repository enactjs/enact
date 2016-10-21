import R from 'ramda';

/**
 * Accepts an object of computed property configurations and a property object, passes the property
 * object through each computed property handler, and merges the resulting computed properties with
 * the original properties.
 *
 * ```
 * const cfg = {
 *   sum: ({x,y,z}) => x+y+z,
 *   product: ({x,y,z}) => x*y*z
 * }
 * const props = {
 *   x: 2,
 *   y: 3,
 *   z: 4
 * }
 * computed(cfg)(props) // => {x: 2, y: 3, z: 4, sum: 9, product: 24}
 * ```
 *
 * Can also be used to generate or alter handlers by returning a function.
 *
 * ```
 * const cfg = {
 *	handleClick: (props) => (e) => props.onChange(e.value)
 * }
 * ```
 *
 * @method computed
 * @param {Object} cfg Configuration object mapping transformation functions to property names
 * @param {Object} props Render props
 * @returns {Function} Function accepting props and returning update props with computed properties
 * @public
 */
const computed = (cfg, props, ...args) => {
	const keys = Object.keys(cfg);
	const updated = {};
	for (let i = keys.length - 1; i >= 0; i--) {
		updated[keys[i]] = cfg[keys[i]](props, ...args);
	}

	return Object.assign(props, updated);
};

// Reducer to chain computed property transformations
const reduceComputed = R.reduce((acc, v) => R.assoc(v[0], v[1](acc), acc));

/**
 * Alternate implementation that passes the altered props to each computed handler so computed props
 * can be built on other computed props.
 *
 * ```
 * const cfg = {
 *   sum: ({x,y,z}) => x+y+z,
 *   doubleSum: ({sum}) => sum * 2
 * }
 * const props = {
 *   x: 2,
 *   y: 3,
 *   z: 4
 * }
 * computed(cfg)(props) // => {x: 2, y: 3, z: 4, sum: 9, doubleSum: 18}
 * ```
 *
 * @method computedChain
 * @param {Object} cfg Configuration object mapping transformation functions to property names
 * @returns {Function} Function accepting props and returning update props with computed properties
 * @public
 */
const computedChain = R.useWith(R.flip(reduceComputed), [R.toPairs, R.identity]);

export default computed;
export {computed, computedChain};
