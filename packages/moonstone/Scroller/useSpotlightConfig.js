import Spotlight from '@enact/spotlight';
import {useEffect} from 'react';

const useSpotlightConfig = (props, instances) => {
	/*
	 * Dependencies
	 */

	const {scrollAndFocusScrollbarButton, spotlightId} = props;
	const {uiScrollableAdapter} = instances;

	/*
	 * Hooks
	 */

	useEffect(() => {
		function handleLeaveContainer ({direction, target}) {
			const contentsContainer = uiScrollableAdapter.current.containerRef.current;

			// ensure we only scroll to boundary from the contents and not a scroll button which
			// lie outside of uiChildAdapter.current.containerRef but within the spotlight container
			if (contentsContainer && contentsContainer.contains(target)) {
				const
					{scrollBounds: {maxLeft, maxTop}, scrollPos: {left, top}} = uiScrollableAdapter.current,
					isVerticalDirection = (direction === 'up' || direction === 'down'),
					pos = isVerticalDirection ? top : left,
					max = isVerticalDirection ? maxTop : maxLeft;

				// If max is equal to 0, it means scroller can not scroll to the direction.
				if (pos >= 0 && pos <= max && max !== 0) {
					scrollAndFocusScrollbarButton(direction);
				}
			}
		}

		function configureSpotlight () {
			Spotlight.set(spotlightId, {
				onLeaveContainer: handleLeaveContainer,
				onLeaveContainerFail: handleLeaveContainer
			});
		}

		configureSpotlight();
	}, [scrollAndFocusScrollbarButton, spotlightId, uiScrollableAdapter]);
};

export default useSpotlightConfig;
export {
	useSpotlightConfig
};
