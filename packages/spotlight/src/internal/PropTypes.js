/**
 * Minimal PropTypes validators to replace the `prop-types` npm package.
 * Only the subset used by spotlight is implemented.
 *
 * @module spotlight/internal/PropTypes
 * @private
 */

const PropTypes = {
	bool: function (props, propName, componentName) {
		const value = props[propName];
		if (value != null && typeof value !== 'boolean') {
			return new Error(
				`Invalid prop \`${propName}\` of type \`${typeof value}\` supplied to \`${componentName}\`, expected \`boolean\`.`
			);
		}
		return null;
	},
	string: function (props, propName, componentName) {
		const value = props[propName];
		if (value != null && typeof value !== 'string') {
			return new Error(
				`Invalid prop \`${propName}\` of type \`${typeof value}\` supplied to \`${componentName}\`, expected \`string\`.`
			);
		}
		return null;
	},
	number: function (props, propName, componentName) {
		const value = props[propName];
		if (value != null && typeof value !== 'number') {
			return new Error(
				`Invalid prop \`${propName}\` of type \`${typeof value}\` supplied to \`${componentName}\`, expected \`number\`.`
			);
		}
		return null;
	},
	func: function (props, propName, componentName) {
		const value = props[propName];
		if (value != null && typeof value !== 'function') {
			return new Error(
				`Invalid prop \`${propName}\` of type \`${typeof value}\` supplied to \`${componentName}\`, expected \`function\`.`
			);
		}
		return null;
	},
	oneOf: (allowedValues) => {
		return function (props, propName, componentName) {
			const value = props[propName];
			if (value != null && allowedValues.indexOf(value) === -1) {
				return new Error(
					`Invalid prop \`${propName}\` of value \`${value}\` supplied to \`${componentName}\`, expected one of [${allowedValues.join(', ')}].`
				);
			}
			return null;
		};
	},
	arrayOf: (typeChecker) => {
		return function (props, propName, componentName) {
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
		};
	}
};

export default PropTypes;
export {PropTypes};
