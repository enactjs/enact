import React from 'react';

import useControlledState from '../useControlledState';

import Toggle from './Toggle';

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
 * @memberof ui/Toggleable
 * @property {Boolean}  [defaultSelected = false] Initial state of the toggle
 * @property {Boolean}  [disabled = false]        Disables updating the state
 * @property {Boolean}  [prop = "selected"]       The key used to pass the current value back
 *                                                through the `onToggle` callback.
 * @property {Boolean}  [selected = false]        Current state of the toggle
 * @property {Function} [onToggle]                Called when the state is changed
 * @private
 */

/**
 * Configuration for `useToggle`
 *
 * @typedef {Object} useToggleInterface
 * @memberof ui/Toggleable
 * @property {Boolean}  selected   Current state of the toggle
 * @property {Function} activate   Sets the current state to `true`
 * @property {Function} deactivate Sets the current state to `false`
 * @property {Function} toggle     Toggles the current state to the opposite value
 * @private
 */

/**
 * Manages a boolean state value.
 *
 * The value may either be toggled via the `onToggle` or explicitly set via `onActivate` and `onDeactivate`. The initial value can be set using the `defaultSelected` option
 * @param {useToggleConfig} config Configuration options
 * @returns {useToggleInterface}
 * @private
 */
function useToggle ({defaultSelected, selected, ...config} = {}) {
	const toggle = useClass(Toggle, config);
	const state = useControlledState(
		defaultSelected,
		selected,
		typeof selected !== 'undefined'
	);

	toggle.setContext(...state);

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
