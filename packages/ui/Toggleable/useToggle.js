
import {adaptEvent, forProp, forward, handle, not} from '@enact/core/handle';
import {cap} from '@enact/core/util';
import {pick} from 'ramda';

import useControlledState from '../useControlledState';

/**
 * Default config for `Toggleable`.
 *
 * @memberof ui/Toggleable.Toggleable
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Configures the event name that activates the component.
	 *
	 * **Note**: When using `activate`/`deactivate`, the event payload will only forward the original
	 * event and not include toggled `prop` value. Use `toggle` to receive toggled value from the
	 * event payload.
	 *
	 * Example:
	 * ```
	 * const ToggleItem = Toggleable({activate: 'onFocus', deactivate: 'onBlur'}, Item);
	 *
	 * handleEvent = (ev) => {
	 * 	// do something with `ev.selected` here
	 * }
	 *
	 * <ToggleItem onToggle={handleEvent}>This is a toggle item</Item>
	 *
	 * @type {String}
	 * @memberof ui/Toggleable.Toggleable.defaultConfig
	 */
	activate: null,

	/**
	 * Configures the event name that deactivates the component.
	 *
	 * **Note**: When using `activate`/`deactivate`, the event payload will only forward the original
	 * event and not include toggled `prop` value. Use `toggle` to receive toggled value from the
	 * event payload.
	 *
	 * Example:
	 * ```
	 * const ToggleItem = Toggleable({activate: 'onFocus', deactivate: 'onBlur'}, Item);
	 *
	 * handleEvent = (ev) => {
	 * 	// do something with `ev.selected` here
	 * }
	 *
	 * <ToggleItem onToggle={handleEvent}>This is a toggle item</Item>
	 * ```
	 * @type {String}
	 * @memberof ui/Toggleable.Toggleable.defaultConfig
	 */
	deactivate: null,

	/**
	 * Configures additional props to attach to the event that is sent when toggled.
	 *
	 * @type {String[]}
	 * @default []
	 * @memberof ui/Toggleable.Toggleable.defaultConfig
	 */
	eventProps: [],

	/**
	 * Configures the property that is passed to the wrapped component when toggled.
	 *
	 * @type {String}
	 * @default 'selected'
	 * @memberof ui/Toggleable.Toggleable.defaultConfig
	 */
	prop: 'selected',

	/**
	 * Configures the event name that toggles the component.
	 *
	 * The payload includes a toggled Boolean value of `prop`.
	 *
	 * **Note**: The payload will override the original event. If a native event is set, then the native
	 * event payload will be lost.
	 *
	 * @type {String}
	 * @default 'onToggle'
	 * @memberof ui/Toggleable.Toggleable.defaultConfig
	 */
	toggle: 'onToggle'
};

const configureToggle = (config) => {
	const {activate, deactivate, eventProps, prop, toggle, toggleProp} = {...defaultConfig, ...config};
	const defaultPropKey = 'default' + cap(prop);

	const isEnabled = not(forProp('disabled', true));
	const handleToggle = handle(
		isEnabled,
		forward(toggleProp),
		adaptEvent(
			(ev, props, value) => ({
				...pick(eventProps, props),
				[prop]: !value
			}),
			forward(toggle)
		),
		(ev, props, {value, onToggle}) => onToggle(!value)
	).named('handleToggle');

	const handleActivate = handle(
		isEnabled,
		adaptEvent(
			(ev, props) => ({
				...pick(eventProps, props),
				[prop]: true
			}),
			forward(activate)
		),
		(ev, props, {onToggle}) => onToggle(true)
	).named('handleActivate');

	const handleDeactivate = handle(
		isEnabled,
		adaptEvent(
			(ev, props) => ({
				...pick(eventProps, props),
				[prop]: false
			}),
			forward(deactivate)
		),
		(ev, props, {onToggle}) => onToggle(false)
	).named('handleActivate');

	// eslint-disable-next-line no-shadow
	function useToggle (props) {
		const [value, onToggle] = useControlledState(props[defaultPropKey], props[prop], prop in props);
		const context = {
			value,
			onToggle
		};

		const updated = {};
		if (prop) updated[prop] = Boolean(value);
		if (toggleProp || toggle) updated[toggleProp || toggle] = (ev) => handleToggle(ev, props, context);
		if (activate) updated[activate] = (ev) => handleActivate(ev, props, context);
		if (deactivate) updated[deactivate] = (ev) => handleDeactivate(ev, props, context);

		return updated;
	}

	return useToggle;
};

const useToggle = configureToggle();
useToggle.configure = configureToggle;

export default useToggle;
export {
	configureToggle,
	defaultConfig,
	useToggle
};
