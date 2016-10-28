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
		 * When `true`, applies a disabled style and the control becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: React.PropTypes.bool,

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

	styles: {
		css,
		className: 'dateComponentPicker'
	},

	render: ({className, disabled, label, max, min, value, wrap, ...rest}) => (
		<div className={className}>
			<RangePicker
				{...rest}
				className={css.field}
				disabled={disabled}
				joined
				max={max}
				min={min}
				orientation="vertical"
				value={value}
				width="small"
				wrap={wrap}
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
