import {$L} from '@enact/i18n';
import kind from '@enact/core/kind';
import React from 'react';

import css from './DatePicker.less';
import DateComponentPicker from './DateComponentPicker';


/**
* {@link module:@enact/moonstone/DatePicker~DatePickerBase} is the stateless functional date picker
* component. Should not be used directly but may be composed within another component as it is
* within {@link module:@enact/moonstone/DatePicker~DatePicker}.
*
* @class DatePickerBase
* @ui
* @private
*/
const DatePickerBase = kind({
	name: 'DatePicker',

	propTyptes: {
		/**
		 * The `date` component of the Date
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		date: React.PropTypes.number.isRequired,

		/**
		 * The number of days in the month
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		maxDays: React.PropTypes.number.isRequired,

		/**
		 * The number of months in the year
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		maxMonths: React.PropTypes.number.isRequired,

		/**
		 * The `month` component of the Date
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		month: React.PropTypes.number.isRequired,

		/**
		 * The order in which the component pickers are displayed. Should be an array of 3 strings
		 * containing one of `'m'`, `'d'`, and `'y'`.
		 *
		 * @type {String[]}
		 * @required
		 * @public
		 */
		order: React.PropTypes.arrayOf(React.PropTypes.oneOf(['m', 'd', 'y'])).isRequired,

		/**
		 * The `year` component of the Date
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		year: React.PropTypes.number.isRequired,

		/**
		 * Handler for changes in the `date` component of the Date
		 *
		 * @type {Function}
		 * @public
		 */
		onChangeDate: React.PropTypes.func,

		/**
		 * Handler for changes in the `month` component of the Date
		 *
		 * @type {Function}
		 * @public
		 */
		onChangeMonth: React.PropTypes.func,

		/**
		 * Handler for changes in the `year` component of the Date
		 *
		 * @type {Function}
		 * @public
		 */
		onChangeYear: React.PropTypes.func,

		/**
		 * The maximum selectable `year` value
		 *
		 * @type {Number}
		 * @default 2099
		 * @public
		 */
		maxYear: React.PropTypes.number,

		/**
		 * The minimum selectable `year` value
		 *
		 * @type {Number}
		 * @default 1900
		 * @public
		 */
		minYear: React.PropTypes.number,

		/**
		 * When `true`, omits the labels below the pickers
		 *
		 * @type {Boolean}
		 * @public
		 */
		noLabels: React.PropTypes.bool
	},

	defaultProps: {
		maxYear: 2099,
		minYear: 1900
	},

	styles: {
		css,
		className: 'datePicker'
	},

	render: ({date, maxDays, maxMonths, maxYear, minYear, month, noLabels, onChangeDate, onChangeMonth, onChangeYear, order, year, ...rest}) => {

		delete rest.dateFormat;
		delete rest.onChange;
		delete rest.value;

		return (
			<div {...rest}>
				{order.map(picker => {
					switch (picker) {
						case 'd':
							return (
								<DateComponentPicker
									key="day-picker"
									label={noLabels || $L('day')}
									min={1}
									max={maxDays}
									value={date}
									onChange={onChangeDate}
								/>
							);
						case 'm':
							return (
								<DateComponentPicker
									key="month-picker"
									label={noLabels || $L('month')}
									min={1}
									max={maxMonths}
									value={month}
									onChange={onChangeMonth}
								/>
							);
						case 'y':
							return (
								<DateComponentPicker
									key="year-picker"
									label={noLabels || $L('year')}
									min={minYear}
									max={maxYear}
									value={year}
									onChange={onChangeYear}
								/>
							);
					}

					return null;
				})}
			</div>
		);
	}
});

export default DatePickerBase;
export {DatePickerBase};
