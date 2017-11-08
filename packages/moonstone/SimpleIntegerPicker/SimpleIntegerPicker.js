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


import {Picker, PickerItem} from '../internal/Picker';
import SpottablePicker from '../Picker/SpottablePicker';
import {MarqueeController} from '../Marquee';
import SimpleIntegerPickerDecorator from './SimpleIntegerPickerDecorator';
import {validateRange} from '../internal/validators';

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
		 * Current value
		 *
		 * @type {Number}
		 * @public
		 */
		value: PropTypes.number.isRequired,

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
		 * Children from which to pick
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Class name for component
		 *
		 * @type {String}
		 * @public
		 */
		className: PropTypes.string,

		/**
		 * Assign a custom icon for the decrementer. All strings supported by [Icon]{Icon} are
		 * supported. Without a custom icon, the default is used, and is automatically changed when
		 * the [orientation]{Icon#orientation} is changed.
		 *
		 * @type {string}
		 * @public
		 */
		decrementIcon: PropTypes.string,

		/**
		 * When `true`, the SimpleIntegerPicker is shown as disabled and does not generate `onChange`
		 * [events]{@glossary event}.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Assign a custom icon for the incrementer. All strings supported by [Icon]{Icon} are
		 * supported. Without a custom icon, the default is used, and is automatically changed when
		 * the [orientation]{Icon#orientation} is changed.
		 *
		 * @type {string}
		 * @public
		 */
		incrementIcon: PropTypes.string,

		/**
		 *  A function to be run when there is a change in the input
		 *
		 * @type {Function}
		 * @public
		 */
		inputChange : PropTypes.func,

		/**
		 * The method to run when the input mounts, giving a reference to the DOM.
		 *
		 * @type {Function}
		 * @private
		 */
		inputRef: PropTypes.func,

		/**
		 * The value from the input field
		 * expanded.
		 *
		 * @type {Number}
		 * @public
		 */
		inputValue : PropTypes.number,

		/**
		 * When `true`, the input will be enabled
		 * expanded.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		isInputMode : PropTypes.bool,

		/**
		 * By default, the picker will animate transitions between items if it has a defined
		 * `width`. Specifying `noAnimation` will prevent any transition animation for the
		 * component.
		 *
		 * @type {Boolean}
		 * @public
		 */
		noAnimation: PropTypes.bool,

		/**
		 *  A function to be run when there is a blur in the input
		 *
		 * @type {Function}
		 * @public
		 */
		onBlurHandler : PropTypes.func,

		/**
		 *  A function to be run when a `onChange` event triggered in the picker
		 *
		 * @type {Function}
		 * @public
		 */
		onChangeHandler : PropTypes.func,

		/**
		 * A function to run when the control is clicked to enable the input field
		 *
		 * @type {Function}
		 * @public
		 */
		onClick: PropTypes.func,

		/**
		 *  A function to be run when a `onClick` event triggered in the picker
		 *
		 * @type {Function}
		 * @public
		 */
		onClickHandler : PropTypes.func,

		/**
		 *  A function to be run when a `onKeyDown` event triggered in the picker
		 *
		 * @type {Function}
		 * @public
		 */
		onKeyDownHandler : PropTypes.func,

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
		 * @public
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
		 * Units in the SimpleIntegerPicker
		 *
		 * @type {String}
		 * @default ''
		 * @public
		 */
		units: PropTypes.string,

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
		isInputMode : false,
		inputValue : 0,
		min: 0,
		max: 100,
		orientation: 'horizontal',
		padded: false,
		step: 1,
		units: '',
		width: 'medium',
		wrap: false
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

		children: ({isInputMode, inputChange, inputRef, inputValue, onBlurHandler, units, value}) => {
			return (
				isInputMode ?
					<input
						autoFocus
						className={css.inputClass}
						onBlur={onBlurHandler}
						onKeyDown={inputChange}
						ref={inputRef}
					/> : <PickerItem
						key={value}
					>
						{`${inputValue} ${units}`}
					</PickerItem>
			);
		},

		classes: ({isInputMode}) => {
			let pickerClass = ['spottable', css.picker];
			if (isInputMode) {
				pickerClass.push(css.selectedPicker);
			}
			return pickerClass.join(' ');
		}
	},

	render: ({children, classes, inputValue, onChangeHandler, onClickHandler, onKeyDownHandler, pickerRef, ...rest}) => {
		delete rest.padded;
		delete rest.inputRef;
		delete rest.inputChange;
		delete rest.onBlurHandler;
		delete rest.isInputMode;
		delete rest.units;

		return (
			<Picker
				{...rest}
				className={classes}
				index={0}
				noAnimation={false}
				onChange={onChangeHandler}
				onClick={onClickHandler}
				onKeyDown={onKeyDownHandler}
				ref={pickerRef}
				value={inputValue}
			>
				{children}
			</Picker>
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
