/**
 * Moonstone styled expandable day picker components.
 *
 * @example
 * <DayPicker
 *   defaultSelected={[2, 3]}
 *   onSelect={console.log}
 *   title="Select a Day"
 * />
 *
 * @module moonstone/DayPicker
 * @exports DayPicker
 * @exports DayPickerBase
 */

import kind from '@enact/core/kind';
import Changeable from '@enact/ui/Changeable';
import Pure from '@enact/ui/internal/Pure';
import compose from 'ramda/src/compose';
import PropTypes from 'prop-types';
import React from 'react';

// We're using the i18n features for DaySelectorDecorator only and not the complete HOC stack so we
// reach into the internal module to pluck it out directly
import DaySelectorDecorator from '../DaySelector/DaySelectorDecorator';
import {Expandable} from '../ExpandableItem';
import {ExpandableListBase} from '../ExpandableList';

/**
 * A day of the week selection component.
 *
 * This component is most often not used directly but may be composed within another component as it
 * is within [DayPicker]{@link moonstone/DayPicker.DayPicker}.
 *
 * @class DayPickerBase
 * @memberof moonstone/DayPicker
 * @extends moonstone/ExpandableList.ExpandableListBase
 * @ui
 * @public
 */
const DayPickerBase = kind({
	name: 'DayPicker',

	propTypes: /** @lends moonstone/DayPicker.DayPicker.prototype */ {
		/**
		 * The primary text label for the component.
		 *
		 * @type {String}
		 * @required
		 * @public
		 */
		title: PropTypes.string.isRequired,

		/**
		 * Called when the user requests the expandable close.
		 *
		 * @type {Function}
		 * @public
		 */
		onClose: PropTypes.func,

		/**
		 * Called when the user requests the expandable open.
		 *
		 * @type {Function}
		 * @public
		 */
		onOpen: PropTypes.func,

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
		 * Opens the component to display the day selection components.
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
		selected: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.arrayOf(PropTypes.number)
		])
	},

	computed: {
		children: ({children}) => children.map(child => child['aria-label'])
	},

	render: (props) => {
		return (
			<ExpandableListBase
				{...props}
				select="multiple"
			/>
		);
	}
});

const DayPickerDecorator = compose(
	Pure,
	Expandable,
	Changeable({change: 'onSelect', prop: 'selected'}),
	DaySelectorDecorator
);

/**
 * An expandable day of the week selection component, ready to use in Moonstone applications.
 *
 * `DayPicker` may be used to select one or more days of the week. Upon selection, it will display
 * the short names of each day selected or customizable strings when selecting [every
 * day]{@link moonstone/DayPicker.DayPicker.everyDayText}), [every
 * weekday]{@link moonstone/DayPicker.DayPicker.everyWeekdayText}, and [every weekend
 * day]{@link moonstone/DayPicker.DayPicker.everyWeekendText}.
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
 * Usage:
 * ```
 * <DayPicker
 *   defaultOpen
 *   defaultSelected={[2, 3]}
 *   onSelect={handleSelect}
 *   title="Select a Day"
 * />
 * ```
 *
 * @class DayPicker
 * @memberof moonstone/DayPicker
 * @extends moonstone/DayPicker.DayPickerBase
 * @mixes moonstone/ExpandableItem.Expandable
 * @mixes ui/Changeable.Changeable
 * @ui
 * @public
 */
const DayPicker = DayPickerDecorator(DayPickerBase);

/**
 * The "aria-label" for the component.
 *
 * By default, "aria-label" is set to the title and the full names of the selected days or
 * the custom text when the weekend, week days, or all days is selected.
 *
 * @name aria-label
 * @type {String}
 * @memberof moonstone/DayPicker.DayPicker.prototype
 * @public
 */

/**
 * The initial value used when `open` is not set.
 *
 * @name defaultOpen
 * @type {Boolean}
 * @memberof moonstone/DayPicker.DayPicker.prototype
 * @public
 */

/**
 * The initial value used when `selected` is not set.
 *
 * @name defaultSelected
 * @type {Number|Number[]}
 * @memberof moonstone/DayPicker.DayPicker.prototype
 * @public
 */

/**
 * Disables DayPicker and the control becomes non-interactive.
 *
 * @name disabled
 * @type {Boolean}
 * @default false
 * @memberof moonstone/DayPicker.DayPicker.prototype
 * @public
 */

/**
 * The text displayed in the label when every day is selected
 *
 * @name everyDayText
 * @type {String}
 * @default 'Every Day'
 * @memberof moonstone/DayPicker.DayPicker.prototype
 * @public
 */

/**
 * The text displayed in the label when every weekeday is selected
 *
 * @name everyWeekdayText
 * @type {String}
 * @default 'Every Weekday'
 * @memberof moonstone/DayPicker.DayPicker.prototype
 * @public
 */

/**
 * The text displayed in the label when every weekend day is selected
 *
 * @name everyWeekendText
 * @type {String}
 * @default 'Every Weekend'
 * @memberof moonstone/DayPicker.DayPicker.prototype
 * @public
 */

export default DayPicker;
export {
	DayPicker,
	DayPickerBase
};
