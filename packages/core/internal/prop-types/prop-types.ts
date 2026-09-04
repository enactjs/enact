import PropTypes, {Requireable, Validator} from 'prop-types';
import {ComponentType, ReactElement} from 'react';

import {Callback, CallbackObject} from '../../types';
import {isRenderable} from '../../util';

import deprecate from '../deprecate';

const isRequired = (fn: Validator<any>): Requireable<any> => {
	(fn as Requireable<any>).isRequired = function (props: CallbackObject, key: string, componentName: string, location: string, propFullName: string, ...rest: []) {
		const propValue = props[key];
		if (typeof propValue === 'undefined') {
			return new Error(
				`'${propFullName}' is required for '${componentName}' but was undefined.`
			);
		}

		return fn(propValue, key, componentName, location, propFullName, ...rest);
	};

	return fn as Requireable<any>;
};

const renderable = isRequired(function (props: CallbackObject, key: string, componentName: string) {
	const propValue = props[key];
	if (propValue && !isRenderable(propValue)) {
		return new Error(
			`Invalid prop '${key}' supplied to '${componentName}'. ` +
			`Expected a renderable value but received '${typeof propValue}' instead.`
		);
	}
} as Validator<any>);

const component = isRequired(function (props: CallbackObject, key: string, componentName: string) {
	const propValue = props[key];
	if (propValue && (typeof propValue === 'string' || !isRenderable(propValue))) {
		return new Error(
			`Invalid prop '${key}' supplied to '${componentName}'. ` +
			`Expected a function but received '${typeof propValue}' instead.`
		);
	}
} as Validator<any>);

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
const deprecated = (base: Callback, config: CallbackObject) => {
	// Wrap in a no-op so deprecate only warns once
	const warn = deprecate(() => true, config);
	return (props: CallbackObject, key: string, ...rest: any) => {
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

// eslint-disable-next-line no-redeclare
export namespace EnactPropTypes {
	export type ref = {current: any} | Callback;
	export type componentOverride = ComponentType<any> | ReactElement;
	export type renderable = ComponentType<any> | string;
}
