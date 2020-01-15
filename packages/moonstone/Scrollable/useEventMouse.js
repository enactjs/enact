const useEventMouse = ({}, instances, dependencies) => {
	/*
	 * Dependencies
	 */

	const {uiRef} = instances;
	const {canScrollHorizontally, canScrollVertically} = (uiRef.current || {});
	const {type} = dependencies;

	/*
	 * Functions
	 */

	function handleFlick ({direction}) {
		const bounds = uiRef.current.getScrollBounds();
		const focusedItem = Spotlight.getCurrent();

		if (focusedItem) {
			focusedItem.blur();
		}

		if ((
			direction === 'vertical' && canScrollVertically(bounds) ||
			direction === 'horizontal' && canScrollHorizontally(bounds)
		) && !props['data-spotlight-container-disabled']) {
			childRef.current.setContainerDisabled(true);
		}
	}

	function handleMouseDown (ev) {
		if (isScrollButtonFocused()) {
			ev.preventDefault();
		}

		if (props['data-spotlight-container-disabled']) {
			ev.preventDefault();
		} else if (type === 'Native') {
			this.childRef.current.setContainerDisabled(false);
		}
	}

	/*
	 * Return
	 */

	return {
		handleFlick,
		handleMouseDown
	};
};

export default useEventMouse;
export {
	useEventMouse
};
