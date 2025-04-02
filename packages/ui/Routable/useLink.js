import {use, useCallback} from 'react';

import {resolve, RouteContext} from './util';

function useLink () {
	const {path: currentPath, navigate} = use(RouteContext) || {};
	const handleNavigate = useCallback(
		({path}) => {
			if (!navigate) return;

			navigate({
				path: resolve(currentPath, path)
			});
		},
		// omitting currentPath in order to cache the value used a mount time to avoid evaluating
		// relative paths against updated currentPath values
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[navigate]
	);

	return {
		navigate: handleNavigate
	};
}

export default useLink;
export {
	useLink
};
