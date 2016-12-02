
import DateFactory from 'ilib/DateFactory';
import DateFmt from 'ilib/DateFmt';
import ilib from 'ilib/ilib';
import React from 'react';

import DatePickerBase from './DatePickerBase';

/**
 * {@link moonstone/DatePicker.DatePickerController} provides most of the behavior for a
 * {@link moonstone/DatePicker.DatePicker} including internationalization and managing changes from
 * the individual pickers.
 *
 * @class DatePickerController
 * @memberof moonstone/DatePicker
 * @ui
 * @private
 */
const DatePickerController = class extends React.Component {
	static displayName = 'DatePicker'

	static propTypes = /** @lends moonstone/DatePicker.DatePickerController.prototype */ {
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
		 * When `true`, the date picker is expanded to select a new date.
		 *
		 * @type {Boolean}
		 * @public
		 */
		open: React.PropTypes.bool,

		/**
		 * The selected date
		 *
		 * @type {Date}
		 * @public
		 */
		value: React.PropTypes.instanceOf(Date)
	}

	static defaultProps = {
		maxYear: 2099,
		minYear: 1900
	}

	constructor (props) {
		super(props);

		this.order = ['d', 'm', 'y'];

		this.initI18n();

		this.state = {
			value: this.toTime(props.value)
		};
	}

	componentWillUpdate () {
		// check for a new locale when updating
		this.initI18n();
	}

	initI18n () {
		const locale = ilib.getLocale();

		if (this.locale !== locale && typeof window === 'object') {
			this.locale = locale;

			this.dateFormat = new DateFmt({
				date: 'dmwy',
				length: 'full',
				timezone: 'local',
				useNative: false
			});

			this.order = this.dateFormat.getTemplate().match(/([mdy]+)/ig).map(s => s[0].toLowerCase());
		}
	}

	componentWillReceiveProps (nextProps) {
		this.setState({
			value: 'value' in nextProps ? this.toTime(nextProps.value) : this.state.value
		});
	}

	/**
	 * Converts a Date to an IDate
	 *
	 * @param	{Date}	time	Date object
	 *
	 * @returns	{IDate}			ilib Date object
	 */
	toIDate (time) {
		if (time && this.locale) {
			return DateFactory({
				unixtime: time,
				timezone: 'local'
			});
		}
	}

	/**
	 * Converts a JavaScript Date to unix time
	 *
	 * @param	{Date}	date	A Date to convert
	 *
	 * @returns	{undefined}
	 */
	toTime (date) {
		return date && date.getTime();
	}

	/**
	 * Updates the internal value in state
	 *
	 * @param	{IDate}		value	ilib Date object
	 *
	 * @returns {Number}			Updated internal value
	 */
	updateValue = (value) => {
		const newValue = DateFactory(value).getTimeExtended();

		this.setState({
			value: newValue
		});

		return newValue;
	}

	/**
	 * Determines the current value using either the value from state or the current time (if the
	 * picker is open)
	 *
	 * @returns {IDate} ilib Date object
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
			maxMonths: 12,
			maxDays: 31,
			year: 1900,
			month: 1,
			day: 1
		};

		if (value && this.locale) {
			values.year = value.getYears();
			values.month = value.getMonths();
			values.day = value.getDays();
			values.maxMonths = this.dateFormat.cal.getNumMonths(values.year);
			values.maxDays = this.dateFormat.cal.getMonLength(values.month, values.year);
		}

		return values;
	}

	/**
	 * Updates the internal `value` when the date changes
	 *
	 * @param  {Object} ev onChange event from RangePicker
	 *
	 * @returns {undefined}
	 */
	handleChangeDate = (ev) => {
		const value = this.calcValue();
		value.day = ev.value;

		this.updateValue(value);
	}

	/**
	 * Updates the internal `value` when the month changes
	 *
	 * @param  {Object} ev onChange event from RangePicker
	 *
	 * @returns {undefined}
	 */
	handleChangeMonth = (ev) => {
		const value = this.calcValue();
		value.month = ev.value;

		this.updateValue(value);
	}

	/**
	 * Updates the internal `value` when the year changes
	 *
	 * @param  {Object} ev onChange event from RangePicker
	 *
	 * @returns {undefined}
	 */
	handleChangeYear = (ev) => {
		const value = this.calcValue();
		value.year = ev.value;

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

	render () {
		const value = this.calcValue();
		const label = value && this.dateFormat ? this.dateFormat.format(value) : null;
		const dateComponents = this.calcDateComponents(value);

		return (
			<DatePickerBase
				{...this.props}
				{...dateComponents}
				label={label}
				onChangeDate={this.handleChangeDate}
				onChangeMonth={this.handleChangeMonth}
				onChangeYear={this.handleChangeYear}
				onClose={this.handleClose}
				order={this.order}
				value={value}
			/>
		);
	}
};

export default DatePickerController;
export {DatePickerController};
