/**
 * Exports the {@link moonstone/RangePicker.RangePicker} and
 * {@link moonstone/RangePicker.RangePickerBase} components
 *
 * @module moonstone/RangePicker
 */

import kind from '@enact/core/kind';
import React from 'react';

import PickerCore from '../Picker/PickerCore';
import PickerItem from '../Picker/PickerItem';
import SpottablePicker from '../Picker/SpottablePicker';

const digits = (num) => {
	// minor optimization
	return	num > -10 && num < 10 && 1 ||
			num > -100 && num < 100 && 2 ||
			num > -1000 && num < 1000 && 3 ||
			Math.floor(Math.log(Math.abs(num)) * Math.LOG10E) + 1;
};

/**
 * {@link moonstone/RangePicker.RangePickerBase} is a component that lets the user select a number
 * from a range of numbers. This version is not spottable. Developers are encouraged to use
 * {@link moonstone/RangePicker.RangePicker}.
 *
 * @class RangePickerBase
 * @memberof moonstone/RangePicker
 * @ui
 * @public
 */
const RangePickerBase = kind({
	name: 'RangePicker',

	propTypes: /** @lends moonstone/RangePicker.RangePickerBase.prototype */ {
		/**
		 * The maximum value selectable by the picker (inclusive).
		 *
		 * @type {Number}
		 * @public
		 */
		max: React.PropTypes.number.isRequired,

		/**
		 * The minimum value selectable by the picker (inclusive).
		 *
		 * @type {Number}
		 * @public
		 */
		min: React.PropTypes.number.isRequired,

		/**
		 * Current value
		 *
		 * @type {Number}
		 * @public
		 */
		value: React.PropTypes.number.isRequired,

		/**
		 * Children from which to pick
		 *
		 * @type {Node}
		 * @public
		 */
		children: React.PropTypes.node,

		/**
		 * Class name for component
		 *
		 * @type {String}
		 * @public
		 */
		className: React.PropTypes.string,

		/**
		 * Assign a custom icon for the decrementer. All strings supported by [Icon]{Icon} are
		 * supported. Without a custom icon, the default is used, and is automatically changed when
		 * the [orientation]{Icon#orientation} is changed.
		 *
		 * @type {string}
		 * @public
		 */
		decrementIcon: React.PropTypes.string,

		/**
		 * When `true`, the [button]{@glossary button} is shown as disabled and does not
		 * generate tap [events]{@glossary event}.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: React.PropTypes.bool,

		/**
		 * Assign a custom icon for the incrementer. All strings supported by [Icon]{Icon} are
		 * supported. Without a custom icon, the default is used, and is automatically changed when
		 * the [orientation]{Icon#orientation} is changed.
		 *
		 * @type {string}
		 * @public
		 */
		incrementIcon: React.PropTypes.string,

		/**
		 * Determines the user interaction of the control. A joined picker allows the user to use
		 * the arrow keys to adjust the picker's value. The user may no longer use those arrow keys
		 * to navigate, while this control is focused. A split control allows full navigation,
		 * but requires individual ENTER presses on the incrementer and decrementer buttons.
		 * Pointer interaction is the same for both formats.
		 *
		 * @type {Boolean}
		 * @public
		 */
		joined: React.PropTypes.bool,

		/**
		 * By default, the picker will animate transitions between items if it has a defined
		 * `width`. Specifying `noAnimation` will prevent any transition animation for the
		 * component.
		 *
		 * @type {Boolean}
		 * @public
		 */
		noAnimation: React.PropTypes.bool,

		/**
		 * A function to run when the control should increment or decrement.
		 *
		 * @type {Function}
		 * @public
		 */
		onChange: React.PropTypes.func,

		/**
		 * Sets the orientation of the picker, whether the buttons are above and below or on the
		 * sides of the value. Must be either `'horizontal'` or `'vertical'`.
		 *
		 * @type {String}
		 * @default 'horizontal'
		 * @public
		 */
		orientation: React.PropTypes.oneOf(['horizontal', 'vertical']),

		/**
		 * When `true`, pads the display value with zeros up to the number of digits of the value of
		 * `min` or max`, whichever is greater.
		 *
		 * @type {Boolean}
		 * @public
		 */
		padded: React.PropTypes.bool,

		/**
		 * Allow the picker to only increment or decrement by a given value. A step of `2` would
		 * cause a picker to increment from 10 to 12 to 14, etc.
		 *
		 * @type {Number}
		 * @default 1
		 * @public
		 */
		step: React.PropTypes.number,

		/**
		 * Choose a specific size for your picker. `'small'`, `'medium'`, `'large'`, or set to `null` to
		 * assume auto-sizing. `'small'` is good for numeric pickers, `'medium'` for single or short
		 * word pickers, `'large'` for maximum-sized pickers.
		 *
		 * @type {String}
		 * @public
		 */
		width: React.PropTypes.oneOf([null, 'small', 'medium', 'large']),

		/**
		 * Should the picker stop incrementing when the picker reaches the last element? Set `wrap`
		 * to true to allow the picker to continue from the opposite end of the list of options.
		 *
		 * @type {Boolean}
		 * @public
		 */
		wrap: React.PropTypes.bool
	},

	computed: {
		label: ({max, min, padded, value}) => {
			if (padded) {
				const maxDigits = digits(Math.max(Math.abs(min), Math.abs(max)));
				const valueDigits = digits(value);
				const start = value < 0 ? 0 : 1;
				const padding = '-00000000000000000000';

				return padding.slice(start, maxDigits - valueDigits + start) + Math.abs(value);
			}

			return value;
		}
	},

	render: ({label, value, ...rest}) => {
		delete rest.padded;
		return (
			<PickerCore {...rest} index={0} value={value}>
				<PickerItem key={value} marqueeDisabled>{label}</PickerItem>
			</PickerCore>
		);
	}
});

/**
 * {@link moonstone/RangePicker.RangePicker} is a component that lets the user select a number from
 * a range of numbers.
 *
 * @class RangePicker
 * @memberof moonstone/RangePicker
 * @ui
 * @public
 */
const RangePicker = SpottablePicker(RangePickerBase);

export default RangePicker;
export {RangePicker, RangePickerBase};
