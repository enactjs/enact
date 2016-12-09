// Merges the local CSS object and a CSS object from the props. When both exist, the class names are
// joined with a space
const mergeCss = (componentCss, authorCss) => {
	if (authorCss) {
		const css = Object.assign({}, componentCss);
		Object.keys(authorCss).forEach(className => {
			if (componentCss[className]) {
				css[className] = componentCss[className] + ' ' + authorCss[className];
			} else {
				css[className] = authorCss[className];
			}
		});

		return css;
	}

	return componentCss;
};

const factory = (defaultConfig, fn) => (config) => {
	if (typeof defaultConfig === 'function') {
		return defaultConfig(Object.assign({}, config));
	} else {
		const componentCss = defaultConfig.css;
		const authorCss = config ? config.css : null;
		const css = mergeCss(componentCss, authorCss);

		return fn({css});
	}
};

export default factory;
export {factory};
