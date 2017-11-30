/**
 * Exports the {@link moonstone/SimpleIntegerPicker.SimpleIntegerPicker} and
 * {@link moonstone/SimpleIntegerPicker.SimpleIntegerPickerBase} components
 *
 * @module moonstone/SimpleIntegerPicker
 */

import Changeable from '@enact/ui/Changeable';
import clamp from 'ramda/src/clamp';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Pure from '@enact/ui/internal/Pure';

import {MarqueeController} from '../Marquee';
import {Picker, PickerItem} from '../internal/Picker';
import SpottablePicker from '../Picker/SpottablePicker';
import {validateRange} from '../internal/validators';

import SimpleIntegerPickerDecorator from './SimpleIntegerPickerDecorator';

import css from './SimpleIntegerPicker.less';

const digits = (num) => {
	// minor optimization
	return	num > -10 && num < 10 && 1 ||
			num > -100 && num < 100 && 2 ||
			num > -1000 && num < 1000 && 3 ||
			Math.floor(Math.log(Math.abs(num)) * Math.LOG10E) + 1;
};

/**
 * {@link moonstone/SimpleIntegerPicker.SimpleIntegerPickerBase} is a component that lets the user select a number
 * from a range of numbers. This version is not spottable. Developers are encouraged to use
 * {@link moonstone/SimpleIntegerPicker.SimpleIntegerPicker}.
 *
 * @class SimpleIntegerPickerBase
 * @memberof moonstone/SimpleIntegerPicker
 * @ui
 * @public
 */
