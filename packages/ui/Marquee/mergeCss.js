/*
 * Keeps the theme classes from the config and appends app classes from the `css` prop.
 */
const mergeCss = (configCss, instanceCss) => {
	if (!configCss || !instanceCss) return instanceCss || configCss;

	const merged = {...configCss};
	Object.keys(instanceCss).forEach(key => {
		merged[key] = merged[key] ? `${merged[key]} ${instanceCss[key]}` : instanceCss[key];
	});
	return merged;
};

export default mergeCss;
export {
	mergeCss
};
