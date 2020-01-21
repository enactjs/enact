/**
 * A higher-order component at handles toggle state.
 *
 * @module ui/Toggleable
 * @exports Toggleable
 */

import hoc from '@enact/core/hoc';
import {cap} from '@enact/core/util';
import PropTypes from 'prop-types';
import React from 'react';
import warning from 'warning';

import {configureToggle, defaultConfig, useToggle} from './useToggle';

/**
 * A higher-order component that applies a 'toggleable' behavior to its wrapped component.
 *
 * Its default event and property can be configured when applied to a component.
 *
 * Note: This HoC passes a number of props to the wrapped component that should be passed to the
 * main DOM node or consumed by the wrapped compoment.
 *
 * Example:
 * ```
 * const Item = ({selected, ...rest}) => (<div {...rest}>{selected}</div>);
 * ...
 * const ToggleItem = Toggleable({toggleProp: 'onClick'}, Item);
 * ```
 *
 * @class Toggleable
 * @memberof ui/Toggleable
 * @hoc
 * @public
 */
const ToggleableHOC = hoc(defaultConfig, (config, Wrapped) => {
	const fn = useToggle.configure(config);

	function Toggleable (props) {
		const updated = {
			...props,
			...fn(props)
		};

		const defaultPropKey = 'default' + cap(config.prop || defaultConfig.prop);

		warning(
			!(config.prop in props && defaultPropKey in props),
			`Do not specify both '${config.prop}' and '${defaultPropKey}' for Toggleable instances.
			'${defaultPropKey}' will be ignored unless '${config.prop}' is 'null' or 'undefined'.`
		);

		delete updated[defaultPropKey];

		return (
			<Wrapped {...updated} />
		);
	}

	/** @lends ui/Toggleable.Toggleable.prototype */
	Toggleable.propTypes = {
		/**
		 * Default toggled state applied at construction when the toggled prop is `undefined` or
		 * `null`.
		 *
		 * @name defaultSelected
		 * @memberof ui/Toggleable.Toggleable.prototype
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		defaultSelected: PropTypes.bool,

		/**
		 * Whether or not the component is in a disabled state.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Event callback to notify that state should be toggled.
		 *
		 * @name onToggle
		 * @memberof ui/Toggleable.Toggleable.prototype
		 * @type {Function}
		 * @public
		 */
		onToggle: PropTypes.func,

		/**
		 * Current toggled state.
		 *
		 * When set at construction, the component is considered 'controlled' and will only
		 * update its internal value when updated by new props. If undefined, the component
		 * is 'uncontrolled' and `Toggleable` will manage the toggled state using callbacks
		 * defined by its configuration.
		 *
		 * @name selected
		 * @memberof ui/Toggleable.Toggleable.prototype
		 * @type {Boolean}
		 * @public
		 */
		selected: PropTypes.bool
	};

	Toggleable.defaultProps = {
		disabled: false
	};

	return Toggleable;
});

export default ToggleableHOC;
export {
	configureToggle,
	ToggleableHOC as Toggleable,
	useToggle
};
