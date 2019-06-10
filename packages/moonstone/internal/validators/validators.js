/**
 * Exports various utilities for performing dev-time validations
 *
 * @module moonstone/internal/validators
 * @private
 */

/**
 * Issues a warning to the console
 *
 * @function
 * @param {String} msg				Event name
 * @param	{Function}	fn					Event handler
 * @param	{Node}		[target=`document`]	Event listener target
 *
 * @returns {undefined}
 * @memberof moonstone/internal/validators
 * @private
 */
export const warn = (msg) => {
	if (typeof console !== 'undefined') {
		console.warn(msg);	// eslint-disable-line no-console
	}
};

/**
 * Issues a warning to the console if `value` is not within the range
 * `min` to `max` or if `min` is less than `max`. In production mode,
 * no action is taken.
 *
 * @function
 * @param {Number} value The value to validate
 * @param {Number} min   The minimum acceptable value to validate
 * @param {Number} max   The maximum acceptable value to validate
 * @param {String} component The name of the invoker, used to decorate warning message
 * @param {String} [valueName='value'] The name of the value property
 * @param {String} [minName='min'] The name of the min property
 * @param {String} [maxName='max'] The name of the max property
 *
 * @returns {undefined}
 * @memberof moonstone/internal/validators
 * @private
 */
export const validateRange = (value, min, max, component, valueName = '"value"', minName = '"min"', maxName = '"max"') => {
	if (__DEV__) {
		if (value < min) {
			warn(`Warning: ${component} ${valueName} (${value}) less than ${minName} (${min})`);
		} else if (value > max) {
			warn(`Warning: ${component} ${valueName} (${value}) greater than ${maxName} (${max})`);
		}
		if (min > max) {
			warn(`Warning: ${component} ${minName} (${min}) greater than ${maxName} (${max})`);
		}
	}
};

/**
 * Issues a warning to the console if `value`, adjusted for `min` is not evenly
 * divisible by `step`. In production mode, no action is taken.
 *
 * @function
 * @param {Number} value The value to validate
 * @param {Number} min   The minimum acceptable value to validate
 * @param {Number} step  The step
 * @param {String} component The name of the invoker, used to decorate warning message
 * @param {String} [valueName='value'] The name of the value property
 * @param {String} [stepName='step'] The name of the step property
 *
 * @returns {undefined}
 * @memberof moonstone/internal/validators
 * @private
 */
export const validateStepped = (value, min, step, component, valueName = '"value"', stepName = '"step"') => {
	if (__DEV__) {
		if (step && (value - min) % step !== 0) {
			warn(`Warning: ${component} ${valueName} (${value}) must be evenly divisible by ${stepName} (${step})`);
		}
	}
};
