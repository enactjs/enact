/**
 * Exports the {@link moonstone/DaySelector.DaySelector} component.
 *
 * @module moonstone/DaySelector
 */

import Changeable from '@enact/ui/Changeable';
import {coerceArray} from '@enact/core/util';
import DateFmt from '@enact/i18n/ilib/lib/DateFmt';
import {forward} from '@enact/core/handle';
import Group from '@enact/ui/Group';
import ilib from '@enact/i18n';
import LocaleInfo from '@enact/i18n/ilib/lib/LocaleInfo';
import React from 'react';
import PropTypes from 'prop-types';
import Pure from '@enact/ui/internal/Pure';

import $L from '../internal/$L';
import FormCheckboxItem from '../FormCheckboxItem';

import css from './DaySelector.less';

const forwardSelect = forward('onSelect');
const SELECTED_DAY_TYPES = {
	EVERY_DAY: 0,
	EVERY_WEEKDAY: 1,
	EVERY_WEEKEND: 2,
	SELECTED_DAYS: 3,
	SELECTED_NONE: 4
};

/**
 * {@link moonstone/DaySelector.DaySelector} is a component that
 * allows the user to choose day(s) of the week.
 *
 * @class DaySelectorBase
 * @memberof moonstone/DaySelector
 * @ui
 * @public
 */
const DaySelectorBase = class extends React.Component {

	static displayName = 'DaySelector'

	static propTypes = /** @lends moonstone/DaySelector.DaySelectorBase.prototype */ {
		/**
		 * When `true`, applies a disabled style and the control becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Called when an item is selected. The first parameter will be an object containing a `selected` member,
		 * containing the array of numbers representing the selected days, 0 indexed
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
		* Day text type to be displayed in the component.
		* If `true` short text will be displayed for the the days (Sun,Mon..)
		* if `false`, long text will be displayed (Sunday,Monday..)
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		shortDayText: PropTypes.bool
	}

	constructor (props) {
		super(props);

		// default indexes
		this.firstDayOfWeek = 0;
		this.weekEndStart = 6;
		this.weekEndEnd = 0;

		// default strings for long and short day strings
		this.longDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		this.shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

		this.initIlib();
	}

	componentWillUpdate () {
		this.initIlib();
	}

	initIlib () {
		const locale = ilib.getLocale();
		if (this.locale !== locale && typeof window === 'object') {
			this.locale = locale;

			const df = new DateFmt({length: 'full'});
			const sdf = new DateFmt({length: 'long'});
			const li = new LocaleInfo(ilib.getLocale());
			const daysOfWeek = df.getDaysOfWeek();
			const days = sdf.getDaysOfWeek();

			this.firstDayOfWeek = li.getFirstDayOfWeek();
			this.weekEndStart = li.getWeekEndStart ? this.adjustWeekends(li.getWeekEndStart()) : this.weekEndStart;
			this.weekEndEnd = li.getWeekEndEnd ? this.adjustWeekends(li.getWeekEndEnd()) : this.weekEndEnd;

			for (let i = 0; i < 7; i++) {
				const index = (i + this.firstDayOfWeek) % 7;
				this.longDayNames[i] = daysOfWeek[index];
				this.shortDayNames[i] = days[index];
			}

			this.everyDayText = $L('Every Day');
			this.everyWeekdayText = $L('Every Weekday');
			this.everyWeekendText = $L('Every Weekend');
		}
	}

	/**
	 * Determines whether it should return day type number for a given selected indexes.
	 *
	 * @param {Number[]} [selected] Array of day indexes
	 *
	 * @returns {Number}
	 */
	calcSelectedDayType (selected = []) {
		if (selected === null || selected.length === 0) return SELECTED_DAY_TYPES.SELECTED_NONE;
		selected = coerceArray(selected);

		let
			bWeekEndStart = false,
			bWeekEndEnd = false,
			index;

		const
			length = selected.length,
			weekendLength = this.weekEndStart === this.weekEndEnd ? 1 : 2;

		if (length === 7) return SELECTED_DAY_TYPES.EVERY_DAY;

		for (let i = 0; i < 7; i++) {
			index = selected[i];
			bWeekEndStart = bWeekEndStart || this.weekEndStart === index;
			bWeekEndEnd = bWeekEndEnd || this.weekEndEnd === index;
		}

		if (bWeekEndStart && bWeekEndEnd && length === weekendLength) {
			return SELECTED_DAY_TYPES.EVERY_WEEKEND;
		} else if (!bWeekEndStart && !bWeekEndEnd && length === 7 - weekendLength) {
			return SELECTED_DAY_TYPES.EVERY_WEEKDAY;
		} else {
			return SELECTED_DAY_TYPES.SELECTED_DAYS;
		}
	}

	/**
	 * Determines whether it should return "Every Day", "Every Weekend", "Every Weekday" or list of
	 * days for a given selected day type.
	 *
	 * @param {Number} selected day type
	 *
	 * @returns {String} "Every Day", "Every Weekend", "Every Week" or list of days
	 */
	getSelectedDayString = (selected, type, selectDayStrings) => {
		if (type === SELECTED_DAY_TYPES.EVERY_DAY) {
			return this.everyDayText;
		} else if (type === SELECTED_DAY_TYPES.EVERY_WEEKEND) {
			return this.everyWeekendText;
		} else if (type === SELECTED_DAY_TYPES.EVERY_WEEKDAY) {
			return this.everyWeekdayText;
		} else if (type === SELECTED_DAY_TYPES.SELECTED_DAYS) {
			return selected.sort().map((dayIndex) => selectDayStrings[dayIndex]).join(', ');
		}
	}

	adjustWeekends (day) {
		return ((day - this.firstDayOfWeek + 7) % 7);
	}

	handleSelect = ({selected}) => {
		const
			type = this.calcSelectedDayType(selected),
			label = this.getSelectedDayString(selected, type, this.props.shortDayText ? this.shortDayNames : this.longDayNames);
		forwardSelect({selected: selected, content:label}, this.props);
	}

	render () {
		const props = Object.assign({}, this.props);
		delete props.shortDayText;

		return (
			<Group
				{...props}
				childComponent={FormCheckboxItem}
				childSelect="onToggle"
				className={css.daySelector}
				itemProps={{className: css.daySelectorControl, disabled: props.disabled}}
				onSelect={this.handleSelect}
				select='multiple'
				selected={props.selected}
				selectedProp="selected"
			>
				{this.props.shortDayText ? this.shortDayNames : this.longDayNames}
			</Group>
		);
	}
};


/**
 * {@link moonstone/DaySelector.DaySelector} is a component that
 * allows the user to choose day(s) of the week.
 *
 * By default, `DaySelector` maintains the state of its `selected` property. Supply the
 * `defaultSelected` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `selected` at creation time and update it in response to
 * `onSelect` events.
 *
 * @class DaySelector
 * @memberof moonstone/DaySelector
 * @mixes ui/Changeable.Changeable
 * @ui
 * @public
 */
const DaySelector = Pure(
	Changeable(
		{change: 'onSelect', prop: 'selected'},
		DaySelectorBase
	)
);

export default DaySelector;
export {DaySelector, DaySelectorBase};
