import either from 'ramda/src/either';

/**
 * Adds an isRequired validator to `validator`
 *
 * @param  {Function} validator Validator to decorate
 *
 * @returns {Function}           `validator` decorated with an `isRequired` function
 */
const withRequired = function (validator) {
	validator.isRequired = function (props, propName, component, ...rest) {
		const value = props[propName];
		if (value == null) {
			if (value === null) {
				return new Error(`${propName} is marked required in ${component} but is null`);
			}
			return new Error(`${propName} is marked required in ${component} but is undefined`);
		}

		return validator(props, propName, component, ...rest);
	};

	return validator;
};

/**
 * Invokes the first validator and returns its error if it fails. If not, invokes the second
 * validator returning its result
 *
 * @param {Function} first Validator function
 * @param {Function} second Validator function
 *
 * @returns {Error|undefined} An Error if the validation failed
 * @method
 */
const extendPropType = either;

export {
	withRequired,
	extendPropType
};
