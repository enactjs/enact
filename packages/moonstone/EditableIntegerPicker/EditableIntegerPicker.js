/**
 * Moonstone styled editable integer picker.
 *
 * @example
 * <EditableIntegerPicker
 *   editMode
 *   max={10}
 *   min={1}
 * />
 *
 * @module moonstone/EditableIntegerPicker
 * @exports EditableIntegerPicker
 * @exports EditableIntegerPickerBase
 */

import kind from '@enact/core/kind';
import {clamp} from '@enact/core/util';
import Changeable from '@enact/ui/Changeable';
import Pure from '@enact/ui/internal/Pure';
import PropTypes from 'prop-types';
import React from 'react';

import {MarqueeController} from '../Marquee';
import {Picker, PickerItem} from '../internal/Picker';
import {validateRange} from '../internal/validators';

import css from './EditableIntegerPicker.module.less';
import EditableIntegerPickerDecorator from './EditableIntegerPickerDecorator';

const digits = (num) => {
	// minor optimization
	return	num > -10 && num < 10 && 1 ||
			num > -100 && num < 100 && 2 ||
			num > -1000 && num < 1000 && 3 ||
			Math.floor(Math.log(Math.abs(num)) * Math.LOG10E) + 1;
};

/**
 * A picker component that lets the user select a number in between `min` and `max` numbers.
 *
 * This component is not spottable. Developers are encouraged to use
 * {@link moonstone/EditableIntegerPicker.EditableIntegerPicker}.
 *
 * @class EditableIntegerPickerBase
 * @memberof moonstone/EditableIntegerPicker
 * @ui
 * @public
 */
