import {useRef} from 'react';

const useChildAdapter = () => {
	// Mutable value

	const childAdapter = useRef({
		calculateMetrics: null,
		didScroll: null,
		dimensionToExtent: null,
		getGridPosition: null,
		getItemBottomPosition: null,
		getItemNode: null,
		getItemPosition: null,
		getMoreInfo: null,
		getNodePosition: null, // For Scroller
		getScrollBounds: null,
		gridPositionToItemPosition: null,
		hasDataSizeChanged: null,
		isHorizontal: null,
		isPrimaryDirectionVertical: null,
		isVertical: null,
		itemPositions: null,
		primary: null,
		props: null,
		scrollPosition: null,
		scrollPositionTarget: null,
		scrollToPosition: null,
		setScrollPosition: null,
		syncClientSize: null
	});

	// Functions

	const setChildAdapter = (adapter) => {
		childAdapter.current = adapter;
	};

	// Return

	return [childAdapter, setChildAdapter];
};

export {
	useChildAdapter
};
