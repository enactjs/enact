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
 * @returns {Boolean} Whether or not the virtual keyboard is displaying
 * @memberof webos/keyboard
 * @public
 */
const isShowing = () => window.PalmSystem && window.PalmSystem.isKeyboardVisible;

export {
	isShowing
};
