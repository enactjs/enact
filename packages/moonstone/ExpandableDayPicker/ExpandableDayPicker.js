/**
 * Exports the {@link module:@enact/moonstone/ExpandableDayPicker~ExpandableDayPicker} components.
 *
 * @module @enact/moonstone/ExpandableDayPicker
 */

import {$L} from '@enact/i18n';
import DateFmt from '@enact/i18n/ilib/lib/DateFmt';
import ilib from '@enact/i18n/ilib/lib/ilib';
import {kind} from '@enact/core/kind';
import LocaleInfo from '@enact/i18n/ilib/lib/LocaleInfo';
import React, {PropTypes} from 'react';

import ExpandableCheckboxItemGroup from '../ExpandableCheckboxItemGroup';

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
 * @param {Object} props props object containing `selected` array
 * @param {Number[]} props.selected Array of day indexes
 * @returns {String} "Every Day", "Every Weekend", "Every Week" or list of days
 * @private
 */
const getSelectedDayString = ({selected = []}) => {
	let bWeekEndStart = false,
		bWeekEndEnd = false,
		length = selected.length,
		weekendLength = weekEndStart === weekEndEnd ? 1 : 2,
		index;

	if (length === 7) return everyDayText;

	for (let i = 0; i < 7; i++) {
		// convert the control index to day index
		index = (selected[i] + firstDayOfWeek) % 7;
		bWeekEndStart = bWeekEndStart || weekEndStart === index;
		bWeekEndEnd = bWeekEndEnd || weekEndEnd === index;
	}

	if (bWeekEndStart && bWeekEndEnd && length === weekendLength) {
		return everyWeekendText;
	} else if (!bWeekEndStart && !bWeekEndEnd && length === 7 - weekendLength) {
		return everyWeekdayText;
	} else {
		return selected.sort().map((dayIndex) => shortDayNames[dayIndex]).join(', ');
	}
};

/**
 * {@link module:@enact/moonstone/ExpandableDayPicker~ExpandableDayPicker} is a component that
 * allows the user to choose day(s) of the week.
 *
 * @class ExpandableDayPicker
 * @ui
 * @public
 */
const ExpandableDayPicker = kind({
	name: 'ExpandableDayPicker',

	propTypes: {
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
	},

	computed: {
		label: getSelectedDayString
	},

	render: (props) => (
		<ExpandableCheckboxItemGroup {...props}>
			{longDayNames}
		</ExpandableCheckboxItemGroup>
	)
});

export default ExpandableDayPicker;
export {ExpandableDayPicker, ExpandableDayPicker as EpandableDayPickerBase};
