/**
 * Exports the {@link module:@enact/ui/Toggleable~Toggleable} Higher-order Component (HOC).
 *
 * @module @enact/ui/Toggleable
 */

import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {cap} from '@enact/core/util';
import React from 'react';

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
 * {@link module:@enact/ui/Toggleable~Toggleable} is a Higher-order Component that applies a 'Toggleable' behavior
 * to its wrapped component.  Its default event and property can be configured when applied to a component.
 *
 * By default, Toggleable applies the `selected` property on click events.
 *
 * @class Toggleable
 * @ui
 * @public
 */
const ToggleableHOC = hoc(defaultConfig, (config, Wrapped) => {
	const {toggle, prop} = config;
	const defaultPropKey = 'default' + cap(prop);
	const forwardToggle = forward(toggle);

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
			if (!this.props.disabled) {
				this.setState({selected: !this.state.selected});
			}
			forwardToggle(ev, this.props);
		}

		render () {
			const props = Object.assign({}, this.props);
			if (toggle) props[toggle] = this.onToggle;
			if (prop) props[prop] = this.state.selected;
			delete props[defaultPropKey];

			return <Wrapped {...props} />;
		}
	};
});

export default ToggleableHOC;
export {ToggleableHOC as Toggleable};
