/**
 * A higher-order component at handles toggle state.
 *
 * @module ui/Toggleable
 * @exports Toggleable
 */

import {forProp, forward, handle} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {cap} from '@enact/core/util';

import React from 'react';
import PropTypes from 'prop-types';
import warning from 'warning';

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
 * Example:
 * ```
 * const ToggleItem = Toggleable({toggleProp: 'onClick'}, Item);
 * ```
 *
 * @class Toggleable
 * @memberof ui/Toggleable
 * @hoc
 * @public
 */
const ToggleableHOC = hoc(defaultConfig, (config, Wrapped) => {
	const {activate, deactivate, prop, toggle, toggleProp} = config;
	const defaultPropKey = 'default' + cap(prop);

	return class Toggleable extends React.Component {
		static propTypes = /** @lends ui/Toggleable.Toggleable.prototype */ {
			/**
			 * Default toggled state applied at construction when the toggled prop is `undefined` or
			 * `null`.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			[defaultPropKey]: PropTypes.bool,

			/**
			 * Whether or not the component is in a disabled state.
			 *
			 * @type {Boolean}
			 * @public
			 */
			disabled: PropTypes.bool,

			/**
			 * Current toggled state.
			 *
			 * When set at construction, the component is considered 'controlled' and will only
			 * update its internal value when updated by new props. If undefined, the component
			 * is 'uncontrolled' and `Toggleable` will manage the toggled state using callbacks
			 * defined by its configuration.
			 *
			 * @type {Boolean}
			 * @public
			 */
			[prop]: PropTypes.bool,

			/**
			 * Event callback to notify that state should be toggled.
			 *
			 * @type {Function}
			 * @public
			 */
			[toggle]: PropTypes.func,

			/**
			 * The "aria-label" when toggle button is off.
			 *
			 * @type {String}
			 * @public
			 */
			toggleOffAriaLabel: PropTypes.string,

			/**
			 * The "aria-label" when toggle button is on.
			 *
			 * @type {String}
			 * @public
			 */
			toggleOnAriaLabel: PropTypes.string
		}

		static defaultProps = {
			[defaultPropKey]: false,
			disabled: false
		}

		constructor (props) {
			super(props);
			let active = props[defaultPropKey];
			let controlled = false;

			if (prop in props) {
				if (props[prop] != null) {
					active = props[prop];
				}

				controlled = true;
			}

			this.state = {
				active,
				controlled
			};
		}

		componentWillReceiveProps (nextProps) {
			if (this.state.controlled) {
				this.setState({
					active: !!nextProps[prop]
				});
			} else {
				warning(
					!(prop in nextProps),
					`'${prop}' specified for an uncontrolled instance of Toggleable and will be
					ignored. To make this instance of Toggleable controlled, '${prop}' should be
					specified at creation.`
				);
			}
		}

		handle = handle.bind(this)

		forwardWithState = (evName) => (ev, props) => forward(evName, {[prop]: !this.state.active}, props)

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
			const
				props = Object.assign({}, this.props),
				toggleAriaLabel = this.state.active ? props['toggleOnAriaLabel'] : props['toggleOffAriaLabel'];

			if (toggleProp || toggle) {
				// Supporting only one of the toggleProp or toggle, but we don't want both applying.
				delete props[toggle];
				props[toggleProp || toggle] = this.handleToggle;
			}
			if (activate) props[activate] = this.handleActivate;
			if (deactivate) props[deactivate] = this.handleDeactivate;
			if (prop) props[prop] = this.state.active;

			delete props[defaultPropKey];
			delete props['toggleOffAriaLabel'];
			delete props['toggleOnAriaLabel'];

			return <Wrapped aria-label={toggleAriaLabel} {...props} />;
		}
	};
});

export default ToggleableHOC;
export {ToggleableHOC as Toggleable};
