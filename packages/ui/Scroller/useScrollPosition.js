import {useRef} from 'react';

const useScrollPosition = (props, instances, context) => {
	const {uiChildContainerRef} = instances;
	const {getRtlPositionX, isHorizontal, isVertical} = context;

	// Mutable value

	const variables = useRef({
		scrollPos: {
			left: 0,
			top: 0
		}
	});

	// Functions

	// for Scrollable
	function setScrollPosition (x, y) {
		const node = uiChildContainerRef.current;

		if (isVertical()) {
			node.scrollTop = y;
			variables.current.scrollPos.top = y;
		}
		if (isHorizontal()) {
			node.scrollLeft = getRtlPositionX(x);
			variables.current.scrollPos.left = x;
		}
	}

	// for native Scrollable
	function scrollToPosition (x, y) {
		uiChildContainerRef.current.scrollTo(getRtlPositionX(x), y);
	}

	// for native Scrollable
	function didScroll (x, y) {
		variables.current.scrollPos.left = x;
		variables.current.scrollPos.top = y;
	}

	function getScrollPos () {
		return variables.current.scrollPos;
	}

	// Return

	return {
		getScrollPos,
		setScrollPosition,
		scrollToPosition,
		didScroll
	};
};

export default useScrollPosition;
export {
	useScrollPosition
};
