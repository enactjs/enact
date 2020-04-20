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

import useSpot from './useSpot';

/**
 * The class name for spottable components. In general, you do not need to directly access this class
 *
 * @memberof spotlight/Spottable
 * @public
 */
const spottableClass = 'spottable';

const ENTER_KEY = 13;
const REMOTE_OK_KEY = 16777221;

const isSpottable = (spotlightDisabled) => !spotlightDisabled;

// Last instance of spottable to be focused
let lastSelectTarget = null;
// Should we prevent select being passed through
let selectCancelled = false;

/**
 * Default configuration for Spottable
 *
 * @hocconfig
 * @memberof spotlight/Spottable.Spottable
 */
const defaultConfig = {
	/**
	 * Whether or not the component should emulate mouse events as a response
	 * to Spotlight 5-way events.
	 *
	 * @type {Boolean}
	 * @default true
	 * @public
	 * @memberof spotlight/Spottable.Spottable.defaultConfig
	 */
	emulateMouse: true
};

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
	const {emulateMouse} = config;

	function Spottable ({
		disabled,
		onSpotlightDisappear,
		onSpotlightDown,
		onSpotlightLeft,
		onSpotlightRight,
		onSpotlightUp,
		selectionKeys,
		spotlightDisabled,
		spotlightId,
		...rest
	}) {
		const spot = useSpot({
			disabled,
			emulateMouse,
			onSpotlightDisappear,
			onSpotlightDown,
			onSpotlightLeft,
			onSpotlightRight,
			onSpotlightUp,
			selectionKeys,
			spotlightDisabled,
			spotlightId,
			...rest
		});
		spot.setFocusedWhenDisabled({spotlightDisabled});
		const spottable = spot.focusedWhenDisabled || isSpottable(spotlightDisabled);

		let tabIndex = rest.tabIndex;

		if (tabIndex == null) {
			tabIndex = -1;
		}

		if (spottable) {
			if (rest.className) {
				rest.className += ' ' + spottableClass;
			} else {
				rest.className = spottableClass;
			}
		}

		if (spotlightId) {
			rest['data-spotlight-id'] = spotlightId;
		}

		// 	onKeyDown,
		// onMouseDown,
		// onMouseUp,
		// onClick,
		// onBlur,
		// onFocus,
		// onMouseEnter,
		// onMouseLeave,
		// onMouseMove,
		// onMouseOut,
		// onMouseOver,
		// onTouchEnd,
		// onTouchMove,
		// onTouchStart,

		return (
			<Wrapped
				{...rest}
				disabled={disabled}
				onBlur={spot.blur}
				onFocus={spot.focus}
				onKeyDown={spot.keyDown}
				onKeyUp={spot.keyUp}
				onMouseEnter={spot.mouseEnter}
				onMouseLeave={spot.mouseLeave}
				ref={spot.ref}
				tabIndex={tabIndex}
			/>
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
	}

	Spottable.defaultProps = {
		selectionKeys: [ENTER_KEY, REMOTE_OK_KEY]
	}

	return Spottable;
});

export default Spottable;
export {
	Spottable,
	spottableClass,
	useSpot
};
