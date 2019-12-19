/* eslint-disable react/sort-prop-types */

/**
 * A higher-order component that adds state management for a single prop via a single event handler.
 *
 * @module ui/Changeable
 * @exports Changeable
 */

import {forProp, forward, handle, not} from '@enact/core/handle';
import {cap} from '@enact/core/util';

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

	const handleChange = handle(
		not(forProp('disabled', true)),
		forward(change),
		({[prop]: value}, props, {onChange}) => onChange(value)
	).named('handleChange');

	// eslint-disable-next-line no-shadow
	function useChange (props) {
		const [value, onChange] = useControlledState(props[defaultPropKey], props[prop], prop in props);
		const context = {
			onChange
		};

		const updated = {};
		if (prop) updated[prop] = value;
		if (change) updated[change] = (ev) => handleChange(ev, props, context);

		return updated;
	}

	return useChange;
};

const useChange = configureChange();
useChange.configure = configureChange;

export default useChange;
export {
	configureChange,
	defaultConfig,
	useChange
};
