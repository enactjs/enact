import {useRef} from 'react';

const useChildAdapter = () => {
	// Mutable value

	const childAdapter = useRef({
		calculatePositionOnFocus: null,
		focusByIndex: null,
		focusOnNode: null,
		getScrollBounds: null,
		setContainerDisabled: null,
		setLastFocusedNode: null,
		shouldPreventOverscrollEffect: null,
		shouldPreventScrollByFocus: null,
		type: null
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
