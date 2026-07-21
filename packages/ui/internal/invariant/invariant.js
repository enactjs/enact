/**
 * A minimal invariant implementation that replaces the `invariant` npm package.
 *
 * Throws an error when the condition is falsy.
 * In production, throws a generic error. In development, throws the provided message.
 *
 * @module ui/internal/invariant
 * @param {Boolean} condition The condition to check - error is thrown when this is falsy
 * @param {String} message The error message to display
 * @param {...*} args Additional arguments for string formatting
 * @private
 */
function invariant (condition, message, ...args) {
	if (!condition) {
		if (process.env.NODE_ENV === 'production') {
			throw new Error('Invariant violation');
		}

		let formattedMessage = message;
		if (args.length > 0) {
			let index = 0;
			formattedMessage = message.replace(/%s/g, () => args[index++]);
		}

		throw new Error(formattedMessage);
	}
}

export default invariant;
export {invariant};
