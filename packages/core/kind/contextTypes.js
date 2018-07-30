/**
 * Adds contextTypes to a render
 *
 * @param  {Object} cfg contextTypes object
 *
 * @returns {Function} Function accepting a render method on which `cfg` will be set as contextTypes
 * @method contextTypes
 * @private
 */
const contextTypes = (cfg, render) => (render.contextTypes = cfg);

export default contextTypes;
export {contextTypes};
