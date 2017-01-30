/**
 * Exports the {@link moonstone/DatePicker.DatePicker} and {@link moonstone/DatePicker.DatePickerBase}
 * components.
 *
 * @module moonstone/DatePicker
 */
import DateFmt from '@enact/i18n/ilib/lib/DateFmt';

import DateTimeDecorator from '../internal/DateTimeDecorator';

import DatePickerBase from './DatePickerBase';

/**
 * {@link moonstone/DatePicker.DatePicker} allows the selection (or simply display) of
 * a day, month, and year.
 *
 * Set the [value]{@link moonstone/DatePicker.DatePicker#value} property to a standard
 * JavaScript {@glossary Date} object to initialize the picker.
 *
 * @class DatePicker
 * @memberof moonstone/DatePicker
 * @ui
 * @public
 */
const DatePicker = DateTimeDecorator({
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
}, DatePickerBase);

export default DatePicker;
export {DatePicker, DatePickerBase};
