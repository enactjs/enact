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

const useSpotlightConfig = ({}, props) => {
	const {
		'data-spotlight-id': spotlightId,
		focusableScrollbar,
	} = props;

	// useEffects

	useEffect(() => {
		configureSpotlight(props, focusableScrollbar);
	}, [spotlightId, focusableScrollbar]);	// TODO : Handle exhaustive-deps ESLint rule.

	// functions

	function configureSpotlight ({'data-spotlight-id': spotlightId, focusableScrollbar}) {
		Spotlight.set(spotlightId, {
			navigableFilter: focusableScrollbar ? null : navigableFilter
		});
	}
}

export {
	useSpotlightConfig
};
