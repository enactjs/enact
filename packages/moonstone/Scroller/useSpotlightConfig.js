import Spotlight from '@enact/spotlight';
import {useEffect} from 'react';

const useSpotlightConfig = (props, instances) => {
	const {dangerouslyContainsInScrollable, scrollAndFocusScrollbarButton, spotlightId} = props;
	const {uiChildAdapter} = instances;

	// Hooks

	useEffect(() => {
		function handleLeaveContainer ({direction, target}) {
			// ensure we only scroll to boundary from the contents and not a scroll button which
			// lie outside of uiChildContainerRef but within the spotlight container
			if (dangerouslyContainsInScrollable(target)) {
				const
					{scrollBounds: {maxLeft, maxTop}, scrollPos: {left, top}} = uiChildAdapter.current,
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
	}, [dangerouslyContainsInScrollable, scrollAndFocusScrollbarButton, spotlightId, uiChildAdapter]);
};

export default useSpotlightConfig;
export {
	useSpotlightConfig
};
