import {mergeClassNameMaps} from '../util';

/**
 * A hook for supporting `publicClassNames` to functional components.
 * It returns merged CSS of given two CSS objects according to `publicClassNames` option.
 *
 * @param   {Object.<string, string>}    [componentCss]     The CSS of the component
 * @param   {Object.<string, string>}    [customCss]        The supplied collection of CSS class names to the
 *                                                          corresponding internal elements and states of the component
 * @param   {Boolean|String|String[]}    [publicClassNames] The keys of public class names of the component
 *                                                          If this value is `true`, all of the keys from the component
 *                                                          CSS will become public class names.
 * @returns {Object}                                        A merged CSS
 * @private
 */
function usePublicClassNames ({componentCss, customCss, publicClassNames}) {
	let allowedClassNames = publicClassNames;
	let mergedCss = componentCss;

	if (!componentCss || !customCss) {
		return mergedCss;
	}

	if (allowedClassNames === true) {
		allowedClassNames = Object.keys(componentCss);
	} else if (typeof allowedClassNames === 'string') {
		allowedClassNames = allowedClassNames.split(/\s+/);
	}

	// if the config includes a css map, merge them together now
	if (allowedClassNames) {
		mergedCss = mergeClassNameMaps(componentCss, customCss, allowedClassNames);
	}

	return mergedCss;
}

export default usePublicClassNames;
export {
	usePublicClassNames
};
