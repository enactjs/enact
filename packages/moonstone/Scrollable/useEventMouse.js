import Spotlight from '@enact/spotlight';

const useEventMouse = (props, instances, context) => {
	const {childAdapter, uiScrollableAdapter} = instances;
	const {isScrollButtonFocused, type} = context;

	// Functions

	function handleFlick ({direction}) {
		const
			{canScrollHorizontally, canScrollVertically} = uiScrollableAdapter.current,
			bounds = uiScrollableAdapter.current.getScrollBounds(),
			focusedItem = Spotlight.getCurrent();

		if (focusedItem) {
			focusedItem.blur();
		}

		if ((
			direction === 'vertical' && canScrollVertically(bounds) ||
			direction === 'horizontal' && canScrollHorizontally(bounds)
		) && !props['data-spotlight-container-disabled']) {
			childAdapter.current.setContainerDisabled(true);
		}
	}

	function handleMouseDown (ev) {
		if (isScrollButtonFocused()) {
			ev.preventDefault();
		}

		if (props['data-spotlight-container-disabled']) {
			ev.preventDefault();
		} else if (type === 'Native') {
			childAdapter.current.setContainerDisabled(false);
		}
	}

	// Return

	return {
		handleFlick,
		handleMouseDown
	};
};

export default useEventMouse;
export {
	useEventMouse
};