const EditableIntegerPickerBase = kind({
	name: 'EditableIntegerPicker',

	propTypes: /** @lends moonstone/EditableIntegerPicker.EditableIntegerPickerBase.prototype */ {
		/**
		 * The maximum value selectable by the picker (inclusive).
		 *
		 * The range between `min` and `max` should be evenly divisible by
		 * [step]{@link moonstone/EditableIntegerPicker.EditableIntegerPickerBase.step}.
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		max: PropTypes.number.isRequired,

		/**
		 * The minimum value selectable by the picker (inclusive).
		 *
		 * The range between `min` and `max` should be evenly divisible by
		 * [step]{@link moonstone/EditableIntegerPicker.EditableIntegerPickerBase.step}.
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		min: PropTypes.number.isRequired,

		/**
		 * The value for the picker for accessibility read out.
		 *
		 * By default, `aria-valuetext` is set to the current selected child value.
		 *
		 * @type {String}
		 * @memberof moonstone/EditableIntegerPicker.EditableIntegerPickerBase.prototype
		 * @public
		 */
		'aria-valuetext': PropTypes.string,

		/**
		 * The icon for the decrementer.
		 *
		 * All strings supported by [Icon]{@link moonstone/Icon.Icon} are supported. Without a
		 * custom icon, the default is used.
		 *
		 * @type {String}
		 * @public
		 */
		decrementIcon: PropTypes.string,

		/**
		 * Disables the picker and prevents [events]{@link /docs/developer-guide/glossary/#event}
		 * from firing.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Displays the input field instead of the picker components.
		 *
		 * @type {Boolean}
		 * @public
		 */
		editMode: PropTypes.bool,

		/**
		 * The icon for the incrementer.
		 *
		 * All strings supported by [Icon]{@link moonstone/Icon.Icon} are supported. Without a
		 * custom icon, the default is used.
		 *
		 * @type {String}
		 * @public
		 */
		incrementIcon: PropTypes.string,

		/**
		 * Called when the input mounts witha reference to the DOM node.
		 *
		 * @type {Function}
		 * @private
		 */
		inputRef: PropTypes.func,

		/**
		 * Called when there the input is blurred.
		 *
		 * @type {Function}
		 * @public
		 */
		onInputBlur: PropTypes.func,

		/**
		 * Called when the pickerItem is clicked and `editMode` is `false`.
		 *
		 * In response, the `editMode` should be switched to `true` to enable editing. This is
		 * automatically handled by {@link moonstone/EditableIntegerPicker.EditableIntegerPicker}.
		 *
		 * @type {Function}
		 * @public
		 */
		onPickerItemClick: PropTypes.func,

		/**
		 * The orientation of the picker.
		 *
		 * @type {('horizontal'|'vertical')}
		 * @default 'horizontal'
		 * @public
		 */
		orientation: PropTypes.oneOf(['horizontal', 'vertical']),

		/**
		 * Pads the display value with zeros.
		 *
		 * The number of zeros used is the number of digits of the value of
		 * [min]{@link moonstone/EditableIntegerPicker.EditableIntegerPickerBase.min} or
		 * [max]{@link moonstone/EditableIntegerPicker.EditableIntegerPickerBase.max}, whichever is
		 * greater.
		 *
		 * @type {Boolean}
		 * @public
		 */
		padded: PropTypes.bool,

		/**
		 * Called when the picker mounts with a reference to the picker DOM node.
		 *
		 * @type {Function}
		 * @private
		 */
		pickerRef: PropTypes.func,

		/**
		 * Allow the picker to only increment or decrement by a given value.
		 *
		 * For example, a step of `2` would cause a picker to increment from 10 to 12 to 14, etc.
		 * It must evenly divide into the range designated by `min` and `max`.
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
		 * The current value of the Picker.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		value: PropTypes.number,

		/**
		 * The size of the picker.
		 *
		 * `'small'`, `'medium'`, `'large'`, or set to `null` to assume auto-sizing. `'small'` is
		 * good for numeric pickers, `'medium'` for single or short word pickers, `'large'` for
		 * maximum-sized pickers.
		 *
		 * You may also supply a number which will determine the minumum size of the Picker.
		 * Setting a number to less than the number of characters in your longest value may produce
		 * unexpected results.
		 *
		 * @type {('small'|'medium'|'large')|Number}
		 * @default 'medium'
		 * @public
		 */
		width: PropTypes.oneOfType([
			PropTypes.oneOf([null, 'small', 'medium', 'large']),
			PropTypes.number
		]),

		/**
		 * Allows the picker to increment from the max to min value and vice versa.
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
		css,
		className: 'editableIntegerPicker'
	},

	computed: {
		value: ({min, max, value}) => {
			if (__DEV__) {
				validateRange(value, min, max, 'EditableIntegerPicker');
			}
			return clamp(min, max, value);
		},
		width: ({max, min, width}) => (width || Math.max(max.toString().length, min.toString().length)),
		children: ({editMode, inputRef, max, min, onInputBlur, onPickerItemClick, padded, unit, value}) => {
			let label;
			value = clamp(min, max, value);

			if (padded) {
				const maxDigits = digits(Math.max(Math.abs(min), Math.abs(max)));
				const valueDigits = digits(value);
				const start = value < 0 ? 0 : 1;
				const padding = '-00000000000000000000';

				label = padding.slice(start, maxDigits - valueDigits + start) + Math.abs(value);
			} else {
				label = value;
			}

			if (editMode) {
				return (
					<input
						className={css.input}
						key="edit"
						onBlur={onInputBlur}
						ref={inputRef}
					/>
				);
			}

			let children = label;
			if (unit) {
				children = `${label} ${unit}`;
			}

			return (
				<PickerItem
					key={value}
					onClick={onPickerItemClick}
				>
					{children}
				</PickerItem>
			);
		},
		ariaValueText: ({unit, value}) => unit ? `${value} ${unit}` : null,
		className: ({className, editMode, styler}) => editMode ? styler.append({editMode}) : className,
		disabled: ({disabled, max, min}) => min >= max ? true : disabled
	},

	render: ({ariaValueText, pickerRef, ...rest}) => {
		delete rest.editMode;
		delete rest.inputRef;
		delete rest.onInputBlur;
		delete rest.onPickerItemClick;
		delete rest.padded;
		delete rest.unit;

		return (
			<Picker aria-valuetext={ariaValueText} {...rest} index={0} ref={pickerRef} />
		);
	}
});

/**
 * A component that lets the user select a number from a range of numbers.
 *
 * By default, `EditableIntegerPicker` maintains the state of its `value` property. Supply the
 * `defaultValue` property to control its initial value. If you wish to directly control updates to
 * the component, supply a value to `value` at creation time and update it in response to `onChange`
 * events.
 *
 * @class EditableIntegerPicker
 * @memberof moonstone/EditableIntegerPicker
 * @extends moonstone/EditableIntegerPicker.EditableIntegerPickerBase
 * @mixes ui/Changeable.Changeable
 * @ui
 * @public
 */
const EditableIntegerPicker = Pure(
	Changeable(
		EditableIntegerPickerDecorator(
			MarqueeController(
				{marqueeOnFocus: true},
				EditableIntegerPickerBase
			)
		)
	)
);

export default EditableIntegerPicker;
export {EditableIntegerPicker, EditableIntegerPickerBase};
