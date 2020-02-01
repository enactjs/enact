import Spotlight from '@enact/spotlight';
import utilDOM from '@enact/ui/Scrollable/utilDOM';
import {useEffect} from 'react';

import {SharedState} from '../internal/SharedStateDecorator/SharedStateDecorator';

import scrollbarCss from './Scrollbar.module.less';

const navigableFilter = (elem) => {
	if (
		!Spotlight.getPointerMode() &&
		// ignore containers passed as their id
		typeof elem !== 'string' &&
		utilDOM.containsDangerously(elem.classList, scrollbarCss.scrollButton)
	) {
		return false;
	}
};

const useSpotlightConfig = (props) => {
	const {'data-spotlight-id': spotlightId, focusableScrollbar} = props;

	// Hooks

	useEffect(() => {
		function configureSpotlight () {
			Spotlight.set(spotlightId, {
				navigableFilter: focusableScrollbar ? null : navigableFilter
			});
		}

		configureSpotlight();
	}, [focusableScrollbar, spotlightId]);
};

const useSpotlightRestore = (props, instances) => {
	const {id} = props;
	const {uiScrollableAdapter} = instances;
	const context = useContext(SharedState);

	// Hooks

	useEffect(() => {
		// Only intended to be used within componentDidMount, this method will fetch the last stored
		// scroll position from SharedState and scroll (without animation) to that position
		function restoreScrollPosition () {
			if (id && context && context.get) {
				const scrollPosition = context.get(`${id}.scrollPosition`);

				if (scrollPosition) {
					uiScrollableAdapter.current.scrollTo({
						position: scrollPosition,
						animate: false
					});
				}
			}
		}

		restoreScrollPosition();
	}, [context, id, uiScrollableAdapter]);
};

export {
	useSpotlightConfig,
	useSpotlightRestore
};
