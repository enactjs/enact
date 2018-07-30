/**
 * Adds default props to a render
 *
 * @param  {Object} cfg Default properties object
 *
 * @returns {Function} Function accepting a render method on which `cfg` will be set as defaultProps
 * @method defaultProps
 * @private
 */
const defaultProps = (cfg, render) => (render.defaultProps = cfg);

export default defaultProps;
export {defaultProps};
