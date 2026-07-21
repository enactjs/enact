import {isRenderable} from '../../util';

import deprecate from '../deprecate';

/**
 * Minimal PropTypes validators to replace the `prop-types` npm package.
 * Only the subset used internally is implemented.
 */
const PropTypes = {
	oneOfType: (types) => {
		return function validate (props, propName, componentName, location, propFullName, ...rest) {
			const errors = [];
			for (const type of types) {
				const error = type(props, propName, componentName, location, propFullName, ...rest);
				if (!error) return null;
				errors.push(error);
			}
			return errors.length === types.length
				? new Error(`Invalid ${location} \`${propFullName}\` supplied to \`${componentName}\`.`)
				: null;
		};
	},
	element: function (props, propName, componentName) {
		const value = props[propName];
		if (value != null && typeof value !== 'object') {
			return new Error(
				`Invalid prop \`${propName}\` supplied to \`${componentName}\`, expected a React element.`
			);
		}
		return null;
	},
	shape: (shapeTypes) => {
		return function (props, propName, componentName, location, propFullName) {
			const value = props[propName];
			if (value == null) return null;
			if (typeof value !== 'object') {
				return new Error(
					`Invalid ${location} \`${propFullName}\` supplied to \`${componentName}\`, expected an object.`
				);
			}
			for (const key in shapeTypes) {
				const checker = shapeTypes[key];
				if (checker) {
					const error = checker(value, key, componentName, location, `${propFullName}.${key}`);
					if (error) return error;
				}
			}
			return null;
		};
	},
	any: function () { return null; },
	func: function (props, propName, componentName) {
		const value = props[propName];
		if (value != null && typeof value !== 'function') {
			return new Error(
				`Invalid prop \`${propName}\` supplied to \`${componentName}\`, expected a function.`
			);
		}
		return null;
	}
};

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

const ref = PropTypes.oneOfType([PropTypes.shape({
	current: PropTypes.any
}), PropTypes.func]);

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
	ref,
	deprecated,
	renderable,
	renderableOverride
};

export default EnactPropTypes;
