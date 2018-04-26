import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {contextTypes} from '@enact/core/internal/PubSub';
import {coerceArray} from '@enact/core/util';
import ilib from '@enact/i18n';
import DateFmt from '@enact/i18n/ilib/lib/DateFmt';
import LocaleInfo from '@enact/i18n/ilib/lib/LocaleInfo';
import PropTypes from 'prop-types';
import React from 'react';

import $L from '../internal/$L';

const forwardSelect = forward('onSelect');
const SELECTED_DAY_TYPES = {
	EVERY_DAY: 0,
	EVERY_WEEKDAY: 1,
	EVERY_WEEKEND: 2,
	SELECTED_DAYS: 3,
	SELECTED_NONE: 4
};

/**
 * Moonstone-specific behaviors to apply to
 * [DaySelector]{@link moonstone/DaySelector.DaySelectorBase}.
 *
 * @hoc DaySelectorDecorator
 * @memberof moonstone/DaySelector
 * @mixes ui/Changeable.Changeable
 * @mixes ui/Skinnable.Skinnable
 * @ui
 * @public
 */
const DaySelectorDecorator = hoc((config, Wrapped) => {
	return class extends React.Component {

		static displayName = 'DaySelector'

		static contextTypes = contextTypes

		static propTypes = /** @lends moonstone/DaySelector.DaySelectorDecorator.prototype */ {
			/**
			 * The format for names of days used in the label. "M, T, W" for `short`; "Mo, Tu, We" for `medium`, etc.
			 *
			 * @type {String}
			 * @default 'long'
			 * @public
			 */
			dayNameLength: PropTypes.oneOf(['short', 'medium', 'long', 'full']),

			/**
			 * When `true`, applies a disabled style and the control becomes non-interactive.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			disabled: PropTypes.bool,

			/**
			 * Called when an item is selected. The first parameter will be an object containing a
			 * `selected` member, containing the array of numbers representing the selected days, zero
			 * indexed.
			 *
			 * @type {Function}
			 * @public
			 */
			onSelect: PropTypes.func,

			/**
			 * An array of numbers (0-indexed) representing the selected days of the week.
			 *
			 * @type {Number|Number[]}
			 * @public
			 */
			selected: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)])
		}

		static defaultProps = {
			disabled: false,
			dayNameLength: 'long'
		}

		constructor (props) {
			super(props);

			this.state = {
				// default indexes
				firstDayOfWeek: 0,
				weekendStart: 6,
				weekendEnd: 0,
				// default strings for long and short day strings
				fullDayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
				abbreviatedDayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
				...this.getLocaleState(props.dayNameLength)
			};
		}

		componentDidMount () {
			if (this.context.Subscriber) {
				this.context.Subscriber.subscribe('i18n', this.handleLocaleChange);
			}
		}

		componentWillReceiveProps (nextProps) {
			if (this.props.dayNameLength !== nextProps.dayNameLength) {
				this.setState(this.getLocaleState(nextProps.dayNameLength));
			}
		}

		componentWillUnmount () {
			if (this.context.Subscriber) {
				this.context.Subscriber.unsubscribe('i18n', this.handleLocaleChange);
			}
		}

		handleLocaleChange = () => {
			this.setState(({locale}) => this.getLocaleState(this.props.dayNameLength, locale));
		}

		getLocaleState (dayNameLength, locale) {
			const newLocale = ilib.getLocale();
			if (locale === newLocale || typeof window === 'undefined') return null;

			const df = new DateFmt({length: 'full'});
			const sdf = new DateFmt({length: dayNameLength});
			const li = new LocaleInfo(ilib.getLocale());
			const daysOfWeek = df.getDaysOfWeek();
			const days = sdf.getDaysOfWeek();
			const firstDayOfWeek = li.getFirstDayOfWeek();

			const state = {
				locale: newLocale,
				everyDayText: $L('Every Day'),
				everyWeekdayText: $L('Every Weekday'),
				everyWeekendText: $L('Every Weekend'),
				fullDayNames: [],
				abbreviatedDayNames: [],
				firstDayOfWeek
			};

			if (li.getWeekEndStart) {
				state.weekendStart = this.adjustWeekends(firstDayOfWeek, li.getWeekEndStart());
			}

			if (li.getWeekEndEnd) {
				state.weekendEnd = this.adjustWeekends(firstDayOfWeek, li.getWeekEndEnd());
			}

			for (let i = 0; i < 7; i++) {
				const index = (i + firstDayOfWeek) % 7;
				state.fullDayNames[i] = daysOfWeek[index];
				state.abbreviatedDayNames[i] = days[index];
			}

			return state;
		}

		/**
		 * Determines which day type should be returned, based on the selected indices.
		 *
		 * @param {Number[]} [selected] Array of day indexes
		 *
		 * @returns {Number}
		 */
		calcSelectedDayType (selected) {
			if (!selected) return SELECTED_DAY_TYPES.SELECTED_NONE;
			selected = coerceArray(selected);

			let
				weekendStart = false,
				weekendEnd = false,
				index;

			const
				length = selected.length,
				weekendLength = this.state.weekendStart === this.state.weekendEnd ? 1 : 2;

			if (length === 7) return SELECTED_DAY_TYPES.EVERY_DAY;

			for (let i = 0; i < 7; i++) {
				index = selected[i];
				weekendStart = weekendStart || this.state.weekendStart === index;
				weekendEnd = weekendEnd || this.state.weekendEnd === index;
			}

			if (weekendStart && weekendEnd && length === weekendLength) {
				return SELECTED_DAY_TYPES.EVERY_WEEKEND;
			} else if (!weekendStart && !weekendEnd && length === 7 - weekendLength) {
				return SELECTED_DAY_TYPES.EVERY_WEEKDAY;
			} else {
				return SELECTED_DAY_TYPES.SELECTED_DAYS;
			}
		}

		/**
		 * Determines whether it should return "Every Day", "Every Weekend", "Every Weekday" or list of
		 * days for a given selected day type.
		 *
		 * @param {Number} type of selected days
		 * @param {Number[]} Array of day indexes
		 * @param {String[]} Array of long or short day strings
		 *
		 * @returns {String} "Every Day", "Every Weekend", "Every Week" or list of days
		 */
		getSelectedDayString = (type, selected, selectDayStrings) => {
			switch (type) {
				case SELECTED_DAY_TYPES.EVERY_DAY :
					return this.state.everyDayText;
				case SELECTED_DAY_TYPES.EVERY_WEEKEND :
					return this.state.everyWeekendText;
				case SELECTED_DAY_TYPES.EVERY_WEEKDAY :
					return this.state.everyWeekdayText;
				case SELECTED_DAY_TYPES.SELECTED_DAYS :
					return selected.sort().map((dayIndex) => selectDayStrings[dayIndex]).join(', ');
				case SELECTED_DAY_TYPES.SELECTED_NONE :
					return '';
			}
		}

		adjustWeekends (firstDayOfWeek, day) {
			return ((day - firstDayOfWeek + 7) % 7);
		}

		handleSelect = ({selected}) => {
			const type = this.calcSelectedDayType(selected);
			const labels = this.state.abbreviatedDayNames;
			const content = this.getSelectedDayString(type, selected, labels);

			forwardSelect({selected, content}, this.props);
		}

		render () {
			const {selected, ...rest} = this.props;
			const type = this.calcSelectedDayType(selected);
			const content = this.getSelectedDayString(type, selected, this.state.abbreviatedDayNames);

			delete rest.dayNameLength;

			return (
				<Wrapped {...rest} label={content} fullDayNames={this.state.fullDayNames} onSelect={this.handleSelect} selected={selected}>
					{this.state.abbreviatedDayNames}
				</Wrapped>
			);
		}
	};
});

export default DaySelectorDecorator;
export {
	DaySelectorDecorator
};
