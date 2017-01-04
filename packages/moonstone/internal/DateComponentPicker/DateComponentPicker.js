import Changeable from '@enact/ui/Changeable';
import kind from '@enact/core/kind';
import Pressable from '@enact/ui/Pressable';
import React from 'react';
import {Spottable} from '@enact/spotlight';

import PickerCore, {PickerItem} from '../Picker';

import DateComponentPickerChrome from './DateComponentPickerChrome';

const Picker = Pressable(Spottable(PickerCore));

/**
 * {@link moonstone/internal/DataComponentPicker.DateComponentPickerBase} allows the selection of one
 * part of the date or time using a {@link moonstone/Picker.Picker}.
 *
 * @class DateComponentPickerBase
 * @memberof moonstone/internal/DateComponentPicker
 * @ui
 * @private
 */
const DateComponentPickerBase = kind({
	name: 'DateComponentPicker',

	propTypes: /** @lends moonstone/internal/DateComponentPicker.DateComponentPickerBase.prototype */ {
		/**
		 * Display values representing the `value` to select
		 *
		 * @type {String[]}
		 * @required
		 * @public
		 */
		children: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,

		/**
		 * The value of the date component
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		value: React.PropTypes.number.isRequired,

		/**
		 * The label to display below the picker
		 *
		 * @type {String}
		 */
		label: React.PropTypes.string,

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
		 * When `true`, the picker buttons operate in the reverse direction.
		 *
		 * @type {Boolean}
		 * @public
		 */
		reverse: React.PropTypes.bool,

		/*
		 * When `true`, allow the picker to continue from the opposite end of the list of options.
		 *
		 * @type {Boolean}
		 * @public
		 */
		wrap: React.PropTypes.bool
	},

	computed: {
		children: ({children}) => React.Children.map(children, (child) => (
			<PickerItem marqueeDisabled>{child}</PickerItem>
		)),
		max: ({children}) => React.Children.count(children) - 1
	},

	render: ({children, className, label, max, noAnimation, reverse, value, wrap, ...rest}) => (
		<DateComponentPickerChrome className={className} label={label}>
			<Picker
				{...rest}
				index={value}
				joined
				marqueeDisabled
				max={max}
				min={0}
				noAnimation={noAnimation}
				orientation="vertical"
				reverse={reverse}
				step={1}
				value={value}
				width="small"
				wrap={wrap}
			>
				{children}
			</Picker>
		</DateComponentPickerChrome>
	)
});


/**
 * {@link moonstone/internal/DateComponentPickerBase.DateComponentPicker} allows the selection of one part of
 * the date (date, month, or year). It is a stateful component but allows updates by providing a new
 * `value` via props.
 *
 * @class DateComponentPicker
 * @memberof moonstone/internal/DateComponentPicker
 * @ui
 * @private
 */
const DateComponentPicker = Changeable(
	{mutable: true},
	DateComponentPickerBase
);

export default DateComponentPicker;
export {
	DateComponentPicker,
	DateComponentPickerBase
};
