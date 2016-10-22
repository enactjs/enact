import Changeable from '@enact/ui/Changeable';
import kind from '@enact/core/kind';
import React from 'react';

import RangePicker from '../RangePicker';

import css from './DatePicker.less';

/**
* {@link module:@enact/moonstone/DatePicker~DateComponentPickerBase} allows the selection of one
* part of the date (date, month, or year).
*
* @class DateComponentPickerBase
* @ui
* @private
*/
const DateComponentPickerBase = kind({
	name: 'DateComponentPickerBase',

	propTypes: {
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
		label: React.PropTypes.string
	},

	render: ({label, max, min, value, ...rest}) => (
		<div className={css.wrap}>
			<RangePicker
				{...rest}
				className={css.field}
				joined
				max={max}
				min={min}
				orientation="vertical"
				value={value}
				width="small"
				wrap
			/>
			{label ? <div className={css.label}>{label}</div> : null}
		</div>
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
