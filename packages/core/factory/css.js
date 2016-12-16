/**
 * Merges the local CSS object and a CSS object from the props. When both exist, the class names are
 * joined with a space.
 *
 * @param	{Object}	[componentCss]	Component class name map
 * @param	{Object}	[authorCss]		Customization class name map
 * @returns	{Object}					Combined class name map
 */
const feature = function (componentCss, authorCss) {
	if (authorCss && componentCss) {
		const css = Object.assign({}, componentCss);
		Object.keys(authorCss).forEach(className => {
			if (componentCss[className]) {
				css[className] = componentCss[className] + ' ' + authorCss[className];
			} else {
				css[className] = authorCss[className];
			}
		});

		return css;
	} else if (authorCss) {
		return Object.assign({}, authorCss);
	}

	return componentCss;
};

export default feature;
export {feature};
