import Spotlight from '@enact/spotlight';
import {useEffect} from 'react';

import scrollbarCss from './Scrollbar.module.less';

const navigableFilter = (elem) => {
	if (
		!Spotlight.getPointerMode() &&
		// ignore containers passed as their id
		typeof elem !== 'string' &&
		elem.classList.contains(scrollbarCss.scrollButton)
	) {
		return false;
	}
};

const useSpotlightConfig = (props) => {
	/*
	 * Dependencies
	 */

	const {'data-spotlight-id': spotlightId, focusableScrollbar} = props;

	/*
	 * Hooks
	 */

	useEffect(() => {
		function configureSpotlight () {
			Spotlight.set(spotlightId, {
				navigableFilter: focusableScrollbar ? null : navigableFilter
			});
		}

		configureSpotlight();
	}, [focusableScrollbar, spotlightId]);
};

export default useSpotlightConfig;
export {
	useSpotlightConfig
};
