/* eslint-disable react/sort-prop-types */

/**
 * A higher-order component that adds state management for a single prop via a single event handler.
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
 * A higher-order component that adds state management to a component for a single prop via
 * a single event callback.
 *
 * Applying `Changeable` to a component will pass two additional props: the current value from state
 * and an event callback to invoke when the value changes. By default, the value is passed in the
 * `value` prop and the callback is passed in the `onChange` callback but both are configurable
 * through the HOC config object.
 *
 * If `value` is passed to `Changeable`, the HOC assumes that the value is managed elsewhere and it
 * will not update its internal state. To set an initial value, use `defaultValue` instead.
 *
 * To update the value from the wrapped component, call `onChange` with an object containing a
 * `value` member with the new value. `Changeable` will update its internal state and pass the
 * updated value back down to the wrapped component.
 *
 * *Note:* If the `prop` is overridden, the property names to set the default value and current
 * value change correspondingly.
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
			 * Called to notify `Changeable` that the value has changed.
			 *
			 * The event object must contain a property with the same name as the configured `prop`.
			 *
			 * @name onChange
			 * @memberof ui/Changeable.Changeable.prototype
			 * @type {Function}
			 * @public
			 */
			[change]: PropTypes.func,

			/**
			 * The value set at construction when the value prop is `undefined` or `null`.
			 *
			 * This prop is consumed by `Changeable` and not passed onto the wrapped component.
			 *
			 * @name defaultValue
			 * @memberof ui/Changeable.Changeable.prototype
			 * @type {*}
			 * @public
			 */
			[defaultPropKey]: PropTypes.any,

			/**
			 * The current value.
			 *
			 * When set at construction, the component is considered "controlled" and will only
			 * update its internal value when updated by new props. If `undefined`, the component is
			 * "uncontrolled" and `Changeable` will manage the value using callbacks defined by its
			 * configuration.
			 *
			 * @type {*}
			 * @public
			 */
			[prop]: PropTypes.any,

			/**
			 * Prevents updates to the internal state of `Changeable`.
			 *
			 * `disabled` is forwarded on to the wrapped component.
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

		static getDerivedStateFromProps (props, state) {
			if (state.controlled) {
				const value = props[prop];
				if (typeof value !== 'undefined' && value !== null) {
					return {value};
				} else {
					return {value: props[defaultPropKey]};
				}
			}

			warning(
				!(prop in props),
				`'${prop}' specified for an uncontrolled instance of Changeable and will be
				ignored. To make this instance of Changeable controlled, '${prop}' should be
				specified at creation.`
			);

			return null;
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
export {
	Changeable
};
