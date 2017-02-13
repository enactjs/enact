/**
 * Exports the {@link moonstone/DayPicker.DayPicker} component.
 *
 * @module moonstone/DayPicker
 */

import {$L} from '@enact/i18n';
import {coerceArray} from '@enact/core/util';
import DateFmt from '@enact/i18n/ilib/lib/DateFmt';
import {forward} from '@enact/core/handle';
import ilib from '@enact/i18n/ilib/lib/ilib';
import LocaleInfo from '@enact/i18n/ilib/lib/LocaleInfo';
import React, {PropTypes} from 'react';

import ExpandableList from '../ExpandableList';

const forwardSelect = forward('onSelect');

/**
 * {@link moonstone/DayPicker.DayPicker} is a component that
 * allows the user to choose day(s) of the week.
 *
 * @class DayPicker
 * @memberof moonstone/DayPicker
 * @ui
 * @public
 */
const DayPicker = class extends React.Component {

	static displayName = 'DayPicker'

	static propTypes = /** @lends moonstone/DayPicker.DayPicker.prototype */ {
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
	 * Determines whether it should return "Every Day", "Every Weekend", "Every Weekday" or list of
	 * days for a given selected indexes.
	 *
	 * @param {Number[]} [selected] Array of day indexes
	 *
	 * @returns {Object} contains "Every Day", "Every Weekend", "Every Week" or list of days and string for aria-label
	 */
	getSelectedDayString (selected = []) {
		selected = coerceArray(selected);

		let bWeekEndStart = false,
			bWeekEndEnd = false,
			index;

		const
			length = selected.length,
			weekendLength = this.weekEndStart === this.weekEndEnd ? 1 : 2;

		if (length === 7) return this.everyDayText;

		for (let i = 0; i < 7; i++) {
			index = selected[i];
			bWeekEndStart = bWeekEndStart || this.weekEndStart === index;
			bWeekEndEnd = bWeekEndEnd || this.weekEndEnd === index;
		}

		if (bWeekEndStart && bWeekEndEnd && length === weekendLength) {
			return {label: this.everyWeekendText};
		} else if (!bWeekEndStart && !bWeekEndEnd && length === 7 - weekendLength) {
			return {label: this.everyWeekdayText};
		} else {
			const
				label = selected.sort().map((dayIndex) => this.shortDayNames[dayIndex]).join(', '),
				ariaLabel = selected.sort().map((dayIndex) => this.longDayNames[dayIndex]).join(', ');
			return {label, ariaLabel};
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
		const {label, ariaLabel} = this.getSelectedDayString(this.props.selected);
		const selected = this.adjustSelection(this.props.selected, this.firstDayOfWeek);

		return (
			<ExpandableList
				{...this.props}
				label={label}
				data-aria-label={ariaLabel || null}
				onSelect={this.handleSelect}
				select="multiple"
				selected={selected}
			>
				{this.longDayNames}
			</ExpandableList>
		);
	}
};

export default DayPicker;
export {DayPicker, DayPicker as DayPickerBase};
