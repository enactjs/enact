/**
 * Exports the {@link module:@enact/moonstone/ExpandableDayPicker~ExpandableDayPicker} and
 * {@link module:@enact/moonstone/ExpandableDayPicker~ExpandableDayPickerBase} components.
 *
 * @module @enact/moonstone/ExpandableDayPicker
 */

import {$L} from '@enact/i18n';
import DateFmt from '@enact/i18n/ilib/lib/DateFmt';
import ilib from '@enact/i18n/ilib/lib/ilib';
import LocaleInfo from '@enact/i18n/ilib/lib/LocaleInfo';
import React, {PropTypes} from 'react';
import Selectable from '@enact/ui/Selectable';

import {ExpandableCheckboxItemGroupBase} from '../ExpandableCheckboxItemGroup';
import Expandable from '../Expandable';

const everyDayText = $L('Every Day');
const everyWeekdayText = $L('Every Weekday');
const everyWeekendText = $L('Every Weekend');

// default indexes
let firstDayOfWeek = 0;
let weekEndStart = 6;
let weekEndEnd = 0;

// default strings for long and short day strings
const longDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const initILib = () => {
	let i, index;

	const df = new DateFmt({length: 'full'});
	const sdf = new DateFmt({length: 'long'});
	const li = new LocaleInfo(ilib.getLocale());
	const daysOfWeek = df.getDaysOfWeek();
	const days = sdf.getDaysOfWeek();

	firstDayOfWeek = li.getFirstDayOfWeek();
	weekEndStart = li.getWeekEndStart ? li.getWeekEndStart() : weekEndStart;
	weekEndEnd = li.getWeekEndEnd ? li.getWeekEndEnd() : weekEndEnd;

	for (i = 0; i < 7; i++) {
		index = (i + firstDayOfWeek) % 7;
		longDayNames[i] = daysOfWeek[index];
		shortDayNames[i] = days[index];
	}
};

initILib();

/**
 * Determines whether it should return "Every Day", "Every Weekend", "Every Weekday" or list of
 * days for a given selected indexes.
 * @param {Array} selectedArr selected indexes
 * @returns {String} "Every Day", "Every Weekend", "Every Week" or list of days
 * @private
 */
const getSelectedDayString = (selectedArr = []) => {
	let bWeekEndStart = false,
		bWeekEndEnd = false,
		length = selectedArr.length,
		weekendLength = weekEndStart === weekEndEnd ? 1 : 2,
		index;

	if (length === 7) return everyDayText;

	for (let i = 0; i < 7; i++) {
		// convert the control index to day index
		index = (selectedArr[i] + firstDayOfWeek) % 7;
		bWeekEndStart = bWeekEndStart || weekEndStart === index;
		bWeekEndEnd = bWeekEndEnd || weekEndEnd === index;
	}

	if (bWeekEndStart && bWeekEndEnd && length === weekendLength) {
		return everyWeekendText;
	} else if (!bWeekEndStart && !bWeekEndEnd && length === 7 - weekendLength) {
		return everyWeekdayText;
	} else {
		return selectedArr.sort().map((dayIndex) => shortDayNames[dayIndex]).join(', ');
	}
};

const DayPickerTransformer = (Wrapped) => (props) => (
	<Wrapped
		{...props}
		children={longDayNames}
		label={getSelectedDayString(props.selected)}
	/>
);

const MultiTransformer = (Wrapped) => (props) => (
	<Wrapped
		{...props}
		multiple
	/>
);

/**
 * {@link module:@enact/moonstone/ExpandableDayPickerBase~ExpandableDayPicker} is a component that
 * allows the user to choose day(s) of the week. This version allows for dynamically setting the
 * `selected` property.
 *
 * @class ExpandableDayPickerBase
 * @ui
 * @public
 */
const ExpandableDayPickerBase = MultiTransformer(
		Selectable(
			{mutable: true},
			DayPickerTransformer(Expandable(ExpandableCheckboxItemGroupBase))
		)
);

ExpandableDayPickerBase.propTypes = {
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
	 * Selected value(s). An array of numbers representing the days of the week, 0 indexed.
	 * @type {Array}
	 * @public
	 */
	selected: PropTypes.array
};
/**
 * {@link module:@enact/moonstone/ExpandableDayPicker~ExpandableDayPicker} is a component that
 * allows the user to choose day(s) of the week. This version manages the state of selected items
 * and only allows setting the initial selected items through `defaultSelected`.
 *
 * @class ExpandableDayPicker
 * @ui
 * @public
 */
const ExpandableDayPicker = MultiTransformer(
		Selectable(
			{mutable: true},
			DayPickerTransformer(Expandable(ExpandableCheckboxItemGroupBase))
		)
);

ExpandableDayPicker.propTypes = {
	/**
	 * The primary text of the Picker.
	 *
	 * @type {String}
	 * @required
	 * @public
	 */
	title: PropTypes.string.isRequired,

	/**
	 * Initial selected value(s). An array of numbers representing the days of the week, 0 indexed.
	 * @type {Array}
	 * @public
	 */
	defaultSelected: PropTypes.array,

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
	open: PropTypes.bool
};

export default ExpandableDayPicker;
export {ExpandableDayPicker, ExpandableDayPickerBase};
