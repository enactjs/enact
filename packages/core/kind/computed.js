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
 * @method computed
 * @param {Object} cfg Configuration object mapping transformation functions to property names
 * @param {Object} props Render props
 * @returns {Function} Function accepting props and returning update props with computed properties
 * @private
 */
const computed = (cfg, props, ...args) => {
	const keys = Object.keys(cfg);
	const updated = {};
	for (let i = keys.length - 1; i >= 0; i--) {
		updated[keys[i]] = cfg[keys[i]](props, ...args);
	}

	return Object.assign(props, updated);
};

export default computed;
export {computed};
