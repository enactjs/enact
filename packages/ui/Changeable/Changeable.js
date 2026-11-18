/**
 * A higher-order component that adds state management for a single prop via a single event handler.
 *
 * @module ui/Changeable
 * @exports Changeable
 */

import {forProp, forward, handle} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import useHandlers from '@enact/core/useHandlers';
import {cap, checkPropTypes} from '@enact/core/util';
import PropTypes from 'prop-types';
import {memo, useEffect, useState} from 'react';
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

	const changeHandlers = {
		onChange: handle(
			forProp('disabled', false),
			forward(change),
			({[prop]: value}, props, {controlled, setValue}) => {
				if (!controlled) {
					setValue(value);
				}
			}
		)
	};

	// eslint-disable-next-line no-shadow
	function Changeable ({disabled = false, ...rest}) {
		const props = {disabled, ...rest};
		const propValue = props[prop];
		checkPropTypes(Changeable, props);

		// Whether the instance is controlled is decided once, at mount, by the presence of `prop`.
		const [controlled] = useState(() => prop in props);
		const [value, setValue] = useState(() => (propValue != null ? propValue : props[defaultPropKey]));

		// When controlled, keep the internal value in sync with `prop` whenever it changes. This
		// replaces the former `getDerivedStateFromProps` and runs during render so the wrapped
		// component never receives a stale value.
		const [prevPropValue, setPrevPropValue] = useState(propValue);
		if (controlled && !Object.is(propValue, prevPropValue)) {
			setPrevPropValue(propValue);
			setValue(propValue);
		}

		const handlers = useHandlers(changeHandlers, props, {controlled, setValue});

		useEffect(() => {
			warning(
				!(prop in props && defaultPropKey in props),
				`Do not specify both '${prop}' and '${defaultPropKey}' for Changeable instances.
				'${defaultPropKey}' will be ignored unless '${prop}' is 'null' or 'undefined'.`
			);
		// Only warn about the props used at mount, as the former constructor did
		// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		warning(
			controlled || typeof propValue === 'undefined',
			`'${prop}' specified for an uncontrolled instance of Changeable and will be
			ignored. To make this instance of Changeable controlled, '${prop}' should be
			specified at creation.`
		);

		const updated = {...props};
		if (change) updated[change] = handlers.onChange;
		if (prop) updated[prop] = value;
		delete updated[defaultPropKey];

		return <Wrapped {...updated} />;
	}

	Changeable.propTypes = /** @lends ui/Changeable.Changeable.prototype */ {
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
	};

	// Preserve the render bail-out previously provided by `PureComponent`
	const MemoizedChangeable = memo(Changeable);
	MemoizedChangeable.displayName = 'Changeable';

	return MemoizedChangeable;
});

export default Changeable;
export {
	Changeable
};
