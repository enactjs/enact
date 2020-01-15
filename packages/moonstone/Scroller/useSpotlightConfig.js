import Spotlight from '@enact/spotlight';
import {useEffect} from 'react';

const useSpotlightConfig = (props, instances) => {
	/*
	 * Dependencies
	 */

	const {
		scrollAndFocusScrollbarButton,
		spotlightId
	} = props;
	const {
		uiRef
	} = instances;

	const contentsContainer = uiRef && containerRef.current || null;

	/*
	 * useEffects
	 */

	useEffect(() => {
		configureSpotlight();
	}, [spotlightId]);	// TODO : Handle exhaustive-deps ESLint rule.

	/*
	 * Functions
	 */

	function handleLeaveContainer ({direction, target}) {
		const {current: {containerRef, scrollBounds: {maxLeft, maxTop}, scrollPos: {left, top}}} = uiRef.current;

		// ensure we only scroll to boundary from the contents and not a scroll button which
		// lie outside of uiRefCurrent.current.containerRef but within the spotlight container
		if (contentsContainer && contentsContainer.contains(target)) {
			const
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
};

export default useSpotlightConfig;
export {
	useSpotlightConfig
};
