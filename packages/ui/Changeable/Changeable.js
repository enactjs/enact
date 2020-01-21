/* eslint-disable react/sort-prop-types */

/**
 * A higher-order component that adds state management for a single prop via a single event handler.
 *
 * @module ui/Changeable
 * @exports Changeable
 */

import hoc from '@enact/core/hoc';
import {cap} from '@enact/core/util';
import React from 'react';
import warning from 'warning';

import {configureChange, defaultConfig, useChange} from './useChange';

/**
 * A higher-order component that adds state management to a component for a single prop via
 * a single event callback.
 *
 * Applying `Changeable` to a component will pass two additional props: the current value from state
 * and an event callback to invoke when the value changes. By default, the value is passed in the
 * `value` prop and the callback is passed in the `onChange` callback but both are configurable
 * through the HOC config object.
 *
 * If `value` is passed to `Changeable`, the HOC assumes that the value is managed elsewhere and it
 * will not update its internal state. To set an initial value, use `defaultValue` instead.
 *
 * To update the value from the wrapped component, call `onChange` with an object containing a
 * `value` member with the new value. `Changeable` will update its internal state and pass the
 * updated value back down to the wrapped component.
 *
 * *Note:* If the `prop` is overridden, the property names to set the default value and current
 * value change correspondingly.
 *
 * @class Changeable
 * @memberof ui/Changeable
 * @hoc
 * @public
 */
const ChangeableHoc = hoc(defaultConfig, (config, Wrapped) => {
	const fn = useChange.configure(config);

	return function Changeable (props) {
		const updated = {
			...props,
			...fn(props)
		};

		const defaultPropKey = 'default' + cap(config.prop || defaultConfig.prop);

		warning(
			!(config.prop in props && defaultPropKey in props),
			`Do not specify both '${config.prop}' and '${defaultPropKey}' for Changeable instances.
			'${defaultPropKey}' will be ignored unless '${config.prop}' is 'null' or 'undefined'.`
		);

		delete updated[defaultPropKey];

		return (
			<Wrapped {...updated} />
		);
	};
});

export default ChangeableHoc;
export {
	configureChange,
	ChangeableHoc,
	useChange
};
