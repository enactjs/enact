import Spotlight from '@enact/spotlight';
import utilDOM from '@enact/ui/Scrollable/utilDOM';
import {useContext, useEffect, useLayoutEffect} from 'react';

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
	// Hooks

	useLayoutEffect(() => {
		function configureSpotlight () {
			Spotlight.set(props['data-spotlight-id'], {
				navigableFilter: props.focusableScrollbar ? null : navigableFilter
			});
		}

		configureSpotlight();
	}, [props]);
};

const useSpotlightRestore = (props, instances) => {
	const {uiScrollAdapter} = instances;
	const context = useContext(SharedState);

	// Hooks

	useEffect(() => {
		// Only intended to be used within componentDidMount, this method will fetch the last stored
		// scroll position from SharedState and scroll (without animation) to that position
		function restoreScrollPosition () {
			const {id} = props;
			if (id && context && context.get) {
				const scrollPosition = context.get(`${id}.scrollPosition`);

				if (scrollPosition) {
					uiScrollAdapter.current.scrollTo({
						position: scrollPosition,
						animate: false
					});
				}
			}
		}

		restoreScrollPosition();
	}, [context, props, uiScrollAdapter]);
};

export {
	useSpotlightConfig,
	useSpotlightRestore
};
