import {useContext, useEffect} from 'react';

import {SharedState} from '../internal/SharedStateDecorator/SharedStateDecorator';

const useSpotlightRestore = (props, instances) => {
	/*
	 * Dependencies
	 */

	const {id} = props;
	const {uiRef} = instances;

	const context = useContext(SharedState);

	/*
	 * Hooks
	 */

	useEffect(() => {
		// Only intended to be used within componentDidMount, this method will fetch the last stored
		// scroll position from SharedState and scroll (without animation) to that position
		function restoreScrollPosition () {
			if (id && context && context.get) {
				const scrollPosition = context.get(`${id}.scrollPosition`);
				if (scrollPosition) {
					uiRef.current.scrollTo({
						position: scrollPosition,
						animate: false
					});
				}
			}
		}

		restoreScrollPosition();
	}, []);
};

export default useSpotlightRestore;
export {
	useSpotlightRestore
};
