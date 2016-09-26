/**
 * Exports the {@link module:enact-ui/Pickable~Pickable} Higher-order Component (HOC).
 *
 * @module enact-ui/Pickable
 */

import {forward} from 'enact-core/handle';
import hoc from 'enact-core/hoc';
import {cap} from 'enact-core/util';
import React from 'react';

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
 * In addition, it supports `mutable` config setting that allows the HOC to accept incoming settings for the `prop`.
 *
 * By default, you can set the initial state of the pickable item by passing `defaultValue`.  Once rendered, the
 * HOC manages the state of `value`.  If the `prop` is overridden, the names change correspondingly.
 *
 * @class Pickable
 * @ui
 * @public
 */
const PickableHOC = hoc(defaultConfig, (config, Wrapped) => {
	const {mutable, prop, pick} = config;
	const defaultPropKey = 'default' + cap(prop);
	const forwardPick = forward(pick);

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
			const value = props[key];
			this.state = {value};
		}

		componentWillReceiveProps (nextProps) {
			if (mutable) {
				const value = nextProps[prop];
				this.setState({value});
			}
		}

		pick = (ev) => {
			const value = ev[prop];
			this.setState({value});
			forwardPick(ev, this.props);
		}

		render () {
			const props = Object.assign({}, this.props);
			if (pick) props[pick] = this.pick;
			if (prop) props[prop] = this.state.value;
			delete props[defaultPropKey];

			return <Wrapped {...props} />;
		}
	};
});

export default PickableHOC;
export {PickableHOC as Pickable};
