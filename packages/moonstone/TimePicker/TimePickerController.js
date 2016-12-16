import DateFactory from 'ilib/DateFactory';
import DateFmt from 'ilib/DateFmt';
import ilib from 'ilib/ilib';
import LocaleInfo from 'ilib/LocaleInfo';
import React from 'react';

import TimePickerBase from './TimePickerBase';

// Filters used to extract the order of pickers from the ilib template
const includeMeridiem = /([khma])(?!\1)/ig;
const excludeMeridiem = /([khm])(?!\1)/ig;

/**
 * Converts a string representation of time into minutes
 *
 * @param	{String}	time	Time in the format `HH:mm`
 *
 * @returns	{Number}			Time in minute
 * @private
 */
const toMinutes = (time) => {
	const colon = time.indexOf(':');
	const hour = parseInt(time.substring(0, colon));
	const minute = parseInt(time.substring(colon + 1));
	return hour * 60 + minute;
};

/**
 * Converts the `start` and `end` string representations (e.g. '12:00') into a numerical
 * representation.
 *
 * @param	{String}	options.start	Start time of meridiem
 * @param	{String}	options.end		End time of meridiem
 *
 * @returns	{Object}					Contains start and end time in minutes
 * @private
 */
const calcMeridiemRange = ({start, end}) => ({
	start: toMinutes(start),
	end: toMinutes(end)
});

/**
 * Finds the index of the meridiem which contains `time`
 *
 * @param	{Number}	time		Time in minutes
 * @param	{Object[]}	meridiems	Array of meridiems with `start` and `end` members in minutes
 *
 * @returns {Number}				Index of `time` in `meridiems`
 * @private
 */
const indexOfMeridiem = (time, meridiems) => {
	const minutes = time.getHours() * 60 + time.getMinutes();
	for (let i = 0; i < meridiems.length; i++) {
		const m = meridiems[i];
		if (minutes >= m.start && minutes <= m.end) {
			return i;
		}
	}

	return -1;
};

/**
 * {@link moonstone/TimePicker.TimePickerController} provides most of the behavior for a
 * {@link moonstone/TimePicker.TimePicker} including internationalization and managing changes from
 * the individual pickers.
 *
 * @class TimePickerController
 * @memberof moonstone/TimePicker
 * @ui
 * @public
 */
const TimePickerController = class extends React.Component {

	static displayName = 'TimePicker'

	static propTypes = /** @lends moonstone/TimePicker.TimePickerController.prototype */ {
		/**
		 * The primary text of the item.
		 *
		 * @type {String}
		 * @required
		 * @public
		 */
		title: React.PropTypes.string.isRequired,

		/**
		 * When `true`, applies a disabled style and the control becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: React.PropTypes.bool,

		/**
		 * When `true`, omits the labels below the pickers
		 *
		 * @type {Boolean}
		 * @public
		 */
		noLabels: React.PropTypes.bool,

		/**
		 * Text to display when no `label` or `value` is set. Leave blank to have the initial
		 * control not display a label when no option is selected.
		 *
		 * @type {String}
		 * @public
		 */
		noneText: React.PropTypes.string,

		/**
		 * Handler for `onChange` events
		 *
		 * @type {Function}
		 * @public
		 */
		onChange: React.PropTypes.func,

		/**
		 * Callback to be called when a condition occurs which should cause the expandable to close
		 *
		 * @type {Function}
		 * @default null
		 * @public
		 */
		onClose: React.PropTypes.func,

		/**
		 * Callback to be called when a condition occurs which should cause the expandable to open
		 *
		 * @type {Function}
		 * @default null
		 * @public
		 */
		onOpen: React.PropTypes.func,

		/**
		 * When `true`, the time picker is expanded to select a new time.
		 *
		 * @type {Boolean}
		 * @public
		 */
		open: React.PropTypes.bool,

		/**
		 * The selected time
		 *
		 * @type {Date}
		 * @public
		 */
		value: React.PropTypes.instanceOf(Date)
	}


	constructor (props) {
		super(props);

		this.order = ['h', 'm', 'a'];
		this.meridiemRanges = [];
		this.meridiemLabels = ['am', 'pm'];

		this.initI18n();

		this.state = {
			value: this.toTime(props.value)
		};
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

		if (this.locale !== locale && typeof window === 'object') {
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
			this.order = this.timeFormat.getTemplate()
				.replace(/'.*?'/g, '')
				.match(filter)
				.map(s => s[0].toLowerCase());

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
	 * @private
	 */
	toIDate (time) {
		if (time && this.locale) {
			return DateFactory({
				timezone: 'local',
				unixtime: time
			});
		}
	}

	/**
	 * Converts a JavaScript Date to unix time
	 *
	 * @param	{Date}	date	A Date to convert
	 *
	 * @returns	{undefined}
	 * @private
	 */
	toTime (date) {
		return date && date.getTime();
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
	 * @param	{IDate}		value	ilib Date object
	 *
	 * @returns {Number}			Updated internal value
	 * @private
	 */
	updateValue = (value) => {
		const newValue = DateFactory(value).getTimeExtended();
		this.setState({
			noHourAnimation: !this.shouldAnimateHour(value),
			value: newValue
		});

		return newValue;
	}

	/**
	 * Updates the internal `value` when the hour changes
	 *
	 * @param  {Object} ev onChange event from RangePicker
	 *
	 * @returns {undefined}
	 * @private
	 */
	handleChangeHour = (ev) => {
		const value = this.calcValue();
		const currentHour = value.hour;
		value.hour = ev.value;

		const newValue = this.updateValue(value);

		// In the case of navigating onto the skipped hour of DST, ilib will return the same value
		// so we skip that hour and update the value again.
		if (newValue === this.state.value) {
			value.hour = ev.value * 2 - currentHour;
			this.updateValue(value);
		}
	}

	/**
	 * Updates the internal `value` when the minute changes
	 *
	 * @param  {Object} ev onChange event from RangePicker
	 *
	 * @returns {undefined}
	 * @private
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
	 * @private
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
	 * @private
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
	 * @private
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
	 * @private
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
				values.meridiem = indexOfMeridiem(value, this.meridiemRanges);
			}
		}

		return values;
	}

	render () {
		const value = this.calcValue();
		const label = value && this.timeFormat ? this.timeFormat.format(value) : null;
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

export default TimePickerController;
export {TimePickerController};
