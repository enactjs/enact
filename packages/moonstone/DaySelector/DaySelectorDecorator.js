import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
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
 * Applies Moonstone specific behaviors to
 * [DaySelector]{@link moonstone/DaySelector.DaySelectorBase}.
 *
 * @hoc
 * @memberof moonstone/DaySelector
 * @mixes ui/Changeable.Changeable
 * @mixes moonstone/Skinnable.Skinnable
 * @public
 */
const DaySelectorDecorator = hoc((config, Wrapped) => {	// eslint-disable-line no-unused-vars
	return class extends React.Component {

		static displayName = 'DaySelectorDecorator'

		static propTypes = /** @lends moonstone/DaySelector.DaySelectorDecorator.prototype */ {
			/**
			 * The "aria-label" for the selector.
			 *
			 * @memberof moonstone/DaySelector.DaySelectorDecorator.prototype
			 * @type {String}
			 * @private
			 */
			'aria-label': PropTypes.string,

			/**
			 * The format for names of days used in the label.
			 *
			 * @type {String}
			 * @default 'long'
			 * @public
			 */
			dayNameLength: PropTypes.oneOf(['short', 'medium', 'long', 'full']),

			/**
			 * Applies a disabled style and prevents interacting with the component.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			disabled: PropTypes.bool,

			/**
			 * The text displayed in the label when every day is selected.
			 *
			 * @type {String}
			 * @default 'Every Day'
			 * @public
			 */
			everyDayText: PropTypes.string,

			/**
			 * The text displayed in the label when every weekeday is selected.
			 *
			 * @type {String}
			 * @default 'Every Weekday'
			 * @public
			 */
			everyWeekdayText: PropTypes.string,

			/**
			 * The text displayed in the label when every weekend day is selected.
			 *
			 * @type {String}
			 * @default 'Every Weekend'
			 * @public
			 */
			everyWeekendText: PropTypes.string,

			locale: PropTypes.string,

			/**
			 * Called when an day is selected or unselected.
			 *
			 * The event payload will be an object with the following members:
			 * * `selected` - An array of numbers representing the selected days, 0 indexed
			 * * `content` - Localized string representing the selected days
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
			selected: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),

			/**
			 * Used by DayPicker to generate the aria-label.
			 *
			 * Type set to "any" to avoid warnings if passed in some other unknown scenario
			 *
			 * @type {Node}
			 * @private
			 */
			title: PropTypes.any
		}

		static defaultProps = {
			dayNameLength: 'long',
			disabled: false
		}

		constructor (props) {
			super(props);

			this.state = {
				// default indexes
				firstDayOfWeek: 0,
				weekendStart: 6,
				weekendEnd: 0,
				// default strings for long and short day strings
				dayNameLength: props.dayNameLength,
				locale: props.locale
			};
		}

		static getDerivedStateFromProps (props, state) {
			if (state.dayNameLength !== props.dayNameLength || state.locale !== props.locale) {
				return {
					dayNameLength: props.dayNameLength,
					locale: props.locale
				};
			}
			return null;
		}

		setLocaleDayNames () {
			if (typeof window === 'undefined') return null;

			const df = new DateFmt({length: 'full'});
			const sdf = new DateFmt({length: this.state.dayNameLength});
			const li = new LocaleInfo(ilib.getLocale());
			const daysOfWeek = df.getDaysOfWeek();
			const days = sdf.getDaysOfWeek();
			const firstDayOfWeek = li.getFirstDayOfWeek();

			this.localeDayNames = {
				fullDayNames: [],
				abbreviatedDayNames: []
			};

			for (let i = 0; i < 7; i++) {
				const index = (i + firstDayOfWeek) % 7;
				this.localeDayNames.fullDayNames[i] = daysOfWeek[index];
				this.localeDayNames.abbreviatedDayNames[i] = days[index];
			}
		}

		getLocaleWeekRange () {
			let localeWeekendStart, localeWeekendEnd;
			const li = new LocaleInfo(ilib.getLocale());
			const firstDayOfWeek = li.getFirstDayOfWeek();
			if (li.getWeekEndStart) {
				localeWeekendStart = this.adjustWeekends(firstDayOfWeek, li.getWeekEndStart());
			}

			if (li.getWeekEndEnd) {
				localeWeekendEnd = this.adjustWeekends(firstDayOfWeek, li.getWeekEndEnd());
			}
			return {localeWeekendStart, localeWeekendEnd};
		}

		/**
		 * Determines which day type should be returned, based on the selected indices.
		 *
		 * @param {Number[]} [selected] Array of day indexes
		 *
		 * @returns {Number}
		 */
		calcSelectedDayType (selected) {
			if (selected == null) return SELECTED_DAY_TYPES.SELECTED_NONE;
			const {localeWeekendStart, localeWeekendEnd} = this.getLocaleWeekRange();
			let
				weekendStart = false,
				weekendEnd = false,
				index;

			const
				length = selected.length,
				weekendLength = localeWeekendStart === localeWeekendEnd ? 1 : 2;

			if (length === 7) return SELECTED_DAY_TYPES.EVERY_DAY;

			for (let i = 0; i < 7; i++) {
				index = selected[i];
				weekendStart = weekendStart || localeWeekendStart === index;
				weekendEnd = weekendEnd || localeWeekendEnd === index;
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
		getSelectedDayString (selected, selectDayStrings) {
			const {
				everyDayText = $L('Every Day'),
				everyWeekdayText = $L('Every Weekday'),
				everyWeekendText = $L('Every Weekend')
			} = this.props;

			if (selected != null) {
				selected = coerceArray(selected);
			}

			const type = this.calcSelectedDayType(selected);
			const format = (list) => {
				let separator = this.props.locale === 'fa-IR' ? '، ' : ', ';

				return list.join(separator);
			};

			switch (type) {
				case SELECTED_DAY_TYPES.EVERY_DAY :
					return everyDayText;
				case SELECTED_DAY_TYPES.EVERY_WEEKEND :
					return everyWeekendText;
				case SELECTED_DAY_TYPES.EVERY_WEEKDAY :
					return everyWeekdayText;
				case SELECTED_DAY_TYPES.SELECTED_DAYS :
					return format(selected.sort().map((dayIndex) => selectDayStrings[dayIndex]));
				case SELECTED_DAY_TYPES.SELECTED_NONE :
					return '';
			}
		}

		getAriaLabel (fullDayNames) {
			const {'aria-label': ariaLabel, selected, title} = this.props;

			if (ariaLabel != null || title == null || selected == null || selected.length === 0) {
				return ariaLabel;
			}

			const label = this.getSelectedDayString(selected, fullDayNames);

			return `${title} ${label}`;
		}

		adjustWeekends (firstDayOfWeek, day) {
			return ((day - firstDayOfWeek + 7) % 7);
		}

		handleSelect = ({selected}) => {
			const labels = this.localeDayNames.abbreviatedDayNames;
			const content = this.getSelectedDayString(selected, labels);

			forwardSelect({selected, content}, this.props);
		}

		render () {
			const {selected, ...rest} = this.props;
			this.setLocaleDayNames();
			const content = this.getSelectedDayString(selected, this.localeDayNames.abbreviatedDayNames);

			delete rest.dayNameLength;
			delete rest.everyDayText;
			delete rest.everyWeekdayText;
			delete rest.everyWeekendText;
			delete rest.locale;

			return (
				<Wrapped
					{...rest}
					aria-label={this.getAriaLabel(this.localeDayNames.fullDayNames)}
					label={content}
					onSelect={this.handleSelect}
					selected={selected}
				>
					{this.localeDayNames.abbreviatedDayNames.map((children, index) => ({
						children,
						// "short" dayNameLength can result in the same name so adding index
						key: `${index} ${children}`,
						'aria-label': this.localeDayNames.fullDayNames[index]
					}))}
				</Wrapped>
			);
		}
	};
});

export default DaySelectorDecorator;
export {
	DaySelectorDecorator
};
