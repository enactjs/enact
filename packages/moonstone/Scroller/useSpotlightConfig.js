import Spotlight from '@enact/spotlight';
import {useEffect} from 'react';

const useSpotlightConfig = (instance, props) => {
    const {
        uiRefCurrent
    } = instance.current;
    const {
        scrollAndFocusScrollbarButton,
        spotlightId
    } = props;

    const contentsContainer = uiRefCurrent && uiRefCurrent.containerRef.current || null;

    // componentDidUpdate
    useEffect(() => {
        configureSpotlight();
    }, [spotlightId]);	// TODO : Handle exhaustive-deps ESLint rule.

    function handleLeaveContainer ({direction, target}) {
		// ensure we only scroll to boundary from the contents and not a scroll button which
		// lie outside of uiRefCurrent.current.containerRef but within the spotlight container
		if (contentsContainer && contentsContainer.contains(target)) {
			const
				{scrollBounds: {maxLeft, maxTop}, scrollPos: {left, top}} = uiRefCurrent,
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

export {
    useSpotlightConfig
};
