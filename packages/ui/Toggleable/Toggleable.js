/**
 * Exports the {@link module:enact-ui/Toggleable~Toggleable} Higher-order Component (HOC).
 *
 * @module enact-ui/Toggleable
 */

import React from 'react';
import hoc from 'enact-core/hoc';
import {cap} from 'enact-core/util';

const defaultConfig = {

	/**
	 * Configures the event name that toggles the component
	 *
	 * @type {String}
	 * @default 'onClick'
	 */
	toggle: 'onClick',

	/**
	 * Configures the property that is passed to the wrapped component when toggled
	 *
	 * @type {String}
	 * @default 'selected'
	 */
	prop: 'selected'
};

/**
 * {@link module:enact-ui/Toggleable~Toggleable} is a Higher-order Component that applies a 'Toggleable' behavior
 * to its wrapped component.  Its default event and property can be configured when applied to a component.
 *
 * By default, Toggleable applies the `selected` property on click events.
 *
 * @class Toggleable
 * @ui
 * @public
 */
const ToggleableHOC = hoc(defaultConfig, (config, Wrapped) => {
	const defaultPropKey = 'default' + cap(config.prop);

	return class Toggleable extends React.Component {
		static propTypes = {
			/**
			 * Whether or not the component is in a "toggled" state when first rendered.
			 * *Note that this property name can be changed by the config. By default it is `defaultSelected`.
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
			 * @default false
			 * @public
			 */
			disabled: React.PropTypes.bool
		}

		static defaultProps = {
			[defaultPropKey]: false
		}

		constructor (props) {
			super(props);
			this.state = {
				selected: props[defaultPropKey]
			};
		}

		onToggle = (ev) => {
			const handler = this.props[config.toggle];
			if (!this.props.disabled) {
				this.setState({selected: !this.state.selected});
				if (handler) handler(ev);
			}
		}

		render () {
			const props = Object.assign({}, this.props);
			props[config.toggle] = this.onToggle;
			props[config.prop] = this.state.selected;
			delete props[defaultPropKey];

			return <Wrapped {...props} />;
		}
	};
});

export default ToggleableHOC;
export {ToggleableHOC as Toggleable};
