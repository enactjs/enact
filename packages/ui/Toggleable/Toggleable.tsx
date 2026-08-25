/**
 * A higher-order component at handles toggle state.
 *
 * @module ui/Toggleable
 * @exports Toggleable
 */

import handle, {forwardCustom} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import useHandlers from '@enact/core/useHandlers';
import {cap, checkPropTypes} from '@enact/core/util';
import pick from 'ramda/src/pick';
import {ElementType, SyntheticEvent, useRef} from 'react';
import warning from 'warning';

import {CallbackObject} from '../types';

import {useToggle} from './useToggle';

export interface ToggleableConfig {
	activate: string;
	deactivate: string;
	eventProps: string[];
	prop: string;
	toggle: string;
	toggleProp: string;
}

export type DynamicToggleableProps<
	PropKey extends string = 'selected',
	DefaultPropKey extends string = 'defaultSelected',
	ToggleKey extends string = 'onToggle'
> = {
	/**
	 * Whether or not the component is in a disabled state.
	 *
	 * @memberof ui/Toggleable.Toggleable.prototype
	 * @type {Boolean}
	 * @public
	 */
	disabled?: boolean;

	}
	/**
	 * Default toggled state applied at construction when the toggled prop is `undefined` or
	 * `null`.
	 *
	 * @name defaultSelected
	 * @memberof ui/Toggleable.Toggleable.prototype
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	& {[K in PropKey]?: boolean}

	/**
	 * Current toggled state.
	 *
	 * When set at construction, the component is considered 'controlled' and will only
	 * update its internal value when updated by new props. If undefined, the component
	 * is 'uncontrolled' and `Toggleable` will manage the toggled state using callbacks
	 * defined by its configuration.
	 *
	 * @name selected
	 * @memberof ui/Toggleable.Toggleable.prototype
	 * @type {Boolean}
	 * @public
	 */
	& {[K in DefaultPropKey]?: boolean}

	/**
	 * Event callback to notify that state should be toggled.
	 *
	 * @name onToggle
	 * @memberof ui/Toggleable.Toggleable.prototype
	 * @type {Function}
	 * @public
	 */
	& {[K in ToggleKey]?: (event?: SyntheticEvent | null) => void};

export type ContextType = {
	toggle: () => void;
	activate: () => void;
	deactivate: () => void;
}

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
	toggle: 'onToggle',

	/**
	 * Allows you to remap the incoming `toggle` callback to an event name of your choosing.
	 *
	 * For example, run `onToggle` when the wrapped component has an `onClick` property and you've specified
	 * `onClick` here.
	 *
	 * @type {String}
	 * @default null
	 * @memberof ui/Toggleable.Toggleable.defaultConfig
	 */
	toggleProp: null
};

/**
 * A higher-order component that applies a 'toggleable' behavior to its wrapped component.
 *
 * Its default event and property can be configured when applied to a component.
 *
 * Note: This HoC passes a number of props to the wrapped component that should be passed to the
 * main DOM node or consumed by the wrapped component.
 *
 * Example:
 * ```
 * const Item = ({selected, ...rest}) => (<div {...rest}>{selected}</div>);
 * ...
 * const ToggleItem = Toggleable({toggleProp: 'onClick'}, Item);
 * ```
 *
 * @class Toggleable
 * @memberof ui/Toggleable
 * @hoc
 * @public
 */
const ToggleableHOC = hoc(defaultConfig, (config: ToggleableConfig, Wrapped: ElementType) => {
	const {activate, deactivate, eventProps, prop, toggle, toggleProp} = config;
	const defaultPropKey = 'default' + cap(prop);
	const adapter = (ev: Event | null, props: CallbackObject) => ({...pick(eventProps, props), ...ev});

	const toggleHandlers = {
		onToggle: handle<ContextType>(
			(ev, props, context) => (context?.toggle()),
			forwardCustom(toggleProp, adapter)
		),
		onActivate: handle<ContextType>(
			(ev, props, context) => (context?.activate()),
			forwardCustom(activate, adapter)
		),
		onDeactivate: handle<ContextType>(
			(ev, props, context) => (context?.deactivate()),
			forwardCustom(deactivate, adapter)
		)
	};

	function Toggleable ({disabled = false, ...rest}: DynamicToggleableProps) {
		const props: Record<string, any> = {disabled, ...rest};
		const updated = {...props};
		const propSelected = props[prop];
		checkPropTypes(Toggleable, props);

		const hook = useToggle({
			defaultSelected: props[defaultPropKey],
			disabled,
			onToggle: (ev: Event) => forwardCustom(toggle, adapter)(ev, props),
			prop,

			// FIXME: Current behavior for Toggleable treats `null` as undefined so we coerce it
			// here to maintain that behavior while using useControlledState.
			// eslint-disable-next-line no-undefined
			selected: propSelected == null ? undefined : propSelected
		});
		const handlers = useHandlers(toggleHandlers, props, hook);

		warning(
			!(prop in props && defaultPropKey in props),
			`Do not specify both '${prop}' and '${defaultPropKey}' for Toggleable instances.
			'${defaultPropKey}' will be ignored unless '${prop}' is 'null' or 'undefined'.`
		);

		// FIXME: Current behavior is to use `false` when switching from a truthy value to
		// either null or undefined. The ternary below enforces that but we don't want to
		// continue this exception in the future and should sunset it with this HOC.
		const {current: instance} = useRef({selected: null});
		const selected = (instance.selected && propSelected == null) ? false : hook.selected; // eslint-disable-line react-hooks/refs
		instance.selected = propSelected; // eslint-disable-line react-hooks/refs

		if (prop) {
			updated[prop] = selected;
		}

		if (toggleProp || toggle) {
			updated[toggleProp || toggle] = handlers.onToggle;
		}

		if (activate) {
			updated[activate] = handlers.onActivate;
		}

		if (deactivate) {
			updated[deactivate] = handlers.onDeactivate;
		}

		delete updated[defaultPropKey];

		return (
			<Wrapped {...updated} />
		);
	}

	return Toggleable;
});

export default ToggleableHOC;
export {
	ToggleableHOC as Toggleable,
	useToggle
};
