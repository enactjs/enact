import Cancelable from '@enact/ui/Cancelable';
import DateFactory from '@enact/i18n/ilib/lib/DateFactory';
import hoc from '@enact/core/hoc';
import ilib from '@enact/i18n';
import RadioDecorator from '@enact/ui/RadioDecorator';
import React from 'react';
import Toggleable from '@enact/ui/Toggleable';

const CancelableDecorator = Cancelable({
	component: 'span',
	onCancel: function (props) {
		if (props.open) {
			props.onClose();
		} else {
			// Return `true` to allow event to propagate to containers for unhandled cancel
			return true;
		}
	}
});

/**
 * {@link moonstone/internal/DateTimeDecorator.DateTimeDecorator} provides common behavior for a
 * {@link moonstone/DatePicker.DatePicker} and {@link moonstone/TimePicker.TimePicker}.
 *
 * @class DateTimeDecorator
 * @memberof moonstone/internal/DateTimeDecorator
 * @hoc
 * @private
 */
const DateTimeDecorator = hoc((config, Wrapped) => {
	const {customProps, defaultOrder, handlers, i18n} = config;

	const Component = CancelableDecorator(Wrapped);

	const Decorator = class extends React.Component {
		static displayName = 'DateTimeDecorator'

		static propTypes = /** @lends moonstone/internal/DateTimeDecorator.DateTimeDecorator.prototype */ {
			/**
			 * Handler for `onChange` events
			 *
			 * @type {Function}
			 * @public
			 */
			onChange: React.PropTypes.func,

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

		constructor (props) {
			super(props);

			this.initI18n();

			const initialValue = this.toTime(props.value);
			this.state = {
				initialValue,
				value: initialValue
			};

			this.handlers = {};
			if (handlers) {
				Object.keys(handlers).forEach(name => {
					this.handlers[name] = this.handlePickerChange.bind(this, handlers[name]);
				});
			}
		}

		componentWillUpdate () {
			// check for a new locale when updating
			this.initI18n();
		}

		initI18n () {
			const locale = ilib.getLocale();

			if (i18n && this.locale !== locale && typeof window === 'object') {
				this.locale = locale;
				this.i18nContext = i18n();
			}
		}

		componentWillReceiveProps (nextProps) {
			const newValue = this.toTime(nextProps.value);

			if (nextProps.open && !this.props.open) {
				const value = newValue || Date.now();

				// if we're opening, store the current value as the initial value for cancellation
				this.setState({
					initialValue: newValue,
					value
				});

				// if no value was provided, we need to emit the onChange event for the generated value
				if (!newValue) {
					this.emitChange(this.toIDate(value));
				}
			} else if (newValue) {
				this.setState({
					value: newValue
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
					value: date && date.getJSDate()
				});
			}
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

		handlePickerChange = (handler, ev) => {
			const value = this.calcValue();
			handler(ev, value, this.i18nContext);
			this.updateValue(value);
		}

		handleCancel = () => {
			const {initialValue} = this.state;

			// if we're cancelling, reset our state and emit an onChange with the initial value
			this.setState({
				value: initialValue,
				initialValue: null
			});

			this.emitChange(this.toIDate(initialValue));
		}

		render () {
			const value = this.toIDate(this.state.value);
			const label = value && this.i18nContext ? this.i18nContext.formatter.format(value) : null;
			const props = customProps(this.i18nContext, value);
			const order = this.i18nContext ? this.i18nContext.order : defaultOrder;

			return (
				<Component
					{...this.props}
					{...props}
					{...this.handlers}
					label={label}
					onCancel={this.handleCancel}
					order={order}
					value={value}
				/>
			);
		}
	};

	return Toggleable(
		{toggle: null, activate: 'onOpen', deactivate: 'onClose', mutable: true, prop: 'open'},
		RadioDecorator(
			{activate: 'onOpen', deactivate: 'onClose', prop: 'open'},
			Decorator
		)
	);
});

export default DateTimeDecorator;
export {DateTimeDecorator};
