/**
 * Exports the {@link module:@enact/ui/Changeable~Changeable} Higher-order Component (HOC).
 *
 * @module @enact/ui/Changeable
 */

import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {cap} from '@enact/core/util';
import React from 'react';

import {anyPrimitive} from '../validators/PropTypeValidators';

const defaultConfig = {
	/**
	 * If a Changeable component is used to maintain uncommitted state within another component,
	 * `mutable` allows `prop` to be updated via incoming props in addition to the `change`
	 * callback. When `true` and `prop` is specified, it will take precendence over the default
	 * value.
	 *
	 * When using this property, it may be necessary to prevent unnecessary updates using
	 * `shouldComponentUpdate()` to avoid resetting the value inadvertently.
	 *
	 * @type {Boolean}
	 * @default false
	 */
	mutable: false,

	/**
	 * Configures the prop name to pass the callback to change the value
	 *
	 * @type {String}
	 * @default 'onChange'
	 */
	change: 'onChange',

	/**
	 * Configures the prop name to pass the current value
	 *
	 * @type {String}
	 * @default 'value'
	 */
	prop: 'value'
};

/**
 * {@link module:@enact/ui/Changeable~Changeable} is a Higher-order Component that applies a
 * 'Changeable' behavior to its wrapped component.  Its default event and value properties can be
 * configured when applied to a component. In addition, it supports `mutable` config setting that
 * allows the HOC to accept incoming settings for the `prop`.
 *
 * By default, you can set the initial state of the Changeable item by passing `defaultValue`.  Once
 * rendered, the HOC manages the state of `value`.  If the `prop` is overridden, the names change
 * correspondingly.
 *
 * @class Changeable
 * @ui
 * @public
 */
const Changeable = hoc(defaultConfig, (config, Wrapped) => {
	const {mutable, prop, change} = config;
	const defaultPropKey = 'default' + cap(prop);
	const forwardChange = forward(change);

	return class extends React.Component {
		static displayName = 'Changeable'

		static propTypes = {

			[defaultPropKey]: anyPrimitive,

			[prop]: anyPrimitive,

			/**
			 * Controls whether the component is disabled.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			disabled: React.PropTypes.bool	// eslint-disable-line react/sort-prop-types
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

		handleChange = (ev) => {
			if (!this.props.disabled) {
				const value = ev[prop];
				this.setState({value});
				forwardChange(ev, this.props);
			}
		}

		render () {
			const props = Object.assign({}, this.props);
			if (change) props[change] = this.handleChange;
			if (prop) props[prop] = this.state.value;
			delete props[defaultPropKey];

			return <Wrapped {...props} />;
		}
	};
});

export default Changeable;
export {Changeable};
