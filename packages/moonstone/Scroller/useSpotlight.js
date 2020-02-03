import Spotlight from '@enact/spotlight';
import {useEffect} from 'react';

const useSpotlightConfig = (props, instances) => {
	const {uiScrollAdapter} = instances;

	// Hooks

	useEffect(() => {
		function handleLeaveContainer ({direction, target}) {
			// ensure we only scroll to boundary from the contents and not a scroll button which
			// lie outside of uiChildContainerRef but within the spotlight container
			if (props.containsInScrollDangerously(target)) {
				const
					{scrollBounds: {maxLeft, maxTop}, scrollPos: {left, top}} = uiScrollAdapter.current,
					isVerticalDirection = (direction === 'up' || direction === 'down'),
					pos = isVerticalDirection ? top : left,
					max = isVerticalDirection ? maxTop : maxLeft;

				// If max is equal to 0, it means scroller can not scroll to the direction.
				if (pos >= 0 && pos <= max && max !== 0) {
					props.scrollAndFocusScrollbarButton(direction);
				}
			}
		}

		function configureSpotlight () {
			Spotlight.set(props.spotlightId, {
				onLeaveContainer: handleLeaveContainer,
				onLeaveContainerFail: handleLeaveContainer
			});
		}

		configureSpotlight();
	}, [props, uiScrollAdapter]);
};

export {
	useSpotlightConfig
};
