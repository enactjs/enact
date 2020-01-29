import {useRef} from 'react';

const useScrollableAdapter = () => {
	// Mutable value

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
		stop: null,
		wheelDirection: null
	});

	// Functions

	const setScrollableAdapter = (adapter) => {
		scrollableAdapter.current = adapter;
	};

	// Return

	return [scrollableAdapter, setScrollableAdapter];
};

export default useScrollableAdapter;
export {
	useScrollableAdapter
};
