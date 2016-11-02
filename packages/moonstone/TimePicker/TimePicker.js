import DateFactory from 'ilib/DateFactory';
import DateFmt from 'ilib/DateFmt';
import LocaleInfo from 'ilib/LocaleInfo';
import React from 'react';

import TimePickerBase from './TimePickerBase';

import {Expandable} from '../ExpandableItem';

const includeMeridiem = /([khma])(?!\1)/g;
const excludeMeridiem = /([khm])(?!\1)/g;

const TimePickerController = class extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			value: this.toIDate(props.value, 'local')
		};
		this.initI18n();
	}

	initI18n () {
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
		this.meridiems = merFormatter.getMeridiemsRange(meridiemFormat);
		this.meridiemLabels = this.meridiems.map(obj => obj.name);

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

	/**
	 * Converts a Date to an IDate
	 *
	 * @param	{Date}		date		Date object
	 * @param	{String}	timezone	Timezone string (e.g. `'Etc/UTC'`)
	 *
	 * @returns	{IDate}					ilib Date object
	 */
	toIDate (date, timezone) {
		if (date) {
			return DateFactory({
				unixtime: date.getTime(),
				timezone
			});
		}
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
			value: value
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
		value.setHours(ev.value);

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
		value.setMinutes(ev.value);

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
		// const value = this.calcValue();
		// value.setHours(ev.value);

		// this.updateValue(value);
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
		return currentValue || this.props.open && this.toIDate(new Date(), 'local');
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
				// TODO: > 2 merdiem support
				values.meridiem = Math.floor(values.hour / 12);
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
				onChangeHour={this.handleChangeHour}
				onChangeMeridiem={this.handleChangeMeridiem}
				onChangeMinute={this.handleChangeMinute}
				order={this.order}
			/>
		);
	}
};

const TimePicker = Expandable(TimePickerController);

export default TimePicker;
export {TimePicker, TimePickerBase};
