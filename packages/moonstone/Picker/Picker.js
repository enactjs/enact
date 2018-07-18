/**
 * A component for selecting values from a list of values.
 *
 * @example
 * <Picker>
 * 	<p>A</p>
 * 	<p>B</p>
 * 	<p>C</p>
 * </Picker>
 *
 * @module moonstone/Picker
 * @exports Picker
 * @exports PickerBase
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
 * The base component for [`Picker`]{@link moonstone/Picker.Picker}. This version is not
 * [`spottable`]{@link spotlight/Spottable.Spottable}.
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
		 * Picker value list
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
		 * The voice control labels for the `children`.
		 *
		 * By default, `data-webos-voice-labels-ext` is generated from `children`. However, if
		 * `children` is not an array of numbers or strings, `data-webos-voice-labels-ext` should be
		 * set to a JSON-encoded array of labels.
		 *
		 * @type {Number[]|String[]}
		 * @memberof moonstone/Picker.PickerBase.prototype
		 * @public
		 */
		'data-webos-voice-labels-ext': PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.arrayOf(PropTypes.string)]),

		/**
		 * A custom icon for the decrementer.
		 *
		 * All strings supported by [Icon]{@link moonstone/Icon.Icon} are supported. Without a
		 * custom icon, the default is used, and is automatically changed when the
		 * [orientation]{@link moonstone/Icon.Icon#orientation} is changed.
		 *
		 * @type {String}
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
		 * [orientation]{@link moonstone/Icon.Icon#orientation} is changed.
		 *
		 * @type {String}
		 * @public
		 */
		incrementIcon: PropTypes.string,

		/**
		 * Indicates that the users can use the arrow keys to adjust the picker's value.
		 *
		 * The user may no longer use those arrow keys to navigate, while this control is focused.
		 * A default control allows full navigation, but requires individual ENTER presses on the
		 * incrementer and decrementer buttons. Pointer interaction is the same for both formats.
		 *
		 * @type {Boolean}
		 * @public
		 */
		joined: PropTypes.bool,

		/**
		 * Disables marqueeing of items.
		 *
		 * By default, each picker item is wrapped by a
		 * [`MarqueeText`]{@link moonstone/Marquee.MarqueeText}. When this is set, the items will
		 * not be wrapped.
		 *
		 * @type {Boolean}
		 * @public
		 */
		marqueeDisabled: PropTypes.bool,

		/**
		 * Disables transition animation.
		 *
		 * @type {Boolean}
		 * @public
		 */
		noAnimation: PropTypes.bool,

		/**
		 * Called when the `value` changes.
		 *
		 * @type {Function}
		 * @public
		 */
		onChange: PropTypes.func,

		/**
		 * Orientation of the picker.
		 *
		 * Controls whether the buttons are aligned horizontally or vertically with its selected
		 * value.
		 *
		 * * Values: `'horizontal'`, `'vertical'`
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
		 * A number can be used to set the minimum number of characters to be shown.
		 *
		 * This number will determine the minimum size of the Picker.  Setting a number to less than
		 * the number of characters in your longest value will cause the width to grow for the
		 * longer values.
		 *
		 * Choose a specific size for your picker:
		 * * `'small'` - numeric values
		 * * `'medium'` - single or short words
		 * * `'large'` - maximum-sized pickers taking full width of its parent
		 * * `null` - auto-sizing
		 *
		 * @type {String|Number}
		 * @public
		 */
		width: PropTypes.oneOfType([
			PropTypes.oneOf([null, 'small', 'medium', 'large']),
			PropTypes.number
		]),

		/**
		 * Allows picker to continue from the start of the list after it reaches the end.
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
		},
		voiceLabel: ({children, 'data-webos-voice-labels-ext': voiceLabelsExt}) => {
			let voiceLabel;
			if (voiceLabelsExt) {
				voiceLabel = voiceLabelsExt;
			} else {
				voiceLabel = React.Children.map(children, (child) => (
					(typeof child === 'number' || typeof child === 'string') ? child : '')
				);
			}
			return JSON.stringify(voiceLabel);
		}
	},

	render: ({children, max, value, voiceLabel, ...rest}) => {
		delete rest.marqueeDisabled;

		return (
			<PickerCore {...rest} data-webos-voice-labels-ext={voiceLabel} min={0} max={max} index={value} step={1} value={value}>
				{children}
			</PickerCore>
		);
	}
});

/**
 * A Picker component that allows selecting values from a list of values. By default,
 * `RangePicker` maintains the state of its `value` property. Supply the `defaultValue`
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

/**
 * Default Index of the selected child
 *
 * @name defaultValue
 * @memberof moonstone/Picker.Picker.prototype
 * @type {Number}
 * @default 0
 * @public
 */

export default Picker;
export {Picker, PickerBase};
