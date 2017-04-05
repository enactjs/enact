/**
 * Exports the {@link moonstone/DayPicker.DayPicker} component.
 *
 * @module moonstone/DayPicker
 */

import $L from '@enact/i18n/$L';
import Changeable from '@enact/ui/Changeable';
import {coerceArray} from '@enact/core/util';
import DateFmt from '@enact/i18n/ilib/lib/DateFmt';
import {forward} from '@enact/core/handle';
import ilib from '@enact/i18n';
import LocaleInfo from '@enact/i18n/ilib/lib/LocaleInfo';
import React, {PropTypes} from 'react';

import {Expandable} from '../ExpandableItem';
import {ExpandableListBase} from '../ExpandableList';

const forwardSelect = forward('onSelect');
const SELECTED_DAY_TYPES = {
	EVERY_DAY: 0,
	EVERY_WEEKDAY: 1,
	EVERY_WEEKEND: 2,
	SELECTED_DAYS: 3,
	SELECTED_NONE: 4
};

/**
 * {@link moonstone/DayPicker.DayPicker} is a component that
 * allows the user to choose day(s) of the week.
 *
 * @class DayPickerBase
 * @memberof moonstone/DayPicker
 * @ui
 * @public
 */
const DayPickerBase = class extends React.Component {

	static displayName = 'DayPicker'

	static propTypes = /** @lends moonstone/DayPicker.DayPickerBase.prototype */ {
		/**
		 * The primary text of the Picker.
		 *
		 * @type {String}
		 * @required
		 * @public
		 */
		title: PropTypes.string.isRequired,

		/**
		 * When `true`, applies a disabled style and the control becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Callback to be called when a condition occurs which should cause the expandable to close
		 *
		 * @type {Function}
		 * @default null
		 * @public
		 */
		onClose: PropTypes.func,

		/**
		 * Callback to be called when a condition occurs which should cause the expandable to open
		 *
		 * @type {Function}
		 * @default null
		 * @public
		 */
		onOpen: PropTypes.func,

		/**
		 * Called when an item is selected. The first parameter will be an object containing a `selected` member,
		 * containing the array of numbers representing the selected days, 0 indexed
		 *
		 * @type {Function}
		 * @public
		 */
		onSelect: PropTypes.func,

		/**
		 * When `true`, the control in rendered in the expanded state, with the contents visible?
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		open: PropTypes.bool,

		/**
		 * An array of numbers (0-indexed) representing the selected days of the week.
		 *
		 * @type {Number|Number[]}
		 * @public
		 */
		selected: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)])
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
			this.weekEndStart = li.getWeekEndStart ? li.getWeekEndStart() : this.weekEndStart;
			this.weekEndEnd = li.getWeekEndEnd ? li.getWeekEndEnd() : this.weekEndEnd;

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
	getSelectedDayString = (type, selectDayStrings) => {
		const selected = coerceArray(this.props.selected);

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

	adjustSelection (selected, amount) {
		if (selected != null && amount !== 0) {
			selected = selected.map(day => (day - amount + 7) % 7);
		}

		return selected;
	}

	handleSelect = ({selected}) => {
		const adjusted = this.adjustSelection(selected, -this.firstDayOfWeek);
		forwardSelect({selected: adjusted}, this.props);
	}

	render () {
		const
			{selected, title} = this.props,
			type = this.calcSelectedDayType(this.props.selected),
			label = this.getSelectedDayString(type, this.shortDayNames),
			adjustSelected = this.adjustSelection(selected, this.firstDayOfWeek);
		let ariaLabel = null;

		if (type === SELECTED_DAY_TYPES.SELECTED_DAYS) {
			ariaLabel = `${title} ${this.getSelectedDayString(type, this.longDayNames)}`;
		}

		return (
			<ExpandableListBase
				{...this.props}
				aria-label={ariaLabel}
				label={label}
				onSelect={this.handleSelect}
				select="multiple"
				selected={adjustSelected}
			>
				{this.longDayNames}
			</ExpandableListBase>
		);
	}
};


/**
 * {@link moonstone/DayPicker.DayPicker} is a component that
 * allows the user to choose day(s) of the week.
 *
 * By default, `DayPicker` maintains the state of its `selected` property. Supply the
 * `defaultSelected` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `selected` at creation time and update it in response to
 * `onChange` events.
 *
 * `DayPicker` is an expandable component and it maintains its open/closed state by default. The
 * initial state can be supplied using `defaultOpen`. In order to directly control the open/closed
 * state, supply a value for `open` at creation time and update its value in response to
 * `onClose`/`OnOpen` events.
 *
 * @class DayPicker
 * @memberof moonstone/DayPicker
 * @mixes moonstone/ExpandableItem.Expandable
 * @mixes ui/Changeable.Changeable
 * @ui
 * @public
 */
const DayPicker = Expandable(
	Changeable(
		{prop: 'selected', change: 'onSelect'},
		DayPickerBase
	)
);

export default DayPicker;
export {DayPicker, DayPickerBase};
