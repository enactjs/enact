/**
 * Adds propTypes to a render
 *
 * @param  {Object} cfg propTypes object
 *
 * @returns {Function} Function accepting a render method on which `cfg` will be set as propTypes
 * @method propTypes
 * @private
 */
const propTypes = (cfg, render) => (render.propTypes = cfg);

export default propTypes;
export {propTypes};
