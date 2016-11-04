import DateFactory from 'ilib/DateFactory';
import DateFmt from 'ilib/DateFmt';
import ilib from 'ilib/ilib';
import LocaleInfo from 'ilib/LocaleInfo';
import React from 'react';

import TimePickerBase from './TimePickerBase';

import {Expandable} from '../ExpandableItem';

const includeMeridiem = /([khma])(?!\1)/g;
const excludeMeridiem = /([khm])(?!\1)/g;

const toMinutes = (time) => {
	const colon = time.indexOf(':');
	const hour = parseInt(time.substring(0, colon), 10);
	const minute = parseInt(time.substring(colon + 1), 10);
	return hour * 60 + minute;
};

const calcMeridiemRange = ({start, end}) => ({
	start: toMinutes(start),
	end: toMinutes(end)
});

const findMeridiemForTime = (time, meridiems) => {
	const minutes = time.getHours() * 60 + time.getMinutes();
	for (let i = 0; i < meridiems.length; i++) {
		const m = meridiems[i];
		if (minutes >= m.start && minutes <= m.end) {
			return i;
		}
	}
};

const TimePickerController = class extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			value: this.toTime(props.value)
		};
		this.initI18n();
	}

	componentWillReceiveProps (nextProps) {
		this.setState({
			value: 'value' in nextProps ? this.toTime(nextProps.value) : this.state.value
		});
	}

	componentWillUpdate () {
		// check for a new locale when updating
		this.initI18n();
	}

	initI18n () {
		const locale = ilib.getLocale();

		if (this.locale !== locale) {
			this.locale = locale;

			const format = {
				type: 'time',
				useNative: false,
				timezone: 'local',
				length: 'full',
				date: 'dmwy'
			};

			this.timeFormat = new DateFmt(format);

			const meridiemFormat = {
				template: 'a',
				useNative: false,
				timezone: 'local'
			};

			const merFormatter = new DateFmt(meridiemFormat);
			const meridiems = merFormatter.getMeridiemsRange(meridiemFormat);
			this.meridiemRanges = meridiems.map(calcMeridiemRange);
			this.meridiemLabels = meridiems.map(obj => obj.name);

			// Set picker format 12 vs 24 hour clock
			const li = new LocaleInfo();
			const clockPref = li.getClock();
			this.meridiemEnabled = clockPref === '12';

			const filter = this.meridiemEnabled ? includeMeridiem : excludeMeridiem;
			this.order = this.timeFormat.getTemplate().match(filter).map(s => s[0].toLowerCase());

			const timeFormat = {
				type: 'time',
				time: 'h',
				useNative: false,
				timezone: 'local'
			};

			if (clockPref !== 'locale') {
				timeFormat.clock = clockPref;
			}

			this.hourFormatter = new DateFmt(timeFormat);

			timeFormat.time = 'm';
			this.minuteFormatter = new DateFmt(timeFormat);
		}
	}

	/**
	 * Converts unix time to an IDate
	 *
	 * @param	{Number}	time	UNIX time
	 *
	 * @returns	{IDate}				ilib Date object
	 */
	toIDate (time) {
		if (time) {
			return DateFactory({
				timezone: 'local',
				unixtime: time
			});
		}
	}

	toTime (date) {
		if (date) {
			const time = date.getTime();
			return this.toIDate(time).getTime();
		}
	}

	shouldAnimateHour (value) {
		if (this.meridiemEnabled && this.meridiemRanges.length === 2) {
			const currentValue = this.calcValue();
			return !value || value.hour % 12 !== currentValue.hour % 12;
		}

		return true;
	}

	/**
	 * Updates the internal value in state
	 *
	 * @param	{IDate}		value ilib Date object
	 *
	 * @returns {undefined}
	 */
	updateValue = (value) => {
		this.setState({
			noHourAnimation: !this.shouldAnimateHour(value),
			value: DateFactory(value).getTime()
		});
	}

	/**
	 * Updates the internal `value` when the hour changes
	 *
	 * @param  {Object} ev onChange event from RangePicker
	 *
	 * @returns {undefined}
	 */
	handleChangeHour = (ev) => {
		const value = this.calcValue();
		value.hour = ev.value;

		this.updateValue(value);
	}

	/**
	 * Updates the internal `value` when the minute changes
	 *
	 * @param  {Object} ev onChange event from RangePicker
	 *
	 * @returns {undefined}
	 */
	handleChangeMinute = (ev) => {
		const value = this.calcValue();
		value.minute = ev.value;

		this.updateValue(value);
	}

	/**
	 * Updates the internal `value` when the meridiem changes
	 *
	 * @param  {Object} ev onChange event from RangePicker
	 *
	 * @returns {undefined}
	 */
	handleChangeMeridiem = (ev) => {
		const value = this.calcValue();
		const meridiem = this.meridiemRanges[ev.value];

		if (this.meridiemRanges.length === 2) {
			// In the common case of 2 meridiems, we'll offset hours by 12 so that picker stays the
			// same.
			value.hour = (value.getHours() + 12) % 24;
		} else {
			// In the rarer case of > 2 meridiems (e.g. am-ET), try to set hours only first
			const hours = Math.floor(meridiem.start / 60);
			value.hour = hours;

			// but check if it is still out of bounds and update the minutes as well
			const minutes = hours * 60 + value.getMinutes();
			if (minutes > meridiem.end) {
				value.minute = meridiem.end % 60;
			} else if (minutes < meridiem.start) {
				value.minute = meridiem.start % 60;
			}
		}

		this.updateValue(value);
	}

	/**
	 * Handles the `onClose` event from the ExpandableDatePicker by emitting an `onChange` event
	 * with the updated value if not preceded by an `onCancel` event.
	 *
	 * @param	{Object}	ev	Event payload
	 * @returns	{undefined}
	 */
	handleClose = (ev) => {
		if (this.props.onChange) {
			// If we have an onChange handler to call, determine if the value actually changed and,
			// if so, call the handler.
			const changed =	this.props.value == null || this.props.value !== this.state.value;
			if (changed) {
				const currentValue = this.calcValue();
				this.props.onChange({
					value: currentValue.getJSDate()
				});
			}
		}

		if (this.props.onClose) {
			this.props.onClose(ev);
		}
	}

	/**
	 * Determines the current value using either the value from state or the current time (if the
	 * picker is open). Always returns a new copy of the data object (if a date is returned).
	 *
	 * @param	{String}	timezone 	Timezone string
	 *
	 * @returns	{IDate}		ilib		Date object
	 */
	calcValue = () => {
		const currentValue = this.state.value;

		// Always use the current value if valid but if not and open, generate a value
		if (currentValue) {
			return DateFactory({
				unixtime: currentValue
			});
		} else if (this.props.open) {
			return DateFactory({
				unixtime: Date.now(),
				timezone: 'local'
			});
		}
	}

	/**
	 * Breaks down `value` into individual components (date, month, year) and calculates the max
	 * months and days for the calendar.
	 *
	 * @param	{IDate}		value	ilib Date object
	 *
	 * @returns	{Object}			Date components object
	 */
	calcDateComponents = (value) => {
		let values = {
			hour: 12,
			minute: 0,
			meridiem: 0
		};

		if (value) {
			values.hour = value.getHours();
			values.minute = value.getMinutes();
			if (this.meridiemEnabled) {
				values.meridiem = findMeridiemForTime(value, this.meridiemRanges);
			}
		}

		return values;
	}

	render () {
		const value = this.calcValue();
		const label = value ? this.timeFormat.format(value) : null;
		const dateComponents = this.calcDateComponents(value);

		return (
			<TimePickerBase
				{...this.props}
				{...dateComponents}
				label={label}
				meridiems={this.meridiemLabels}
				noHourAnimation={this.state.noHourAnimation}
				onChangeHour={this.handleChangeHour}
				onChangeMeridiem={this.handleChangeMeridiem}
				onChangeMinute={this.handleChangeMinute}
				onClose={this.handleClose}
				order={this.order}
			/>
		);
	}
};

const TimePicker = Expandable(TimePickerController);

export default TimePicker;
export {TimePicker, TimePickerBase};
