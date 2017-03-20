/* eslint-disable react/sort-prop-types */

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
 * configured when applied to a component.
 *
 * If the `prop` is overridden, the property names to set the default value and current value change
 * correspondingly.
 *
 * @class Changeable
 * @memberof ui/Changeable
 * @hoc
 * @public
 */
const Changeable = hoc(defaultConfig, (config, Wrapped) => {
	const {prop, change} = config;
	const defaultPropKey = 'default' + cap(prop);

	return class extends React.Component {
		static displayName = 'Changeable'

		static propTypes = /** @lends ui/Changeable.Changeable.prototype */ {
			/**
			 * Default value applied at construction when the value prop is `undefined` or `null`.
			 *
			 * @type {*}
			 * @public
			 */
			[defaultPropKey]: React.PropTypes.any,

			/**
			 * Current value. When set at construction, the component is considered "controlled" and
			 * will only update its internal value when updated by new props. If `undefined`, the
			 * component is "uncontrolled" and `Changeable` will manage the value using callbacks
			 * defined by its configuration.
			 *
			 * @type {*}
			 * @public
			 */
			[prop]: React.PropTypes.any,

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
			disabled: false
		}

		constructor (props) {
			super(props);
			let value = props[defaultPropKey];
			let controlled = false;

			if (prop in props) {
				if (props[prop] != null) {
					value = props[prop];
				}

				controlled = true;
			}

			this.state = {
				controlled,
				value
			};
		}

		componentWillReceiveProps (nextProps) {
			if (this.state.controlled) {
				const value = nextProps[prop];
				this.setState({value});
			} else if (prop in nextProps) {
				// warning! uncontrolled => controlled
			}
		}

		handle = handle.bind(this)

		handleChange = this.handle(
			handle.log,
			forProp('disabled', false),
			forward(change),
			({[prop]: value}) => {
				if (!this.state.controlled) {
					this.setState({value});
				}
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
