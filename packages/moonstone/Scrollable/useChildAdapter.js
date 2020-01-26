import {useRef} from 'react';

const useChildAdapter = () => {
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

    const setChildAdapter = (adapter) => {
		childAdapter.current = adapter;
	}

    return [childAdapter, setChildAdapter];
};

export default useChildAdapter;
