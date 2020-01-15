import {getCurrent} from '@enact/spotlight';

const useEventResizeWindow = () => {
	/*
	 * Functions
	 */

	function handleResizeWindow () {
		const focusedItem = getCurrent();

		if (focusedItem) {
			focusedItem.blur();
		}
	}

	return {
		handleResizeWindow
	};
};

export default useEventResizeWindow;
export {
	useEventResizeWindow
};
