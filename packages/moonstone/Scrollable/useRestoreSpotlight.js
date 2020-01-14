import {useContext, useEffect} from 'react';

import {SharedState} from '../internal/SharedStateDecorator';

const useRestoreSpotlight = ({}, props, {uiRef}) => {
	const context = useContext(SharedState);

	useEffect(() => {
		restoreScrollPosition();
	}, []);

	// Only intended to be used within componentDidMount, this method will fetch the last stored
	// scroll position from SharedState and scroll (without animation) to that position
	function restoreScrollPosition () {
		const {id} = props;
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

	return {

	};
};

export {
	useRestoreSpotlight
};
