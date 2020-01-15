import Spotlight from '@enact/spotlight';

const useEventResizeWindow = () => {
	/*
	 * Functions
	 */

	function handleResizeWindow () {
		const focusedItem = Spotlight.getCurrent();

		if (focusedItem) {
			focusedItem.blur();
		}
	}

	/*
	 * Return
	 */

	return {
		handleResizeWindow
	};
};

export default useEventResizeWindow;
export {
	useEventResizeWindow
};