const SimpleIntegerPickerBase = kind({
	name: 'SimpleIntegerPicker',

	propTypes: /** @lends moonstone/SimpleIntegerPicker.SimpleIntegerPickerBase.prototype */ {
		/**
		 * The maximum value selectable by the picker (inclusive).
		 *
		 * @type {Number}
		 * @public
		 */
		max: PropTypes.number.isRequired,

		/**
		 * The minimum value selectable by the picker (inclusive).
		 *
		 * @type {Number}
		 * @public
		 */
		min: PropTypes.number.isRequired,

		/**
		 * Overrides the `aria-valuetext` for the picker. By default, `aria-valuetext` is set
		 * to the current selected child value.
		 *
		 * @type {String}
		 * @memberof moonstone/SimpleIntegerPicker.SimpleIntegerPickerBase.prototype
		 * @public
		 */
		'aria-valuetext': PropTypes.string,

		/**
		 * Assign a custom icon for the decrementer. All strings supported by [Icon]{moonstone/Icon.Icon} are
		 * supported. Without a custom icon, the default is used.
		 *
		 * @type {string}
		 * @public
		 */
		decrementIcon: PropTypes.string,

		/**
		 * When `true`, the SimpleIntegerPicker is shown as disabled and does not generate `onChange` or `onClick`
		 * [events]{@glossary event}.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * When `true`, the input will be enabled to edit
		 *
		 * @type {Boolean}
		 * @public
		 */
		editable : PropTypes.bool,

		/**
		 * Assign a custom icon for the incrementer. All strings supported by [Icon]{moonstone/Icon.Icon} are
		 * supported. Without a custom icon, the default is used.
		 *
		 * @type {string}
		 * @public
		 */
		incrementIcon: PropTypes.string,

		/**
		 * The method to run when the input mounts, giving a reference to the DOM.
		 *
		 * @type {Function}
		 * @private
		 */
		inputRef: PropTypes.func,

		/**
		 *  A function to be run when there is a blur in the input
		 *
		 * @type {Function}
		 * @public
		 */
		onInputBlur : PropTypes.func,

		/**
		 * Sets the orientation of the picker, whether the buttons are above and below or on the
		 * sides of the value. Must be either `'horizontal'` or `'vertical'`.
		 *
		 * @type {String}
		 * @default 'horizontal'
		 * @public
		 */
		orientation: PropTypes.oneOf(['horizontal', 'vertical']),

		/**
		 * When `true`, pads the display value with zeros up to the number of digits of the value of
		 * `min` or max`, whichever is greater.
		 *
		 * @type {Boolean}
		 * @public
		 */
		padded: PropTypes.bool,

		/**
		 * The method to run when the picker mounts, giving a reference to the DOM.
		 *
		 * @type {Function}
		 * @private
		 */
		pickerRef : PropTypes.func,

		/**
		 * Allow the picker to only increment or decrement by a given value. A step of `2` would
		 * cause a picker to increment from 10 to 12 to 14, etc.
		 *
		 * @type {Number}
		 * @default 1
		 * @public
		 */
		step: PropTypes.number,

		/**
		 * Unit label to be appended to the value for display.
		 *
		 * @type {String}
		 * @default ''
		 * @public
		 */
		unit: PropTypes.string,

		/**
		 * The current value of the Picker to be displayed.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		value : PropTypes.number,

		/**
		 * Choose a specific size for your picker. `'small'`, `'medium'`, `'large'`, or set to `null` to
		 * assume auto-sizing. `'small'` is good for numeric pickers, `'medium'` for single or short
		 * word pickers, `'large'` for maximum-sized pickers.
		 *
		 * You may also supply a number. This number will determine the minumum size of the Picker.
		 * Setting a number to less than the number of characters in your longest value may produce
		 * unexpected results.
		 *
		 * @type {String|Number}
		 * @default 'medium'
		 * @public
		 */
		width: PropTypes.oneOfType([
			PropTypes.oneOf([null, 'small', 'medium', 'large']),
			PropTypes.number
		]),

		/**
		 * Should the picker stop incrementing when the picker reaches the last element? Set `wrap`
		 * to true to allow the picker to continue from the opposite end of the list of options.
		 *
		 * @type {Boolean}
		 * @public
		 */
		wrap: PropTypes.bool
	},

	defaultProps : {
		orientation: 'horizontal',
		step: 1,
		unit: '',
		value: 0,
		width: 'medium'
	},

	styles: {
		css
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
		},
		value: ({min, max, value}) => {
			if (__DEV__) {
				validateRange(value, min, max, 'SimpleIntegerPicker');
			}
			return clamp(min, max, value);
		},
		width: ({max, min, width}) => (width || Math.max(max.toString().length, min.toString().length)),
		children: ({editable, inputRef, onInputBlur, unit, value}) => {
			return (
				editable ?
					<input
						className={css.inputClass}
						key={value}
						onBlur={onInputBlur}
						ref={inputRef}
					/> : <PickerItem
						key={value}
					>
						{`${value} ${unit}`}
					</PickerItem>
			);
		},
		classes: ({editable}) => {
			let pickerClass = ['spottable', css.picker];
			if (editable) {
				pickerClass.push(css.selectedPicker);
			}
			return pickerClass.join(' ');
		}
	},

	render: ({classes, pickerRef, ...rest}) => {
		delete rest.editable;
		delete rest.inputRef;
		delete rest.onInputBlur;
		delete rest.padded;
		delete rest.unit;

		return (
			<Picker {...rest} className={classes} index={0} ref={pickerRef} />
		);
	}
});

/**
 * {@link moonstone/SimpleIntegerPicker.SimpleIntegerPicker} is a component that lets the user select a number from
 * a range of numbers.
 *
 * By default, `SimpleIntegerPicker` maintains the state of its `value` property. Supply the `defaultValue`
 * property to control its initial value. If you wish to directly control updates to the component,
 * supply a value to `value` at creation time and update it in response to `onChange` events.
 *
 * @class SimpleIntegerPicker
 * @memberof moonstone/SimpleIntegerPicker
 * @mixes ui/Changeable.Changeable
 * @ui
 * @public
 */
const SimpleIntegerPicker = Pure(
	Changeable(
		SimpleIntegerPickerDecorator(
			MarqueeController(
				{marqueeOnFocus: true},
				SpottablePicker(
					SimpleIntegerPickerBase
				)
			)
		)
	)
);

export default SimpleIntegerPicker;
export {SimpleIntegerPicker, SimpleIntegerPickerBase};
