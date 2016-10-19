/**
 * Exports the {@link module:@enact/moonstone/ExpandableDayPicker~ExpandableDayPicker} component.
 *
 * @module @enact/moonstone/ExpandableDayPicker
 */

import kind from '@enact/core/kind';
import Selectable from '@enact/ui/Selectable';
import {$L} from '@enact/i18n';
import ilib from '@enact/i18n/ilib/lib/ilib';
import DateFmt from '@enact/i18n/ilib/lib/DateFmt';
import LocaleInfo from '@enact/i18n/ilib/lib/LocaleInfo';
import React from 'react';
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
const longDayString = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const shortDayString = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
		longDayString[i] = daysOfWeek[index];
		shortDayString[i] = days[index];
	}
};

initILib();

/**
 * Determines whether it should return "Everyday", "Every Weekend", "Every Weekday" or list of
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
		return selectedArr.sort().map((dayIndex) => shortDayString[dayIndex]).join(', ');
	}
};

const DayPickerTransformer = (Wrapped) => (props) => (
	<Wrapped
		{...props}
		children={longDayString}
		label={getSelectedDayString(props.selected)}
	/>
);

/**
 * {@link module:@enact/moonstone/ExpandableDayPicker~ExpandableDayPicker} is a component that
 * allows the user to choose day(s) of the week.
 *
 * @class ExpandableDayPicker
 * @ui
 * @public
 */
const ExpandableDayPicker = Selectable(DayPickerTransformer(Expandable(ExpandableCheckboxItemGroupBase)));

export default ExpandableDayPicker;
export {ExpandableDayPicker};
