import Spotlight from '@enact/spotlight';
import {useEffect} from 'react';

const useSpotlightConfig = (props, instances) => {
	/*
	 * Dependencies
	 */

	const {scrollAndFocusScrollbarButton, spotlightId} = props;
	const {uiRef} = instances;

	/*
	 * Hooks
	 */

	useEffect(() => {
		function handleLeaveContainer ({direction, target}) {
			const contentsContainer = uiRef.current.containerRef.current;

			// ensure we only scroll to boundary from the contents and not a scroll button which
			// lie outside of uiRefCurrent.current.containerRef but within the spotlight container
			if (contentsContainer && contentsContainer.contains(target)) {
				const
					{scrollBounds: {maxLeft, maxTop}, scrollPos: {left, top}} = uiRef.current,
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
	}, [scrollAndFocusScrollbarButton, spotlightId, uiRef]);
};

export default useSpotlightConfig;
export {
	useSpotlightConfig
};
