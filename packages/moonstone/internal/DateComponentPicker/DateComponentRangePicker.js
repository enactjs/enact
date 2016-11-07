import Changeable from '@enact/ui/Changeable';
import kind from '@enact/core/kind';
import React from 'react';

import RangePicker from '../../RangePicker';

import DateComponentPickerChrome from './DateComponentPickerChrome';


/**
 * {@link moonstone/internal/DataComponentPicker.DateComponentRangePicker} allows the selection of
 * one part of the date or time using a {@link moonstone/RangePicker.RangePicker}.
 *
 * @class DateComponentRangePicker
 * @memberof moonstone/internal/DateComponentPicker
 * @ui
 * @private
 */
const DateComponentRangePickerBase = kind({
	name: 'DateComponentRangePickerBase',

	propTypes:  /** @lends moonstone/internal/DateComponentPicker.DateComponentRangePicker.prototype */ {
		/**
		 * The maximum value for the date component
		 *
		 * @type {Number}
		 * @required
		 */
		max: React.PropTypes.number.isRequired,

		/**
		 * The minimum value for the date component
		 *
		 * @type {Number}
		 * @required
		 */
		min: React.PropTypes.number.isRequired,

		/**
		 * The value of the date component
		 *
		 * @type {Number}
		 * @required
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

		/*
		 * When `true`, allow the picker to continue from the opposite end of the list of options.
		 *
		 * @type {Boolean}
		 * @public
		 */
		wrap: React.PropTypes.bool
	},

	render: ({className, label, max, min, noAnimation, value, wrap, ...rest}) => (
		<DateComponentPickerChrome className={className} label={label}>
			<RangePicker
				{...rest}
				joined
				max={max}
				min={min}
				noAnimation={noAnimation}
				orientation="vertical"
				value={value}
				width="small"
				wrap={wrap}
			/>
		</DateComponentPickerChrome>
	)
});


/**
* {@link module:@enact/moonstone/DatePicker~DateComponentRangePicker} allows the selection of one
* part of the date (date, month, or year). It is a stateful component but allows updates by
* providing a new `value` via props.
*
* @class DateComponentRangePicker
* @ui
* @private
*/
const DateComponentRangePicker = Changeable(
	{mutable: true},
	DateComponentRangePickerBase
);

export default DateComponentRangePicker;
export {
	DateComponentRangePicker,
	DateComponentRangePickerBase
};
