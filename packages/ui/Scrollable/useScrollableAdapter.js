import {useRef} from 'react';

const scrollableAdapter = () => {
    const scrollableAdapter = useRef({
		animator: null,
		applyOverscrollEffect: null,
		bounds: null,
		calculateDistanceByWheel: null,
		canScrollHorizontally: null,
		canScrollVertically: null,
		checkAndApplyOverscrollEffect: null,
		getScrollBounds: null,
		isDragging: null,
		isScrollAnimationTargetAccumulated: null,
		isUpdatedScrollThumb: null,
		lastInputType: null,
		rtl: null,
		scrollBounds: null,
		scrollHeight: null,
		scrolling: null,
		scrollLeft: null,
		scrollPos: null,
		scrollTo: null,
		scrollToAccumulatedTarget: null,
		scrollToInfo: null,
		scrollTop: null,
		setOverscrollStatus: null,
		showThumb: null,
		start: null,
        startHidingThumb: null,
        stop,
		wheelDirection: null
	});;

    const setScrollableAdapter = (adapter) => {
		scrollableAdapter.current = adapter;
    }

    return [scrollableAdapter, setScrollableAdapter];
};

export default scrollableAdapter;
