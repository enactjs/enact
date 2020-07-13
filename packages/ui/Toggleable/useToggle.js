import useClass from '@enact/core/useClass';

import useControlledState from '../useControlledState';

import Toggle from './Toggle';

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
 * Object returned by `useToggle`
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
 * The value may either be toggled via the `onToggle` or explicitly set via `onActivate` and
 * `onDeactivate`. The initial value can be set using the `defaultSelected` option.
 *
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

	const props = {disabled: config.disabled, onToggle: config.onToggle};
	toggle.setContext(props, ...state);

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
