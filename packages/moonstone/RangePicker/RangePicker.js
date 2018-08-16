/**
 * A component for selecting a number from a range of numbers.
 *
 * @example
 * <RangePicker defaultValue={70} min={0} max={100}></RangePicker>
 *
 * @module moonstone/RangePicker
 */

import Changeable from '@enact/ui/Changeable';
import clamp from 'ramda/src/clamp';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Pure from '@enact/ui/internal/Pure';

import {Picker, PickerItem} from '../internal/Picker';
import {validateRange} from '../internal/validators';

const digits = (num) => {
	// minor optimization
	return	num > -10 && num < 10 && 1 ||
			num > -100 && num < 100 && 2 ||
			num > -1000 && num < 1000 && 3 ||
			Math.floor(Math.log(Math.abs(num)) * Math.LOG10E) + 1;
};

/**
 * Base component of [RangePicker]{@link moonstone/RangePicker.RangePicker} which is not
 * [spottable]{@link spotlight/Spottable.Spottable}.
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
		 * Maximum selectable value (inclusive).
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		max: PropTypes.number.isRequired,

		/**
		 * Minimum selectable value (inclusive).
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		min: PropTypes.number.isRequired,

		/**
		 * Current value.
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		value: PropTypes.number.isRequired,

		/**
		 * The `aria-valuetext` for the picker.
		 *
		 * By default, `aria-valuetext` is set to the current selected child value.
		 *
		 * @type {String}
		 * @memberof moonstone/RangePicker.RangePickerBase.prototype
		 * @public
		 */
		'aria-valuetext': PropTypes.string,

		/**
		 * Children from which to pick.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Class name for component.
		 *
		 * @type {String}
		 * @public
		 */
		className: PropTypes.string,

		/**
		 * A custom icon for the decrementer.
		 *
		 * All strings supported by [Icon]{@link moonstone/Icon.Icon} are supported. Without a
		 * custom icon, the default is used, and is automatically changed when the
		 * [orientation]{@link moonstone/RangePicker.RangePicker#orientation} is changed.
		 *
		 * @type {string}
		 * @public
		 */
		decrementIcon: PropTypes.string,

		/**
		 * Disables the picker.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * A custom icon for the incrementer.
		 *
		 * All strings supported by [Icon]{@link moonstone/Icon.Icon} are supported. Without a
		 * custom icon, the default is used, and is automatically changed when the
		 * [orientation]{@link moonstone/RangePicker.RangePicker#orientation} is changed.
		 *
		 * @type {String}
		 * @public
		 */
		incrementIcon: PropTypes.string,

		/**
		 * Allows the user can use the arrow keys to adjust the picker's value.
		 *
		 * The user may no longer use those arrow keys to navigate while this control is focused.
		 * A default control allows full navigation, but requires individual ENTER presses on the
		 * incrementer and decrementer buttons. Pointer interaction is the same for both formats.
		 *
		 * @type {Boolean}
		 * @public
		 */
		joined: PropTypes.bool,

		/**
		 * Disables animation.
		 *
		 * By default, the picker will animate transitions between items, provided a `width` is
		 * defined.
		 *
		 * @type {Boolean}
		 * @public
		 */
		noAnimation: PropTypes.bool,

		/**
		 * Called when `value` changes.
		 *
		 * @type {Function}
		 * @public
		 */
		onChange: PropTypes.func,

		/**
		 * Orientation of the picker.
		 *
		 * Controls whether the buttons are arranged horizontally or vertically around the value.
		 *
		 * * Values: `'horizontal'`, `'vertical'`
		 *
		 * @type {String}
		 * @default 'horizontal'
		 * @public
		 */
		orientation: PropTypes.oneOf(['horizontal', 'vertical']),

		/**
		 * Pads the display value with zeros up to the number of digits of `min` or max`, whichever
		 * is greater.
		 *
		 * @type {Boolean}
		 * @public
		 */
		padded: PropTypes.bool,

		/**
		 * The smallest value change allowed for the picker.
		 *
		 * For example, a step of `2` would cause the picker to increment from 0 to 2 to 4, etc.
		 *
		 * @type {Number}
		 * @default 1
		 * @public
		 */
		step: PropTypes.number,

		/**
		 * The width of the picker.
		 *
		 * A number can be used to set the minimum number of characters to be shown. Setting a
		 * number to less than the number of characters in the longest value will cause the width to
		 * grow for the longer values.
		 *
		 * A string can be used to select from pre-defined widths:
		 *
		 * * `'small'` - numeric values
		 * * `'medium'` - single or short words
		 * * `'large'` - maximum-sized pickers taking full width of its parent
		 *
		 * By default, the picker will size according to the longest valid value.
		 *
		 * @type {String|Number}
		 * @public
		 */
		width: PropTypes.oneOfType([
			PropTypes.oneOf([null, 'small', 'medium', 'large']),
			PropTypes.number
		]),

		/**
		 * Allows picker to continue from the start of the list after it reaches the end and
		 * vice-versa.
		 *
		 * @type {Boolean}
		 * @public
		 */
		wrap: PropTypes.bool
	},

	computed: {
		disabled: ({disabled, max, min}) => min >= max ? true : disabled,
		label: ({max, min, padded, value}) => {
			if (padded) {
				const maxDigits = digits(Math.max(Math.abs(min), Math.abs(max)));
				const valueDigits = digits(value);
				const start = value < 0 ? 0 : 1;
				const padding = '-00000000000000000000';

				return padding.slice(start, maxDigits - valueDigits + start) + Math.abs(value);
			}

			return value;
		},
		width: ({max, min, width}) => (width || Math.max(max.toString().length, min.toString().length)),
		value: ({min, max, value}) => {
			if (__DEV__) {
				validateRange(value, min, max, 'RangePicker');
			}
			return clamp(min, max, value);
		},
		voiceLabel: ({min, max}) => {
			return JSON.stringify([min, max]);
		}
	},

	render: ({label, value, voiceLabel, ...rest}) => {
		delete rest.padded;
		return (
			<Picker {...rest} data-webos-voice-labels-ext={voiceLabel} index={0} value={value} reverse={false}>
				<PickerItem key={value} marqueeDisabled style={{direction: 'ltr'}}>{label}</PickerItem>
			</Picker>
		);
	}
});

/**
 * A component that lets the user select a number from a range of numbers.
 *
 * By default, `RangePicker` maintains the state of its `value` property. Supply the `defaultValue`
 * property to control its initial value. If you wish to directly control updates to the component,
 * supply a value to `value` at creation time and update it in response to `onChange` events.
 *
 * @class RangePicker
 * @memberof moonstone/RangePicker
 * @mixes ui/Changeable.Changeable
 * @ui
 * @public
 */
const RangePicker = Pure(
	Changeable(
		RangePickerBase
	)
);

/**
 * Default value
 *
 * @name defaultValue
 * @memberof moonstone/RangePicker.RangePicker.prototype
 * @type {Number}
 * @public
 */

export default RangePicker;
export {RangePicker, RangePickerBase};
