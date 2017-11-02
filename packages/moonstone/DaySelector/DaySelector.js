/**
 * Exports the {@link moonstone/DaySelector.DaySelector} component.
 *
 * @module moonstone/DaySelector
 */

import Changeable from '@enact/ui/Changeable';
import classNames from 'classnames';
import {coerceArray} from '@enact/core/util';
import DateFmt from '@enact/i18n/ilib/lib/DateFmt';
import {forward} from '@enact/core/handle';
import Group from '@enact/ui/Group';
import ilib from '@enact/i18n';
import LocaleInfo from '@enact/i18n/ilib/lib/LocaleInfo';
import React from 'react';
import PropTypes from 'prop-types';
import Pure from '@enact/ui/internal/Pure';

import Skinnable from '../Skinnable';

import $L from '../internal/$L';
import DaySelectorItem from './DaySelectorItem';

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
		* If `false` short text will be displayed for the the days (Sun,Mon..)
		* if `true`, long text will be displayed (Sunday,Monday..)
		*
		* @type {Boolean}
		* @public
		*/
		useLongDayText: PropTypes.bool
	}

	constructor (props) {
		super(props);

		// default indexes
		this.firstDayOfWeek = 0;
		this.weekendStart = 6;
		this.weekendEnd = 0;

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
			this.weekendStart = li.getWeekEndStart ? this.adjustWeekends(li.getWeekEndStart()) : this.weekendStart;
			this.weekendEnd = li.getWeekEndEnd ? this.adjustWeekends(li.getWeekEndEnd()) : this.weekendEnd;

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
			weekendLength = this.weekendStart === this.weekendEnd ? 1 : 2;

		if (length === 7) return SELECTED_DAY_TYPES.EVERY_DAY;

		for (let i = 0; i < 7; i++) {
			index = selected[i];
			weekendStart = weekendStart || this.weekendStart === index;
			weekendEnd = weekendEnd || this.weekendEnd === index;
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
				return this.everyDayText;
			case SELECTED_DAY_TYPES.EVERY_WEEKEND :
				return this.everyWeekendText;
			case SELECTED_DAY_TYPES.EVERY_WEEKDAY :
				return this.everyWeekdayText;
			case SELECTED_DAY_TYPES.SELECTED_DAYS :
				return selected.sort().map((dayIndex) => selectDayStrings[dayIndex]).join(', ');
			case SELECTED_DAY_TYPES.SELECTED_NONE :
				return '';
		}
	}

	adjustWeekends (day) {
		return ((day - this.firstDayOfWeek + 7) % 7);
	}

	handleSelect = ({selected}) => {
		const
			type = this.calcSelectedDayType(selected),
			content = this.getSelectedDayString(type, selected, this.props.useLongDayText ? this.longDayNames : this.shortDayNames);
		forwardSelect({selected, content}, this.props);
	}

	render () {
		const {className, disabled, useLongDayText, ...rest} = this.props;
		const combinedClassName = classNames(className, css.daySelector);

		return (
			<Group
				{...rest}
				childComponent={DaySelectorItem}
				childSelect="onToggle"
				className={combinedClassName}
				disabled={disabled}
				itemProps={{className: css.daySelectorItem, disabled}}
				onSelect={this.handleSelect}
				select="multiple"
				selectedProp="selected"
			>
				{useLongDayText ? this.longDayNames : this.shortDayNames}
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
		Skinnable(
			DaySelectorBase
		)

	)
);

export default DaySelector;
export {DaySelector, DaySelectorBase};
