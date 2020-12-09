import React from 'react';

import {resolve, RouteContext} from './util';

function useLink () {
	const {path: currentPath, navigate} = React.useContext(RouteContext) || {};
	const handleNavigate = React.useCallback(
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
