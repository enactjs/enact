import {getCurrent, isPaused} from '@enact/spotlight';

const useEventTouch = ({}, {}, dependencies) => {
	/*
	 * Dependencies
	 */

	const {
		isScrollButtonFocused
	} = dependencies;

	/*
	 * Functions
	 */

	function handleTouchStart () {
		const focusedItem = getCurrent();

		if (!isPaused() && focusedItem && !isScrollButtonFocused()) {
			focusedItem.blur();
		}
	}

	/*
	 * Return
	 */

	return {
		handleTouchStart
	};
};

export default useEventTouch;
export {
	useEventTouch
};
