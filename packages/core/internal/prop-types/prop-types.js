import PropTypes from 'prop-types';

import {isRenderable} from '../../util';

import deprecate from '../deprecate';

const isRequired = (fn) => {
	fn.isRequired = function (props, key, componentName, location, propFullName, ...rest) {
		const propValue = props[key];
		if (typeof propValue === 'undefined') {
			return new Error(
				`'${propFullName}' is required for '${componentName}' but was undefined.`
			);
		}

		return fn(propValue, key, componentName, location, propFullName, ...rest);
	};

	return fn;
};

const renderable = isRequired(function (props, key, componentName) {
	const propValue = props[key];
	if (propValue && !isRenderable(propValue)) {
		return new Error(
			`Invalid prop '${key}' supplied to '${componentName}'. ` +
			`Expected a renderable value but received '${typeof propValue}' instead.`
		);
	}
});

const component = isRequired(function (props, key, componentName) {
	const propValue = props[key];
	if (propValue && (typeof propValue === 'string' || !isRenderable(propValue))) {
		return new Error(
			`Invalid prop '${key}' supplied to '${componentName}'. ` +
			`Expected a function but received '${typeof propValue}' instead.`
		);
	}
});

const renderableOverride = PropTypes.oneOfType([
	PropTypes.element,
	renderable
]);

const componentOverride = PropTypes.oneOfType([
	PropTypes.element,
	component
]);

/*
 * Wrap a prop type validator with a deprecation warning when the prop has a non-null value
 *
 * @param {Function} base Prop type validator
 * @param {Object} config deprecatioon configuration
 */
const deprecated = (base, config) => {
	// Wrap in a no-op so deprecate only warns once
	const warn = deprecate(() => true, config);
	return (props, key, ...rest) => {
		// Warn on a non-null value for the prop
		if (props[key] != null) warn();

		// Pass on to the prop type validator
		return base(props, key, ...rest);
	};
};

const EnactPropTypes = {
	component,
	componentOverride,
	deprecated,
	renderable,
	renderableOverride
};

export default EnactPropTypes;
