import {use, useCallback} from 'react';

import {resolve, RouteContext, type RouteContextValue} from './util';

function useLink () {
	const {path: currentPath, navigate} = use(RouteContext) || ({} as Partial<RouteContextValue>);
	const handleNavigate = useCallback(
		({path}: {path: string}) => {
			if (!navigate) return;

			navigate({
				path: resolve(currentPath, path) as string
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
