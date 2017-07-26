/**
 * Merges the local CSS object and a CSS object from the props. When both exist, the class names are
 * joined with a space.
 *
 * @param	{Object}	[componentCss]	Component class name map
 * @param	{Object}	[authorCss]		Customization class name map
 * @returns	{Object}					Combined class name map
 * @private
 */
const feature = function (componentCss, authorCss) {
	if (authorCss && componentCss) {
		const css = Object.assign({}, componentCss);
		Object.keys(authorCss).forEach(className => {
			if (componentCss[className]) {
				css[className] = componentCss[className] + ' ' + authorCss[className];
			}
			//
			// DEV-NOTE: Removing this piece of the `if` statement requires that all classes used
			// on the component be `declared` in the componentCss file, even if they are empty.
			// Without them being defined ahead of time, the override (authorCSS) will not attach
			// to those class slots (or global className strings).
			//
			// } else {
			// 	css[className] = authorCss[className];
			// }
		});

		return css;
	} else if (authorCss) {
		return Object.assign({}, authorCss);
	}

	return componentCss;
};

export default feature;
export {feature};
