/**
 * Checks if the virtual keyboard is visible (only works on SmartTV platform)
 * @returns {Boolean} Whether or not the virtual keyboard is displaying
 */
const isShowing = () => window.PalmSystem && window.PalmSystem.isKeyboardVisible;

export {isShowing};
