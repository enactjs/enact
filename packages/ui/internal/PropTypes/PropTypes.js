/**
 * Minimal PropTypes validators to replace the `prop-types` npm package.
 * Implements the subset used by @enact/ui components.
 *
 * @module ui/internal/PropTypes
 * @private
 */

/**
 * Wraps a validator function with an `.isRequired` variant.
 *
 * @param {Function} validator The base validator
 * @returns {Function} The validator with `.isRequired` attached
 * @private
 */
function withRequired (validator) {
	validator.isRequired = function (props, propName, componentName) {
		if (props[propName] == null) {
			return new Error(
				`The prop \`${propName}\` is marked as required in \`${componentName}\`, but its value is \`${props[propName]}\`.`
			);
		}
		return validator(props, propName, componentName);
	};
	return validator;
}

/**
 * Creates a type-checking validator for the specified type.
 *
 * @param {String} expectedType The expected typeof result
 * @returns {Function} Validator function
 * @private
 */
function createTypeChecker (expectedType) {
	return withRequired(function (props, propName, componentName) {
		const value = props[propName];
		if (value != null && typeof value !== expectedType) {
			return new Error(
				`Invalid prop \`${propName}\` of type \`${typeof value}\` supplied to \`${componentName}\`, expected \`${expectedType}\`.`
			);
		}
		return null;
	});
}

const PropTypes = {
	bool: createTypeChecker('boolean'),
	func: createTypeChecker('function'),
	number: createTypeChecker('number'),
	string: createTypeChecker('string'),
	object: createTypeChecker('object'),
	symbol: createTypeChecker('symbol'),

	any: withRequired(function () {
		return null;
	}),

	array: withRequired(function (props, propName, componentName) {
		const value = props[propName];
		if (value != null && !Array.isArray(value)) {
			return new Error(
				`Invalid prop \`${propName}\` of type \`${typeof value}\` supplied to \`${componentName}\`, expected an array.`
			);
		}
		return null;
	}),

	node: withRequired(function (props, propName) {
		const value = props[propName];
		if (value == null) return null;
		const type = typeof value;
		if (
			type === 'string' ||
			type === 'number' ||
			type === 'boolean' ||
			Array.isArray(value) ||
			(typeof value === 'object' && value !== null)
		) {
			return null;
		}
		return new Error(
			`Invalid prop \`${propName}\`, expected a ReactNode.`
		);
	}),

	element: withRequired(function (props, propName) {
		const value = props[propName];
		if (value == null) return null;
		if (typeof value === 'object' && value !== null && value.$$typeof) {
			return null;
		}
		return new Error(
			`Invalid prop \`${propName}\`, expected a React element.`
		);
	}),

	instanceOf: (expectedClass) => {
		return withRequired(function (props, propName, componentName) {
			const value = props[propName];
			if (value == null) return null;
			if (!(value instanceof expectedClass)) {
				return new Error(
					`Invalid prop \`${propName}\` supplied to \`${componentName}\`, expected instance of \`${expectedClass.name || 'Unknown'}\`.`
				);
			}
			return null;
		});
	},

	oneOf: (allowedValues) => {
		return withRequired(function (props, propName, componentName) {
			const value = props[propName];
			if (value != null && allowedValues.indexOf(value) === -1) {
				return new Error(
					`Invalid prop \`${propName}\` of value \`${value}\` supplied to \`${componentName}\`, expected one of [${allowedValues.join(', ')}].`
				);
			}
			return null;
		});
	},

	oneOfType: (typeCheckers) => {
		return withRequired(function (props, propName, componentName) {
			const value = props[propName];
			if (value == null) return null;
			for (let i = 0; i < typeCheckers.length; i++) {
				const checker = typeCheckers[i];
				if (typeof checker === 'function') {
					const error = checker(props, propName, componentName);
					if (!error) return null;
				}
			}
			return new Error(
				`Invalid prop \`${propName}\` supplied to \`${componentName}\`, none of the types matched.`
			);
		});
	},

	arrayOf: (typeChecker) => {
		return withRequired(function (props, propName, componentName) {
			const value = props[propName];
			if (value == null) return null;
			if (!Array.isArray(value)) {
				return new Error(
					`Invalid prop \`${propName}\` of type \`${typeof value}\` supplied to \`${componentName}\`, expected an array.`
				);
			}
			for (let i = 0; i < value.length; i++) {
				const itemProps = {[propName]: value[i]};
				const error = typeChecker(itemProps, propName, componentName);
				if (error) {
					return new Error(
						`Invalid prop \`${propName}[${i}]\` supplied to \`${componentName}\`: ${error.message}`
					);
				}
			}
			return null;
		});
	},

	objectOf: (typeChecker) => {
		return withRequired(function (props, propName, componentName) {
			const value = props[propName];
			if (value == null) return null;
			if (typeof value !== 'object' || Array.isArray(value)) {
				return new Error(
					`Invalid prop \`${propName}\` of type \`${typeof value}\` supplied to \`${componentName}\`, expected an object.`
				);
			}
			const keys = Object.keys(value);
			for (let i = 0; i < keys.length; i++) {
				const itemProps = {[propName]: value[keys[i]]};
				const error = typeChecker(itemProps, propName, componentName);
				if (error) return error;
			}
			return null;
		});
	},

	shape: (shapeTypes) => {
		return withRequired(function (props, propName, componentName) {
			const value = props[propName];
			if (value == null) return null;
			if (typeof value !== 'object') {
				return new Error(
					`Invalid prop \`${propName}\` of type \`${typeof value}\` supplied to \`${componentName}\`, expected an object.`
				);
			}
			const keys = Object.keys(shapeTypes);
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];
				const checker = shapeTypes[key];
				if (typeof checker === 'function') {
					const error = checker(value, key, `${componentName}.${propName}`);
					if (error) return error;
				}
			}
			return null;
		});
	}
};

export default PropTypes;
export {PropTypes};
