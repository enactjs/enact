import Spotlight from '@enact/spotlight';

const utilEventResizeWindow = () => {
	// Functions

	function handleResizeWindow () {
		const focusedItem = Spotlight.getCurrent();

		if (focusedItem) {
			focusedItem.blur();
		}
	}

	// Return

	return {
		handleResizeWindow
	};
};

export default utilEventResizeWindow;
export {
	utilEventResizeWindow
};
