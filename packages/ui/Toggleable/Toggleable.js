/**
 * A higher-order component at handles toggle state.
 *
 * @module ui/Toggleable
 * @exports Toggleable
 */

import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {cap} from '@enact/core/util';
import PropTypes from 'prop-types';
import React from 'react';
import warning from 'warning';

import {useToggle} from './useToggle';

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
 * main DOM node or consumed by the wrapped compoment.
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
const ToggleableHOC = hoc(defaultConfig, (config, Wrapped) => {
	// TODO: Add back eventProps support
	const {activate, deactivate, prop, toggle, toggleProp} = config;

	function Toggleable (props) {
		const defaultPropKey = 'default' + cap(config.prop || defaultConfig.prop);
		const updated = {...props};
		const hook = useToggle({
			disabled: props.disabled,
			selected: props[prop],
			defaultSelected: props[defaultPropKey],
			onToggle: props[toggle]
		});

		warning(
			!(prop in props && defaultPropKey in props),
			`Do not specify both '${prop}' and '${defaultPropKey}' for Toggleable instances.
			'${defaultPropKey}' will be ignored unless '${prop}' is 'null' or 'undefined'.`
		);

		if (prop) updated[prop] = hook.selected;

		if (toggleProp || toggle) {
			updated[toggleProp || toggle] = (ev) => {
				if (hook.onToggle()) forward(toggleProp, ev, props);
			};
		}

		if (activate) {
			updated[activate] = (ev) => {
				if (hook.onActivate()) forward(activate, ev, props);
			};
		}

		if (deactivate) {
			updated[deactivate] = (ev) => {
				if (hook.onDeactivate()) forward(deactivate, ev, props);
			};
		}

		delete updated[defaultPropKey];

		return (
			<Wrapped {...updated} />
		);
	}

	/** @lends ui/Toggleable.Toggleable.prototype */
	Toggleable.propTypes = {
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
		defaultSelected: PropTypes.bool,

		/**
		 * Whether or not the component is in a disabled state.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Event callback to notify that state should be toggled.
		 *
		 * @name onToggle
		 * @memberof ui/Toggleable.Toggleable.prototype
		 * @type {Function}
		 * @public
		 */
		onToggle: PropTypes.func,

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
		selected: PropTypes.bool
	};

	Toggleable.defaultProps = {
		disabled: false
	};

	return Toggleable;
});

export default ToggleableHOC;
export {
	ToggleableHOC as Toggleable,
	useToggle
};
