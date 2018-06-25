/**
 * Date selection components and behaviors.
 *
 * @example
 * <DatePicker
 *   onChange={console.log}
 * 	 title="Select Date"
 * />
 *
 * @module moonstone/DatePicker
 * @exports DatePicker
 * @exports DatePickerBase
 */


import DateFmt from '@enact/i18n/ilib/lib/DateFmt';
import Pure from '@enact/ui/internal/Pure';

import DateTimeDecorator from '../internal/DateTimeDecorator';
import Skinnable from '../Skinnable';

import DatePickerBase from './DatePickerBase';

const dateTimeConfig = {
	customProps: function (i18n, value) {
		const values = {
			maxMonths: 12,
			maxDays: 31,
			year: 1900,
			month: 1,
			day: 1
		};

		if (value && i18n) {
			values.year = value.getYears();
			values.month = value.getMonths();
			values.day = value.getDays();
			values.maxMonths = i18n.formatter.cal.getNumMonths(values.year);
			values.maxDays = i18n.formatter.cal.getMonLength(values.month, values.year);
		}

		return values;
	},
	defaultOrder: ['d', 'm', 'y'],
	handlers: {
		onChangeDate: (ev, value) => {
			value.day = ev.value;
			return value;
		},

		onChangeMonth: (ev, value) => {
			value.month = ev.value;
			return value;
		},

		onChangeYear: (ev, value) => {
			value.year = ev.value;
			return value;
		}
	},
	i18n: function () {
		const formatter = new DateFmt({
			date: 'dmwy',
			length: 'full',
			timezone: 'local',
			useNative: false
		});

		const order = formatter.getTemplate()
			.replace(/'.*?'/g, '')
			.match(/([mdy]+)/ig)
			.map(s => s[0].toLowerCase());

		return {formatter, order};
	}
};

/**
 * A date selection (or simply display) component.
 *
 * Usage:
 * ```
 * <DatePicker
 *	defaultValue={selectedDate}
 *	onChange={handleChange}
 * 	title="Select Date"
 * />
 * ```
 *
 * By default, `DatePicker` maintains the state of its `value` property. Supply the
 * `defaultValue` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `value` at creation time and update it in response to
 * `onChange` events.
 *
 * `DatePicker` is an expandable component and it maintains its open/closed state by default. The
 * initial state can be supplied using `defaultOpen`. In order to directly control the open/closed
 * state, supply a value for `open` at creation time and update its value in response to
 * `onClose`/`onOpen` events.
 *
 * @class DatePicker
 * @memberof moonstone/DatePicker
 * @extends moonstone/DatePicker.DatePickerBase
 * @mixes ui/Toggleable.Toggleable
 * @mixes ui/RadioDecorator.RadioDecorator
 * @mixes ui/Changeable.Changeable
 * @ui
 * @public
 */
const DatePicker = Pure(
	Skinnable(
		DateTimeDecorator(
			dateTimeConfig,
			DatePickerBase
		)
	)
);

export default DatePicker;
export {
	DatePicker,
	DatePickerBase
};
