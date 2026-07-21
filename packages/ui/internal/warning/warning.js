/**
 * A minimal warning implementation that replaces the `warning` npm package.
 *
 * Prints a warning message to the console when the condition is falsy.
 * Only emits warnings in development mode.
 *
 * @module ui/internal/warning
 * @param {Boolean} condition The condition to check - warning is printed when this is falsy
 * @param {String} message The warning message to display
 * @param {...*} args Additional arguments for string formatting
 * @private
 */
function warning (condition, message, ...args) {
	if (process.env.NODE_ENV === 'production') {
		return;
	}

	if (!condition) {
		if (typeof console !== 'undefined' && typeof console.warn === 'function') {
			if (args.length > 0) {
				let index = 0;
				const formatted = message.replace(/%s/g, () => args[index++]);
				console.warn(formatted);	// eslint-disable-line no-console
			} else {
				console.warn(message);	// eslint-disable-line no-console
			}
		}
	}
}

export default warning;
export {warning};
