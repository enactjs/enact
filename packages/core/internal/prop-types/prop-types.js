import PropTypes from 'prop-types';

import {isRenderable} from '../../util';

const isRequired = (fn) => {
	fn.isRequired = function (propValue, key, componentName, location, propFullName, ...rest) {
		if (typeof propValue === 'undefined') {
			return new Error(
				`'${propFullName}' is required for '${componentName}' but was undefined.`
			);
		}

		return fn(propValue, key, componentName, location, propFullName, ...rest);
	};

	return fn;
};

const renderable = isRequired(function (propValue, key, componentName, location, propFullName) {
	if (propValue && !isRenderable(propValue)) {
		return new Error(
			`Invalid prop '${propFullName}' supplied to '${componentName}'.` +
			`Expected a renderable value but received a '${typeof propValue}' instead.`
		);
	}
});

const component = isRequired(function (propValue, key, componentName, location, propFullName) {
	if (propValue && (typeof propValue === 'string' || !isRenderable(propValue))) {
		return new Error(
			`Invalid prop '${propFullName}' supplied to '${componentName}'.` +
			`Expected a renderable value but received a '${typeof propValue}' instead.`
		);
	}
});

const renderableOverride = PropTypes.oneOfType([
	renderable,
	PropTypes.element
]);

const componentOverride = PropTypes.oneOfType([
	component,
	PropTypes.element
]);

const EnactPropTypes = {
	component,
	componentOverride,
	renderable,
	renderableOverride
};

export default EnactPropTypes;
