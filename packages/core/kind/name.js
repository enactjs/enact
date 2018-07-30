/**
 * Adds displayName to a render
 *
 * @param  {Object} displayName Name of component
 *
 * @returns {Function} Function accepting a render method on which `displayName` will be set as
 *	displayName
 * @method name
 * @private
 */
const name = (displayName, render) => {
	render.displayName = displayName;
};

export default name;
export {name};
