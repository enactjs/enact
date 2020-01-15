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

	const {
		'data-spotlight-id': spotlightId,
		focusableScrollbar,
	} = props;

	/*
	 * useEffects
	 */

	useEffect(() => {
		configureSpotlight();
	}, [spotlightId, focusableScrollbar]);	// TODO : Handle exhaustive-deps ESLint rule.

	/*
	 * Functions
	 */

	function configureSpotlight () {
		Spotlight.set(spotlightId, {
			navigableFilter: focusableScrollbar ? null : navigableFilter
		});
	}
};

export default useSpotlightConfig;
export {
	useSpotlightConfig
};
