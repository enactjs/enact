/**
 * A minimal invariant implementation that replaces the `invariant` npm package.
 *
 * Throws an error with the provided message when the condition is falsy.
 * In production builds (when `__DEV__` is false or process.env.NODE_ENV is 'production'),
 * a generic error is thrown without the message to reduce bundle size.
 *
 * @param {Boolean} condition The condition to assert
 * @param {String} message The error message to display when condition is falsy
 * @throws {Error} Throws when condition is falsy
 * @private
 */
function invariant (condition, message) {
	if (!condition) {
		const error = new Error(
			typeof __DEV__ !== 'undefined' && !__DEV__
				? 'Invariant Violation'
				: message || 'Invariant Violation'
		);
		error.name = 'Invariant Violation';
		throw error;
	}
}

export default invariant;
export {invariant};
