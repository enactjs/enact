import Spotlight from '@enact/spotlight';

const useEventTouch = (props, instnaces, context) => {
	const {isScrollButtonFocused} = context;

	// Functions

	function handleTouchStart () {
		const focusedItem = Spotlight.getCurrent();

		if (!Spotlight.isPaused() && focusedItem && !isScrollButtonFocused()) {
			focusedItem.blur();
		}
	}

	// Return

	return {
		handleTouchStart
	};
};

export default useEventTouch;
export {
	useEventTouch
};
