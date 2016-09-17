/**
 * Exports the {@link module:enact-ui/Pickable~Pickable} Higher-order Component (Hoc).
 *
 * @module enact-ui/Pickable
 */

import React from 'react';
import hoc from 'enact-core/hoc';
import {cap} from 'enact-core/util';

const defaultConfig = {
	/**
	 * If a Pickable component is used to maintain uncommitted state within another component,
	 * `mutable` allows `prop` to be updated via incoming props in addition to the `pick` callback.
	 * When `true` and `prop` is specified, it will take precendence over the default value.
	 *
	 * When using this property, it may be necessary to prevent unnecessary updates using
	 * `shouldComponentUpdate()` to avoid resetting the value inadvertently.
	 *
	 * @type {Boolean}
	 * @default false
	 */
	mutable: false,

	/**
	 * Configures the prop name to pass the callback to update the value
	 *
	 * @type {String}
	 * @default 'onChange'
	 */
	pick: 'onChange',

	/**
	 * Configures the prop name to pass the current value
	 *
	 * @type {String}
	 * @default 'value'
	 */
	prop: 'value'
};

/**
 * {@link module:enact-ui/Pickable~Pickable} is a Higher-order Component that applies a 'Pickable' behavior
 * to its wrapped component.  Its default event and value properties can be configured when applied to a component.
 * In addition, it supports `mutable` config setting that allows the HoC to accept incoming settings for the `prop`.
 *
 * By default, you can set the initial state of the pickable item by passing `defaultValue`.  Once rendered, the
 * HoC manages the state of `value`.  If the `prop` is overridden, the names change correspondingly.
 *
 * @class Pickable
 * @ui
 * @public
 */
const PickableHoC = hoc(defaultConfig, (config, Wrapped) => {
	const {mutable, prop} = config;
	const defaultPropKey = 'default' + cap(prop);

	return class Pickable extends React.Component {
		static propTypes = {

			/**
			 * The default value of the component. *Note that this property name changes based on the config.*
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			[defaultPropKey]: React.PropTypes.number,

			/**
			 * Controls whether the component is disabled.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			disabled: React.PropTypes.bool
		}

		static defaultProps = {
			[defaultPropKey]: 0
		}

		constructor (props) {
			super(props);
			const key = (mutable && prop in props) ? prop : defaultPropKey;
			const value = this.value = props[key];
			this.state = {value};
		}

		componentWillReceiveProps (nextProps) {
			if (mutable) {
				this.value = nextProps[prop];
			} else {
				this.value = this.state.value;
			}
		}

		pick = (ev) => {
			const value = this.value = ev[config.prop];
			const onPick = this.props[config.pick];

			this.setState({value});
			if (onPick) onPick(ev);
		}

		render () {
			const props = Object.assign({}, this.props);
			props[config.pick] = this.pick;
			props[config.prop] = this.state.value;
			delete props[defaultPropKey];

			return <Wrapped {...props} value={this.value} />;
		}
	};
});

export default PickableHoC;
export {PickableHoC as Pickable};
