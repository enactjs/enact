/**
 * A minimal warning implementation that replaces the `warning` npm package.
 *
 * Prints a warning message to the console when the condition is falsy.
 * Only emits warnings in development mode.
 *
 * @param {Boolean} condition The condition to check - warning is printed when this is falsy
 * @param {String} message The warning message to display
 * @private
 */
function warning (condition, message) {
	if (process.env.NODE_ENV === 'production') {
		return;
	}

	if (!condition) {
		if (typeof console !== 'undefined' && typeof console.warn === 'function') {
			console.warn(message);	// eslint-disable-line no-console
		}
	}
}

export default warning;
export {warning};
