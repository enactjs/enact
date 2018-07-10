/* eslint-disable react/sort-prop-types */

/**
 * Exports the {@link ui/Changeable.Changeable} higher-order component (HOC).
 *
 * @module ui/Changeable
 * @exports Changeable
 */

import {forProp, forward, handle} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {cap} from '@enact/core/util';
import React from 'react';
import PropTypes from 'prop-types';
import warning from 'warning';

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
 * {@link ui/Changeable.Changeable} is a higher-order component (HOC) that applies a
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

	return class extends React.PureComponent {
		static displayName = 'Changeable'

		static propTypes = /** @lends ui/Changeable.Changeable.prototype */ {
			/**
			 * Event callback to notify that the value has changed. The event object must contain a
			 * property with the same name as the configured `prop`.
			 *
			 * @type {Function}
			 * @public
			 */
			[change]: PropTypes.func,

			/**
			 * Default value applied at construction when the value prop is `undefined` or `null`.
			 *
			 * @type {*}
			 * @public
			 */
			[defaultPropKey]: PropTypes.any,

			/**
			 * Current value. When set at construction, the component is considered "controlled" and
			 * will only update its internal value when updated by new props. If `undefined`, the
			 * component is "uncontrolled" and `Changeable` will manage the value using callbacks
			 * defined by its configuration.
			 *
			 * @type {*}
			 * @public
			 */
			[prop]: PropTypes.any,

			/**
			 * Controls whether the component is disabled.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			disabled: PropTypes.bool
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
			} else {
				warning(
					!(prop in nextProps),
					`'${prop}' specified for an uncontrolled instance of Changeable and will be
					ignored. To make this instance of Changeable controlled, '${prop}' should be
					specified at creation.`
				);
			}
		}

		handle = handle.bind(this)

		handleChange = this.handle(
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
