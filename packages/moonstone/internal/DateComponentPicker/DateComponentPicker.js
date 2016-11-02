import Changeable from '@enact/ui/Changeable';
import kind from '@enact/core/kind';
import React from 'react';

import Picker from '../../Picker';

import DateComponentPickerChrome from './DateComponentPickerChrome';

/**
* {@link module:@enact/moonstone/DatePicker~DateComponentPickerBase} allows the selection of one
* part of a date or time (date, month, year, hour, minute, meridiem).
*
* @class DateComponentPickerBase
* @ui
* @private
*/
const DateComponentPickerBase = kind({
	name: 'DateComponentPickerBase',

	propTypes: {
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

		/*
		 * When `true`, allow the picker to continue from the opposite end of the list of options.
		 *
		 * @type {Boolean}
		 * @public
		 */
		wrap: React.PropTypes.bool
	},

	render: ({children, className, label, value, wrap, ...rest}) => (
		<DateComponentPickerChrome className={className} label={label}>
			<Picker
				{...rest}
				joined
				orientation="vertical"
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
* {@link module:@enact/moonstone/DatePicker~DateComponentPicker} allows the selection of one part of
* the date (date, month, or year). It is a stateful component but allows updates by providing a new
* `value` via props.
*
* @class DateComponentPicker
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
