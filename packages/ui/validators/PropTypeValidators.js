import {PropTypes, ReactPropTypeLocationNames} from 'react';

// This is a clone of React's `createChainableTypeChecker` as copied from http://www.ian-thomas.net/custom-proptype-validation-with-react/ and updated to work with 15.3's secret
function createChainableTypeChecker (validate) {
	function checkType (isRequired, props, propName, componentName, location, ...rest) {
		componentName = componentName || 'ANONYMOUS';
		if (props[propName] == null) {
			let locationName = ReactPropTypeLocationNames[location];
			if (isRequired) {
				return new Error(
					'Required ' + locationName + ' `' + propName + '` was not specified in '
					+ '`' + componentName + '`.'
				);
			}
			return null;
		} else {
			return validate(props, propName, componentName, location, ...rest);
		}
	}

	let chainedCheckType = checkType.bind(null, false);
	chainedCheckType.isRequired = checkType.bind(null, true);

	return chainedCheckType;
}

// Used to check if the value of `propName` falls between `props.min` and `props.max`.
const checkDefaultBounds = (props, propName, componentName, ...rest) => {
	const error = PropTypes.number(props, propName, componentName, ...rest);
	if (error !== null) return error;

	if (props[propName] < props.min || props[propName] > props.max) {
		return new Error('Value of `' + propName + '` is out of bounds in `' + componentName + '`.');
	}
	return null;
};

const chainableCheckDefaultBounds = createChainableTypeChecker(checkDefaultBounds);

const anyPrimitive = PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]);

export {
	anyPrimitive,
	chainableCheckDefaultBounds as checkDefaultBounds
};
