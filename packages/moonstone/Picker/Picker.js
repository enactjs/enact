/**
 * Exports the {@link moonstone/Picker.Picker} and {@link moonstone/Picker.PickerBase}
 * components. The default export is {@link moonstone/Picker.Picker}.
 *
 * @module moonstone/Picker
 */

import clamp from 'ramda/src/clamp';
import kind from '@enact/core/kind';
import React from 'react';

import {MarqueeController} from '../Marquee';
import {validateRange} from '../internal/validators';

import PickerCore, {PickerItem} from '../internal/Picker';
import SpottablePicker from './SpottablePicker';

/**
 * The base component for {@link moonstone/Picker.Picker}. This version is not spottable.
 *
 * @class PickerBase
 * @memberof moonstone/Picker
 * @ui
 * @public
 */
const PickerBase = kind({
	name: 'Picker',

	propTypes: /** @lends moonstone/Picker.PickerBase.prototype */ {
		/**
		 * Children from which to pick
		 *
		 * @type {Node}
		 * @public
		 */
		children: React.PropTypes.node.isRequired,

		/**
		 * Assign a custom icon for the decrementer. All strings supported by [Icon]{Icon} are
		 * supported. Without a custom icon, the default is used, and is automatically changed when
		 * the [orientation]{Icon#orientation} is changed.
		 *
		 * @type {String}
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
		 * @type {String}
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
		 * By default, each picker item is wrapped by a
		 * {@link moonstone/Marquee.MarqueeText}. When `marqueeDisabled` is `true`,
		 * the items will not be wrapped.
		 *
		 * @type {Boolean}
		 * @public
		 */
		marqueeDisabled: React.PropTypes.bool,

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
		 * @public
		 */
		orientation: React.PropTypes.oneOf(['horizontal', 'vertical']),

		/**
		 * Index of the selected child
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		value: React.PropTypes.number,

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
		width: React.PropTypes.oneOfType([
			React.PropTypes.oneOf([null, 'small', 'medium', 'large']),
			React.PropTypes.number
		]),

		/**
		 * Should the picker stop incrementing when the picker reaches the last element? Set `wrap`
		 * to `true` to allow the picker to continue from the opposite end of the list of options.
		 *
		 * @type {Boolean}
		 * @public
		 */
		wrap: React.PropTypes.bool
	},

	defaultProps: {
		value: 0
	},

	computed: {
		max: ({children}) => children && children.length ? children.length - 1 : 0,
		reverse: ({orientation}) => (orientation === 'vertical'),
		children: ({children, disabled, joined, marqueeDisabled}) => React.Children.map(children, (child) => {
			return (
				<PickerItem
					disabled={disabled}
					joined={joined}
					marqueeDisabled={marqueeDisabled}
				>
					{child}
				</PickerItem>
			);
		}),
		value: ({value, children}) => {
			const max = children && children.length ? children.length - 1 : 0;
			if (__DEV__) {
				validateRange(value, 0, max, 'Picker', '"value"', 'min', 'max index');
			}
			return clamp(0, max, value);
		}
	},

	render: ({children, max, value, ...rest}) => {
		delete rest.marqueeDisabled;

		return (
			<PickerCore {...rest} min={0} max={max} index={value} step={1} value={value}>
				{children}
			</PickerCore>
		);
	}
});

/**
 * A Picker component that allows selecting values from a list of values.
 *
 * @class Picker
 * @memberof moonstone/Picker
 * @ui
 * @public
 */
const Picker = MarqueeController(
	{startOnFocus: true},
	SpottablePicker(
		PickerBase
	)
);

export default Picker;
export {Picker, PickerBase};
