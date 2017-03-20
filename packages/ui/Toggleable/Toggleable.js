/* eslint-disable react/sort-prop-types */

/**
 * Exports the {@link ui/Toggleable.Toggleable} Higher-order Component (HOC).
 *
 * @module ui/Toggleable
 */

import {forProp, forward, handle} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {cap} from '@enact/core/util';
import React from 'react';

/**
 * Default config for {@link ui/Toggleable.Toggleable}
 *
 * @memberof ui/Toggleable.Toggleable
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Configures the event name that activates the component
	 *
	 * @type {String}
	 * @memberof ui/Toggleable.Toggleable.defaultConfig
	 */
	activate: null,

	/**
	 * Configures the event name that deactivates the component
	 *
	 * @type {String}
	 * @memberof ui/Toggleable.Toggleable.defaultConfig
	 */
	deactivate: null,

	/**
	 * Configures the event name that toggles the component
	 *
	 * @type {String}
	 * @default 'onToggle'
	 * @memberof ui/Toggleable.Toggleable.defaultConfig
	 */
	toggle: 'onToggle',

	/**
	 * Configures the property that is passed to the wrapped component when toggled
	 *
	 * @type {String}
	 * @default 'active'
	 * @memberof ui/Toggleable.Toggleable.defaultConfig
	 */
	prop: 'active'
};

/**
 * {@link ui/Toggleable.Toggleable} is a Higher-order Component that applies a 'Toggleable' behavior
 * to its wrapped component.  Its default event and property can be configured when applied to a component.
 *
 * By default, Toggleable applies the `active` property on click events.
 *
 * @class Toggleable
 * @memberof ui/Toggleable
 * @hoc
 * @public
 */
const ToggleableHOC = hoc(defaultConfig, (config, Wrapped) => {
	const {activate, deactivate, prop, toggle} = config;
	const defaultPropKey = 'default' + cap(prop);

	return class Toggleable extends React.Component {
		static propTypes = /** @lends ui/Toggleable.Toggleable.prototype */ {
			/**
			 * Default toggled state applied at construction when the toggled prop is `undefined` or
			 * `null`.
			 *
			 * @type {*}
			 * @public
			 */
			[defaultPropKey]: React.PropTypes.bool,

			/**
			 * Current toggled state. When set at construction, the component is considered
			 * "controlled" and will only update its internal value when updated by new props. If
			 * undefined, the component is "uncontrolled" and `Toggleable` will manage the toggled
			 * state using callbacks defined by its configuration.
			 *
			 * @type {*}
			 * @public
			 */
			[prop]: React.PropTypes.bool,

			/**
			 * Whether or not the component is in a disabled state.
			 *
			 * @type {Boolean}
			 * @public
			 */
			disabled: React.PropTypes.bool
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
			} else if (prop in nextProps) {
				// warning! uncontrolled => controlled
			}
		}

		handle = handle.bind(this)

		updateActive = (active) => {
			if (!this.state.controlled) {
				this.setState({active});
			}
		}

		handleActivate = this.handle(
			forProp('disabled', false),
			forward(activate),
			() => this.updateActive(true)
		)

		handleDeactivate = this.handle(
			forProp('disabled', false),
			forward(deactivate),
			() => this.updateActive(false)
		)

		handleToggle = this.handle(
			forProp('disabled', false),
			forward(toggle),
			() => this.updateActive(!this.state.active)
		)

		render () {
			const props = Object.assign({}, this.props);

			if (toggle) props[toggle] = this.handleToggle;
			if (activate) props[activate] = this.handleActivate;
			if (deactivate) props[deactivate] = this.handleDeactivate;
			if (prop) props[prop] = this.state.active;

			delete props[defaultPropKey];

			return <Wrapped {...props} />;
		}
	};
});

export default ToggleableHOC;
export {ToggleableHOC as Toggleable};
