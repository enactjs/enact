/**
 * Exports the {@link moonstone/internal/DateTimeDecorator.DateTimeDecorator} higher-order component
 *
 * @module moonstone/internal/DateTimeDecorator
 * @private
 */

import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {memoize} from '@enact/core/util';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import DateFactory from '@enact/i18n/ilib/lib/DateFactory';
import Changeable from '@enact/ui/Changeable';
import PropTypes from 'prop-types';
import React from 'react';

import {Expandable} from '../../ExpandableItem';


/**
 * Converts a JavaScript Date to unix time
 *
 * @param	{Date}	date	A Date to convert
 *
 * @returns	{undefined}
 */
const toTime = (date) => {
	return date && date.getTime();
};

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

	const memoizedI18nConfig = memoize((/* locale */) => {
		// Guard for isomorphic builds
		if (typeof window !== 'undefined' && i18n) {
			return i18n();
		}
		return null;
	});

	const Decorator = class extends React.Component {
		static displayName = 'DateTimeDecorator'

		static propTypes = /** @lends moonstone/internal/DateTimeDecorator.DateTimeDecorator.prototype */ {
			/**
			 * The current locale as a
			 * {@link https://tools.ietf.org/html/rfc5646|BCP 47 language tag}.
			 *
			 * @type {String}
			 * @public
			 */
			locale: PropTypes.string,

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

			const initialValue = toTime(props.value);
			const value = props.open && !initialValue ? Date.now() : initialValue;
			this.state = {initialValue, value};

			this.handlers = {};
			if (handlers) {
				Object.keys(handlers).forEach(name => {
					this.handlers[name] = this.handlePickerChange.bind(this, handlers[name]);
				});
			}
		}

		static getDerivedStateFromProps (props, state) {
			const propValue = toTime(props.value);
			if (state.value !== propValue) {
				return {
					value: propValue
				};
			}
			return null;
		}

		/**
		 * Converts a Date to an IDate
		 *
		 * @param	{Date}	time	Date object
		 *
		 * @returns	{IDate}			ilib Date object
		 */
		toIDate (time) {
			if (time && this.props.locale) {
				return DateFactory({
					unixtime: time,
					timezone: 'local'
				});
			}
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
			forward('onChange', {value: date ? date.getJSDate() : null}, this.props);
		}

		handleOpen = (ev) => {
			forward('onOpen', ev, this.props);

			const newValue = toTime(this.props.value);
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
		}

		handleClose = (ev) => {
			forward('onClose', ev, this.props);
			const newValue = toTime(this.props.value);
			this.setState({
				value: newValue
			});
		}

		handlePickerChange = (handler, ev) => {
			const value = this.toIDate(this.state.value);
			handler(ev, value, i18n());
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
			const value = this.toIDate(this.state.value);
			// pickerValue is only set when cancelling to prevent the unexpected changing of the
			// picker values before closing.
			const pickerValue = this.state.pickerValue ? this.toIDate(this.state.pickerValue) : value;

			let label = null;
			let props = null;
			let order = defaultOrder;

			const i18nConfig = memoizedI18nConfig(this.props.locale);
			if (i18nConfig) {
				if (value) {
					label = i18nConfig.formatter.format(value);
				}
				props = customProps(i18nConfig, pickerValue, this.props);
				order = i18nConfig.order;
			}

			return (
				<Wrapped
					{...this.props}
					{...props}
					{...this.handlers}
					label={label}
					order={order}
					value={value}
					onOpen={this.handleOpen}
					onClose={this.handleClose}
				/>
			);
		}
	};

	return I18nContextDecorator(
		{rtlProp: 'rtl', localeProp: 'locale'},
		Expandable(
			Changeable(
				Decorator
			)
		)
	);
});

export default DateTimeDecorator;
export {DateTimeDecorator};
