/**
 * Merges the local components object and an author-supplied object from the config options.
 * When both exist, the author components are used instead of the local components.
 * This is typically used to inject replacement components from themes into deeper layers of the
 * framework.
 *
 * @param	{Object}	[localComponents]	The available components to be overridden
 * @param	{Object}	[authorComponents]	The components to be used instead
 * @returns	{Object}						Combined object of all components
 * @private
 */
const feature = function (localComponents, authorComponents) {
	if (authorComponents) {
		return Object.assign({}, localComponents, authorComponents);
	}
	return localComponents;
};

export default feature;
export {feature};
