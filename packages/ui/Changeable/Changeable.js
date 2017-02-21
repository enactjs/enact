/**
 * Exports the {@link ui/Changeable.Changeable} Higher-order Component (HOC).
 *
 * @module ui/Changeable
 */

import {forProp, forward, handle} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {cap} from '@enact/core/util';
import React from 'react';

/**
 * Default config for {@link ui/Changeable.Changeable}.
 *
 * @memberof ui/Changeable.Changeable
 * @hocconfig
 */
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
	 * @memberof ui/Changeable.Changeable.defaultConfig
	 */
	mutable: false,

	/**
	 * Configures the prop name to pass the callback to change the value
	 *
	 * @type {String}
	 * @default 'onChange'
	 * @memberof ui/Changeable.Changeable.defaultConfig
	 */
	change: 'onChange',

	/**
	 * Configures the prop name to pass the current value
	 *
	 * @type {String}
	 * @default 'value'
	 * @memberof ui/Changeable.Changeable.defaultConfig
	 */
	prop: 'value'
};

/**
 * {@link ui/Changeable.Changeable} is a Higher-order Component that applies a
 * 'Changeable' behavior to its wrapped component.  Its default event and value properties can be
 * configured when applied to a component. In addition, it supports `mutable` config setting that
 * allows the HOC to accept incoming settings for the `prop`.
 *
 * By default, you can set the initial state of the Changeable item by passing `defaultValue`.  Once
 * rendered, the HOC manages the state of `value`.  If the `prop` is overridden, the names change
 * correspondingly.
 *
 * @class Changeable
 * @memberof ui/Changeable
 * @hoc
 * @public
 */
const Changeable = hoc(defaultConfig, (config, Wrapped) => {
	const {mutable, prop, change} = config;
	const defaultPropKey = 'default' + cap(prop);

	return class extends React.Component {
		static displayName = 'Changeable'

		static propTypes = /** @lends ui/Changeable.Changeable.prototype */ {

			[defaultPropKey]: React.PropTypes.any,

			[prop]: React.PropTypes.any,

			/**
			 * Controls whether the component is disabled.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			disabled: React.PropTypes.bool	// eslint-disable-line react/sort-prop-types
		}

		static defaultProps = {
			disabled: false
		}

		constructor (props) {
			super(props);
			const key = (mutable && prop in props) ? prop : defaultPropKey;
			const value = props[key];
			this.state = {value};
		}

		componentWillReceiveProps (nextProps) {
			if (mutable && prop in nextProps) {
				const value = nextProps[prop];
				this.setState({value});
			}
		}

		handle = handle.bind(this)

		handleChange = this.handle(
			forProp('disabled', false),
			forward('onChange'),
			(ev) => {
				const value = ev[prop];
				this.setState({value});
			}
		)

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
