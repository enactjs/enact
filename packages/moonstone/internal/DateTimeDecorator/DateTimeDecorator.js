/**
 * Exports the {@link moonstone/internal/DateTimeDecorator.DateTimeDecorator} higher-order component
 *
 * @module moonstone/internal/DateTimeDecorator
 * @private
 */

import hoc from '@enact/core/hoc';
import ilib from '@enact/i18n';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import DateFactory from '@enact/i18n/ilib/lib/DateFactory';
import Changeable from '@enact/ui/Changeable';
import PropTypes from 'prop-types';
import React from 'react';

import {Expandable} from '../../ExpandableItem';

/**
 * {@link moonstone/internal/DateTimeDecorator.DateTimeDecorator} provides common behavior for
 * {@link moonstone/DatePicker.DatePicker} and {@link moonstone/TimePicker.TimePicker}.
 *
 * @class DateTimeDecorator
 * @memberof moonstone/internal/DateTimeDecorator
 * @mixes ui/Toggleable.Toggleable
 * @mixes ui/RadioDecorator.RadioDecorator
 * @mixes ui/Changeable.Changeable
 * @hoc
 * @private
 */
const DateTimeDecorator = hoc((config, Wrapped) => {
	const {customProps, defaultOrder, handlers, i18n} = config;

	const Decorator = class extends React.Component {
		static displayName = 'DateTimeDecorator'

		static propTypes = /** @lends moonstone/internal/DateTimeDecorator.DateTimeDecorator.prototype */ {
			/**
			 * Handler for `onChange` events
			 *
			 * @type {Function}
			 * @public
			 */
			onChange: PropTypes.func,

			/**
			 * When `true`, the date picker is expanded to select a new date.
			 *
			 * @type {Boolean}
			 * @public
			 */
			open: PropTypes.bool,

			/**
			 * The selected date
			 *
			 * @type {Date}
			 * @public
			 */
			value: PropTypes.instanceOf(Date)
		}

		constructor (props) {
			super(props);

			this.initI18n();

			const initialValue = this.toTime(props.value);
			const value = props.open && !initialValue ? Date.now() : initialValue;
			this.state = {
				initialValue,
				value,
				i18n: null
			};

			this.handlers = {};
			if (handlers) {
				Object.keys(handlers).forEach(name => {
					this.handlers[name] = this.handlePickerChange.bind(this, handlers[name]);
				});
			}
		}

		componentWillReceiveProps (nextProps) {
			const newValue = this.toTime(nextProps.value);

			if (nextProps.open && !this.props.open) {
				const value = newValue || Date.now();

				// if we're opening, store the current value as the initial value for cancellation
				this.setState({
					initialValue: newValue,
					pickerValue: null,
					value
				});

				// if no value was provided, we need to emit the onChange event for the generated value
				if (!newValue) {
					this.emitChange(this.toIDate(value));
				}
			} else {
				this.setState({
					value: newValue
				});
			}
		}

		componentWillUpdate () {
			// check for a new locale when updating
			this.initI18n();
		}

		componentWillUnmount () {
			this.unmounted = true;
		}

		initI18n () {
			const locale = ilib.getLocale();

			if (i18n && this.locale !== locale && typeof window === 'object') {
				this.locale = locale;

				i18n().then(context => {
					if (this.unmounted) return;

					this.setState({
						i18n: context
					});
				});
			}
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
			const {day, month, year} = value;
			const maxDays = value.cal.getMonLength(month, year);
			value.day = (day <= maxDays) ? day : maxDays;

			const date = DateFactory(value);
			const newValue = date.getTimeExtended();
			const changed =	this.props.value == null || this.props.value !== newValue;

			this.setState({
				value: newValue
			});

			if (changed) {
				this.emitChange(date);
			}

			return newValue;
		}

		emitChange = (date) => {
			const {onChange} = this.props;
			if (onChange) {
				onChange({
					value: date ? date.getJSDate() : null
				});
			}
		}

		handlePickerChange = (handler, ev) => {
			const value = this.toIDate(this.state.value);
			handler(ev, value, this.i18nContext);
			this.updateValue(value);
		}

		handleCancel = () => {
			const {initialValue, value} = this.state;

			if (this.props.open) {
				// if we're cancelling, reset our state and emit an onChange with the initial value
				this.setState({
					value: initialValue,
					initialValue: null,
					pickerValue: value
				});

				if (initialValue !== value) {
					this.emitChange(this.toIDate(initialValue));
				}
			}
		}

		render () {
			if (!this.state.i18n) {
				return (
					<Wrapped
						{...this.props}
						disabled
						order={[]}
					/>
				);
			}

			const value = this.toIDate(this.state.value);
			// pickerValue is only set when cancelling to prevent the unexpected changing of the
			// picker values before closing.
			const pickerValue = this.state.pickerValue ? this.toIDate(this.state.pickerValue) : value;

			const label = value ? this.state.i18n.formatter.format(value) : null;
			const props = customProps(this.state.i18n, pickerValue, this.props);
			const order = this.state.i18n.order;

			return (
				<Wrapped
					{...this.props}
					{...props}
					{...this.handlers}
					label={label}
					order={order}
					value={value}
				/>
			);
		}
	};

	return I18nContextDecorator(
		{rtlProp: 'rtl'},
		Expandable(
			Changeable(
				Decorator
			)
		)
	);
});

export default DateTimeDecorator;
export {DateTimeDecorator};
