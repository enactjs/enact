/**
 * Exports the {@link ui/Toggleable.Toggleable} Higher-order Component (HOC).
 *
 * @module ui/Toggleable
 */

import {forward} from '@enact/core/handle';
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
	 * Allows a Toggleable component to update its state by incoming props
	 *
	 * @type {Boolean}
	 * @default false
	 * @memberof ui/Toggleable.Toggleable.defaultConfig
	 */
	mutable: false,

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
	const {activate, deactivate, mutable, prop, toggle} = config;
	const defaultPropKey = 'default' + cap(prop);
	const forwardToggle = forward(toggle);
	const forwardActivate = forward(activate);
	const forwardDeactivate = forward(deactivate);

	return class Toggleable extends React.Component {
		static propTypes = /** @lends ui/Toggleable.Toggleable.prototype */ {
			/**
			 * Whether or not the component is in a "toggled" state when first rendered.
			 * *Note that this property name can be changed by the config. By default it is `defaultActive`.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			[defaultPropKey]: React.PropTypes.bool,

			/**
			 * Whether or not the component is in a disabled state.
			 *
			 * @type {Boolean}
			 * @public
			 */
			disabled: React.PropTypes.bool
		}

		static defaultProps = {
			[defaultPropKey]: false
		}

		constructor (props) {
			super(props);
			const key = (mutable && prop in props) ? prop : defaultPropKey;
			this.state = {
				active: props[key]
			};
		}

		componentWillReceiveProps (nextProps) {
			if (mutable && prop in nextProps) {
				this.setState({
					active: !!nextProps[prop]
				});
			}
		}

		handleActivate = (ev) => {
			if (!this.props.disabled) {
				this.setState({active: true});
				forwardActivate(ev, this.props);
			}
		}

		handleDeactivate = (ev) => {
			if (!this.props.disabled) {
				this.setState({active: false});
				forwardDeactivate(ev, this.props);
			}
		}

		handleToggle = (ev) => {
			if (!this.props.disabled) {
				this.setState({active: !this.state.active});
				forwardToggle(ev, this.props);
			}
		}

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
