/**
 * Exports the {@link moonstone/Picker.Picker} and {@link moonstone/Picker.PickerBase}
 * components. The default export is {@link moonstone/Picker.Picker}.
 *
 * @module moonstone/Picker
 */

import Changeable from '@enact/ui/Changeable';
import clamp from 'ramda/src/clamp';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Pure from '@enact/ui/internal/Pure';

import {MarqueeController} from '../Marquee';
import {validateRange} from '../internal/validators';

import PickerCore, {PickerItem} from '../internal/Picker';

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
		 * @required
		 * @public
		 */
		children: PropTypes.node.isRequired,

		/**
		 * Overrides the `aria-valuetext` for the picker. By default, `aria-valuetext` is set
		 * to the current selected child text.
		 *
		 * @type {String}
		 * @memberof moonstone/Picker.PickerBase.prototype
		 * @public
		 */
		'aria-valuetext': PropTypes.string,

		/**
		 * Assign a custom icon for the decrementer. All strings supported by [Icon]{@link moonstone/Icon} are
		 * supported. Without a custom icon, the default is used, and is automatically changed when
		 * the [orientation]{@link moonstone/Icon#orientation} is changed.
		 *
		 * @type {String}
		 * @public
		 */
		decrementIcon: PropTypes.string,

		/**
		 * When `true`, the Picker is shown as disabled and does not generate `onChange`
		 * [events]{@glossary event}.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Assign a custom icon for the incrementer. All strings supported by [Icon]{@link moonstone/Icon} are
		 * supported. Without a custom icon, the default is used, and is automatically changed when
		 * the [orientation]{@link moonstone/Icon#orientation} is changed.
		 *
		 * @type {String}
		 * @public
		 */
		incrementIcon: PropTypes.string,

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
		joined: PropTypes.bool,

		/**
		 * By default, each picker item is wrapped by a
		 * {@link moonstone/Marquee.MarqueeText}. When `marqueeDisabled` is `true`,
		 * the items will not be wrapped.
		 *
		 * @type {Boolean}
		 * @public
		 */
		marqueeDisabled: PropTypes.bool,

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
		 * A function to run when the control should increment or decrement.
		 *
		 * @type {Function}
		 * @public
		 */
		onChange: PropTypes.func,

		/**
		 * Sets the orientation of the picker, whether the buttons are above and below or on the
		 * sides of the value. Must be either `'horizontal'` or `'vertical'`.
		 *
		 * @type {String}
		 * @public
		 */
		orientation: PropTypes.oneOf(['horizontal', 'vertical']),

		/**
		 * Index of the selected child
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		value: PropTypes.number,

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
		 * to `true` to allow the picker to continue from the opposite end of the list of options.
		 *
		 * @type {Boolean}
		 * @public
		 */
		wrap: PropTypes.bool
	},

	defaultProps: {
		value: 0
	},

	computed: {
		max: ({children}) => children && children.length ? children.length - 1 : 0,
		reverse: ({orientation}) => (orientation === 'vertical'),
		children: ({children, disabled, joined, marqueeDisabled}) => React.Children.map(children, (child) => {
			const focusOrHover = !disabled && joined ? 'focus' : 'hover';
			return (
				<PickerItem
					marqueeDisabled={marqueeDisabled}
					marqueeOn={focusOrHover}
				>
					{child}
				</PickerItem>
			);
		}),
		disabled: ({children, disabled}) => React.Children.count(children) > 1 ? disabled : true,
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
 * By default, `Picker` maintains the state of its `value` property. Supply the `defaultValue`
 * property to control its initial value. If you wish to directly control updates to the component,
 * supply a value to `value` at creation time and update it in response to `onChange` events.
 *
 * @class Picker
 * @memberof moonstone/Picker
 * @mixes ui/Changeable.Changeable
 * @mixes moonstone/Marquee.MarqueeController
 * @ui
 * @public
 */
const Picker = Pure(
	Changeable(
		MarqueeController(
			{marqueeOnFocus: true},
			PickerBase
		)
	)
);

export default Picker;
export {Picker, PickerBase};
