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
 * @param   {Object}    cfg  Configuration object mapping transformation functions to property names
 *
 * @returns {Function}       Function that accepts a props object and mutates it to include the
 *                           computed props
 * @private
 */
const computed = (cfg, optProps) => {
	const keys = Object.keys(cfg);

	const renderComputed = (props, ...args) => {
		const updated = {};
		for (let i = keys.length - 1; i >= 0; i--) {
			updated[keys[i]] = cfg[keys[i]](props, ...args);
		}

		return Object.assign(props, updated);
	};

	// maintain compatibility with 1.x
	if (optProps) {
		return renderComputed(optProps);
	}

	return renderComputed;
};

export default computed;
export {computed};
