/* eslint-disable react/sort-prop-types */

/**
 * A higher-order component that adds state management for a single prop via a single event handler.
 *
 * @module ui/Changeable
 * @exports Changeable
 */

import {forProp, forward, handle, not} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {cap, memoize} from '@enact/core/util';
// import PropTypes from 'prop-types';
import React from 'react';

import useControlledState from '../useControlledState';

/**
 * Default config for {@link ui/Changeable.Changeable}.
 *
 * @memberof ui/Changeable.Changeable
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Configures the prop name to pass the callback to change the value
	 *
	 * @type {String}
	 * @default 'onChange'
	 * @memberof ui/Changeable.Changeable.defaultConfig
	 */
	change: 'onChange',

	/**
	 * Configures the prop name to pass the current value
	 *
	 * @type {String}
	 * @default 'value'
	 * @memberof ui/Changeable.Changeable.defaultConfig
	 */
	prop: 'value'
};

const configureChange = (config) => {
	const {prop, change} = {...defaultConfig, ...config};
	const defaultPropKey = 'default' + cap(prop);

	const handleChange = memoize(fn => handle(
		not(forProp('disabled', true)),
		forward(change),
		({[prop]: value}) => fn(value)
	).named('handleChange'));

	// eslint-disable-next-line no-shadow
	function useChange (props) {
		const [value, onChange] = useControlledState(props[defaultPropKey], props[prop], prop in props);
		const handler = handleChange(onChange);

		return {
			[prop]: value,
			[change]: (ev) => handler(ev, props)
		};
	}

	return useChange;
};

const useChange = configureChange();
useChange.configure = configureChange;

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
		return (
			<Wrapped
				{...props}
				{...fn(props)}
			/>
		);
	};
});

export default ChangeableHoc;
export {
	configureChange,
	ChangeableHoc,
	useChange
};
