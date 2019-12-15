/**
 * Adds spottability to components.
 *
 * @module spotlight/Spottable
 * @exports Spottable
 * @exports spottableClass
 */

import hoc from '@enact/core/hoc';
import PropTypes from 'prop-types';
import React from 'react';

import {
	configureSpottable,
	defaultConfig,
	defaultProps,
	spottableClass,
	useSpottable
} from './useSpottable';

/**
 * Constructs a Spotlight 5-way navigation-enabled higher-order component.
 *
 * Note: This HoC passes a number of props to the wrapped component that should be passed to the
 * main DOM node.
 *
 * Example:
 * ```
 *	const Component = ({myProp, ...rest}) => (
 *		<div {...rest}>{myProp}</div>
 *	);
 *	...
 *	const SpottableComponent = Spottable(Component);
 * ```
 * @class Spottable
 * @memberof spotlight/Spottable
 * @param  {Object} defaultConfig Set of default configuration parameters
 * @param  {Function} Wrapped Component to wrap
 *
 * @hoc
 * @returns {Function} Spottable
 */
const Spottable = hoc(defaultConfig, (config, Wrapped) => {
	const hook = configureSpottable(config);

	// eslint-disable-next-line no-shadow
	function Spottable (props) {
		const updated = {
			...props,
			...hook(props)
		};

		delete updated.onSpotlightDisappear;
		delete updated.onSpotlightDown;
		delete updated.onSpotlightLeft;
		delete updated.onSpotlightRight;
		delete updated.onSpotlightUp;
		delete updated.selectionKeys;
		delete updated.spotlightId;

		return (
			<Wrapped {...updated} />
		);
	}

	Spottable.propTypes = /** @lends spotlight/Spottable.Spottable.prototype */ {
		/**
		 * Whether or not the component is in a disabled state.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * The handler to run when the component is removed while retaining focus.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightDisappear: PropTypes.func,

		/**
		 * The handler to run when the 5-way down key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightDown: PropTypes.func,

		/**
		 * The handler to run when the 5-way left key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightLeft: PropTypes.func,

		/**
		 * The handler to run when the 5-way right key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightRight: PropTypes.func,

		/**
		 * The handler to run when the 5-way up key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightUp: PropTypes.func,

		/**
		 * An array of numbers representing keyCodes that should trigger mouse event
		 * emulation when `emulateMouse` is `true`. If a keyCode equals a directional
		 * key, then default 5-way navigation will be prevented when that key is pressed.
		 *
		 * @type {Number[]}
		 * @default [13, 16777221]
		 * @public
		 */
		selectionKeys: PropTypes.arrayOf(PropTypes.number),

		/**
		 * When `true`, the component cannot be navigated using spotlight.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		spotlightDisabled: PropTypes.bool,

		/**
		 * Used to identify this component within the Spotlight system
		 *
		 * @type {String}
		 * @public
		 */
		spotlightId: PropTypes.string,

		/**
		 * The tabIndex of the component. This value will default to -1 if left
		 * unset and the control is spottable.
		 *
		 * @type {Number}
		 * @public
		 */
		tabIndex: PropTypes.number
	};

	Spottable.defaultProps = defaultProps;

	return Spottable;
});

export default Spottable;
export {
	configureSpottable,
	Spottable,
	spottableClass,
	useSpottable
};
