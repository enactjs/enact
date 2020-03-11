import {adaptEvent, forProp, forward, handle, not, returnsTrue} from '@enact/core/handle';
import React from 'react';

import useControlledState from '../useControlledState';

const isEnabled = not(forProp('disabled', true));
const makeEvent = (config, value) => ({
	[config.prop || 'selected']: value
});

class Toggle {
	constructor (config) {
		// remapping to props for better compatibility with core/handle and binding
		this.props = config;
		this.context = {};
	}

	setContext (value, onToggle) {
		this.context.value = value;
		this.context.onToggle = onToggle;
	}

	get value () {
		return Boolean(this.context.value);
	}

	handleActivate = handle(
		isEnabled,
		adaptEvent((ev, props) => makeEvent(props, true), forward('onToggle')),
		returnsTrue((ev, props, context) => context.onToggle(true))
	).bindAs(this, 'handleActivate')

	handleDeactivate = handle(
		isEnabled,
		adaptEvent((ev, props) => makeEvent(props, false), forward('onToggle')),
		returnsTrue((ev, props, context) => context.onToggle(false))
	).bindAs(this, 'handleDeactivate')

	handleToggle = handle(
		isEnabled,
		adaptEvent((ev, props, {value}) => makeEvent(props, !value), forward('onToggle')),
		returnsTrue((ev, props, {onToggle, value}) => onToggle(!value))
	).bindAs(this, 'handleToggle')
}

/**
 * Creates one instance of the class, `Ctor` with the provided `args`, for the life of the
 * component.
 *
 * @param {Function} Ctor Class constructor
 * @param  {...any} args Arguments to pass to the constructor
 * @private
 */
function useClass (Ctor, ...args) {
	const ref = React.useRef(null);
	ref.current = ref.current || new Ctor(...args);

	return ref.current;
}

/**
 * Configuration for `useToggle`
 *
 * @typedef {Object} useToggleConfig
 * @memberof ui/Toggleable.useToggle
 * @property {Boolean}  [defaultSelected = false] Initial state of the toggle
 * @property {Boolean}  [disabled = false]        Disables updating the state
 * @property {Boolean}  [prop = "selected"]       The key used to pass the current value back
 *                                                through the `onToggle` callback.
 * @property {Boolean}  [selected = false]        Current state of the toggle
 * @property {Function} [onToggle]                Called when the state is changed
 * @public
 */

/**
 * Configuration for `useToggle`
 *
 * @typedef {Object} useToggleInterface
 * @memberof ui/Toggleable.useToggle
 * @property {Boolean}  selected   Current state of the toggle
 * @property {Function} activate   Sets the current state to `true`
 * @property {Function} deactivate Sets the current state to `false`
 * @property {Function} toggle     Toggles the current state to the opposite value
 * @public
 */

/**
 * Manages a boolean state value.
 *
 * The value may either be toggled via the `onToggle` or explicitly set via `onActivate` and `onDeactivate`. The initial value can be set using the `defaultSelected` option
 * @param {useToggleConfig} config Configuration options
 * @returns {useToggleInterface}
 */
function useToggle (config = {}) {
	const toggle = useClass(Toggle, config);

	toggle.setContext(...useControlledState(
		config.defaultSelected,
		config.selected,
		typeof config.selected !== 'undefined'
	));

	return {
		activate: toggle.handleActivate,
		deactivate: toggle.handleDeactivate,
		toggle: toggle.handleToggle,
		selected: toggle.value
	};
}

export default useToggle;
export {
	useToggle
};
