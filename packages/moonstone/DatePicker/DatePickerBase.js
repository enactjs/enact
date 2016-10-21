import {$L} from '@enact/i18n';
import kind from '@enact/core/kind';
import React from 'react';

import css from './DatePicker.less';
import DateComponentPicker from './DateComponentPicker';

const DatePickerBase = kind({
	name: 'DatePicker',

	propTyptes: {
		date: React.PropTypes.number,
		maxDays: React.PropTypes.number,
		maxMonths: React.PropTypes.number,
		month: React.PropTypes.number,
		onChangeDate: React.PropTypes.func,
		onChangeMonth: React.PropTypes.func,
		onChangeYear: React.PropTypes.func,
		order: React.PropTypes.arrayOf(React.PropTypes.oneOf(['m', 'd', 'y'])),
		year: React.PropTypes.number
	},

	styles: {
		css,
		className: 'datePicker'
	},

	render: ({date, maxDays, maxMonths, month, onChangeDate, onChangeMonth, onChangeYear, order, year, ...rest}) => {

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
									label={$L('Day')}
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
									label={$L('Month')}
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
									label={$L('Year')}
									min={1900}
									max={2100}
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
