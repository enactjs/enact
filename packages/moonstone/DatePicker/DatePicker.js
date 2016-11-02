import DateFactory from 'ilib/DateFactory';
import DateFmt from 'ilib/DateFmt';
import React from 'react';

import {Expandable} from '../ExpandableItem';

import DatePickerBase from './DatePickerBase';

/**
* {@link module:@enact/moonstone/DatePicker~DatePicker} allows the selection (or simply display) of
* a day, month, and year.
*
* Set the [value]{@link module:@enact/moonstone/DatePicker~DatePicker#value} property to a standard
* JavaScript {@glossary Date} object to initialize the picker.
*
* @class DatePicker
* @ui
* @public
*/
const DatePicker = class extends React.Component {
	static displayName = 'DatePicker'

	static propTypes = {
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
		this.state = {
			value: this.toIDate(props.value)
		};

		this.initI18n();
	}

	initI18n () {
		this.dateFormat = new DateFmt({
			date: 'dmwy',
			length: 'full',
			timezone: 'local',
			useNative: false
		});

		this.order = this.dateFormat.getTemplate().match(/([mdy]+)/ig).map(s => s[0].toLowerCase());
	}

	componentWillReceiveProps (nextProps) {
		this.setState({
			value: 'value' in nextProps ? this.toIDate(nextProps.value) : this.state.value
		});
	}

	/**
	 * Converts a Date to an IDate
	 *
	 * @param	{Date}	date	Date object
	 *
	 * @returns	{IDate}			ilib Date object
	 */
	toIDate (date) {
		if (date) {
			return DateFactory({
				unixtime: date.getTime(),
				timezone: 'local'
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
	 * Determines the current value using either the value from state or the current time (if the
	 * picker is open)
	 *
	 * @returns {IDate} ilib Date object
	 */
	calcValue = () => {
		let value = this.state.value;
		if (this.props.open && !value) {
			value = this.toIDate(new Date());
		}

		return value;
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

		if (value) {
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
		const v = this.calcValue();
		const value = DateFactory({
			year: v.getYears(),
			month: v.getMonths(),
			day: ev.value
		});

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
		const v = this.calcValue();
		const value = DateFactory({
			year: v.getYears(),
			month: ev.value,
			day: v.getDays()
		});

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
		const v = this.calcValue();
		const value = DateFactory({
			year: ev.value,
			month: v.getMonths(),
			day: v.getDays()
		});

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
		const value = this.toIDate(this.props.value);

		if (this.props.onChange) {
			// If we have an onChange handler to call, determine if the value actually changed and,
			// if so, call the handler.
			const changed =	value == null ||
							value.month !== this.state.value.month ||
							value.day !== this.state.value.day ||
							value.year !== this.state.value.year;
			if (changed) {
				this.props.onChange({
					value: this.calcValue().getJSDate()
				});
			}
		}

		if (this.props.onClose) {
			this.props.onClose(ev);
		}
	}

	render () {
		const value = this.calcValue();
		const label = value ? this.dateFormat.format(value) : null;
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

const ExpandableDatePicker = Expandable(DatePicker);

// Push down propTypes, and, since we don't export DatePicker, go ahead and remove the extra layer
// This one may be a bit of an exception case and this is not necessarily a pattern we want to
// apply.
ExpandableDatePicker.propTypes = Object.assign({}, ExpandableDatePicker.propTypes, DatePicker.propTypes);
ExpandableDatePicker.defaultProps = Object.assign({}, ExpandableDatePicker.defaultProps, DatePicker.defaultProps);
ExpandableDatePicker.displayName = 'DatePicker';
delete DatePicker.propTypes;
delete DatePicker.defaultProps;

export default ExpandableDatePicker;
export {ExpandableDatePicker as DatePicker, DatePickerBase};
