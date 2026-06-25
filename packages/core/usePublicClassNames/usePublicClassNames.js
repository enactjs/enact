import {useMemo} from 'react';

import {mergeClassNameMaps, normalizePublicClassNames} from '../util';

// Value-based key so inline arrays with the same entries still hit useMemo.
const publicClassNamesMemoKey = (publicClassNames) => (
	Array.isArray(publicClassNames) ? publicClassNames.join('\0') : publicClassNames
);

/**
 * A hook for supporting `publicClassNames` to functional components.
 * It returns merged CSS of given two CSS objects according to `publicClassNames` option.
 *
 * @param   {Object.<string, string>}    [componentCss]     The CSS of the component
 * @param   {Object.<string, string>}    [customCss]        The supplied collection of CSS class names to the
 *                                                          corresponding internal elements and states of the component
 * @param   {Boolean|String|String[]}    [publicClassNames] The keys of public class names of the component
 *                                                          If this value is `true`, all the keys from the component
 *                                                          CSS will become public class names.
 * @returns {Object}                                        A merged CSS
 * @private
 */
function usePublicClassNames ({componentCss, customCss, publicClassNames}) {
	const publicClassNamesKey = publicClassNamesMemoKey(publicClassNames);

	// publicClassNamesKey is a value-based dep so inline arrays with the same entries reuse the memoized map
	return useMemo(() => {
		if (!componentCss || !customCss) {
			return componentCss;
		}

		const allowedClassNames = normalizePublicClassNames(publicClassNames, componentCss);

		if (allowedClassNames) {
			return mergeClassNameMaps(componentCss, customCss, allowedClassNames);
		}

		return componentCss;
		// eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/preserve-manual-memoization
	}, [componentCss, customCss, publicClassNamesKey]);
}

export default usePublicClassNames;
export {
	usePublicClassNames
};
