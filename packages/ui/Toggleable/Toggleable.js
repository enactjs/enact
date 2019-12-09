/**
 * A higher-order component at handles toggle state.
 *
 * @module ui/Toggleable
 * @exports Toggleable
 */

import {forProp, forward, handle} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {cap, memoize, not} from '@enact/core/util';
import {pick} from 'ramda';
import PropTypes from 'prop-types';
import React from 'react';

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


/*
forwardWithState = (evName) => (ev, props) => forward(evName, {...pick(eventProps, props), [prop]: !this.state.active}, props)

		updateActive = (active) => {
			if (!this.state.controlled) {
				this.setState({active});
			}
		}

		handleActivate = this.handle(
			forProp('disabled', false),
			forward(activate),
			this.forwardWithState(toggle),
			() => this.updateActive(true)
		)

		handleDeactivate = this.handle(
			forProp('disabled', false),
			forward(deactivate),
			this.forwardWithState(toggle),
			() => this.updateActive(false)
		)

		handleToggle = this.handle(
			forProp('disabled', false),
			(toggleProp ? forward(toggleProp) : null),
			this.forwardWithState(toggle),
			() => this.updateActive(!this.state.active)
		)

		render () {
			const props = Object.assign({}, this.props);

			if (toggleProp || toggle) {
				// Supporting only one of the toggleProp or toggle, but we don't want both applying.
				delete props[toggle];
				props[toggleProp || toggle] = this.handleToggle;
			}
			if (activate) props[activate] = this.handleActivate;
			if (deactivate) props[deactivate] = this.handleDeactivate;
			if (prop) props[prop] = this.state.active;

			delete props[defaultPropKey];

			return <Wrapped {...props} />;
		}
*/

const hook = (config) => {
	const {activate, deactivate, prop, toggle, toggleProp} = {defaultConfig, ...config};
	const defaultPropKey = 'default' + cap(prop);

	const isEnabled = not(forProp('disabled', true));
	const handleToggle = memoize(fn => handle(
		isEnabled,
		forward(toggle),
		({[prop]: value}) => fn(value)
	).named('handleToggle'));

	const handleActivate = memoize(fn => handle(
		isEnabled,
		forward(activate),
		() => fn(true)
	).named('handleActivate'));

	const handleDeactivate = memoize(fn => handle(
		isEnabled,
		forward(deactivate),
		() => fn(false)
	).named('handleActivate'));

	// eslint-disable-next-line no-shadow
	function useToggle (props) {
		const [value, onToggle] = React.useState(props[defaultPropKey]);
		const toggleHandler = handleToggle(onToggle);
		const activateHandler = handleActivate(onToggle);
		const deactivateHandler = handleDeactivate(onToggle);

		return {
			[prop]: value,
			[toggle]: (ev) => toggleHandler(ev, props),
			[activate]: (ev) => activateHandler(ev, props),
			[deactivate]: (ev) => deactivateHandler(ev, props)
		};
	}

	return useToggle;
};

const useToggle = hook();
useToggle.configure = hook;

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
	const fn = useToggle.configure(config);

	function Toggleable (props) {
		return (
			<Wrapped
				{...props}
				{...fn(props)}
			/>
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
});

export default ToggleableHOC;
export {ToggleableHOC as Toggleable};
