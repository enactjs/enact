/**
 * Provides a function to check visibility of virtual keyboard.
 *
 * @module webos/keyboard
 * @exports isShowing
 */

/**
 * Checks if the virtual keyboard is visible (only works on SmartTV platform).
 *
 * @function
 * @returns {Boolean} `true` if the virtual keyboard is displaying
 * @memberof webos/keyboard
 * @public
 */
const isShowing = () => {
	const webOSSystem = window.webOSSystem ?? window.PalmSystem;
	return webOSSystem && webOSSystem.isKeyboardVisible;
};

export {
	isShowing
};
