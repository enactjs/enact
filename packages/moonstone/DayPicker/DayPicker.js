/**
 * Exports the {@link moonstone/DayPicker.DayPicker} component.
 *
 * @module moonstone/DayPicker
 */

import Changeable from '@enact/ui/Changeable';
import React from 'react';
import PropTypes from 'prop-types';
import Pure from '@enact/ui/internal/Pure';
import {Subscription} from '@enact/core/internal/PubSub';

import {Expandable} from '../ExpandableItem';
import {ExpandableListBase} from '../ExpandableList';
import kind from '@enact/core/kind';
import {DaySelectorDecorator} from '../DaySelector';

/**
 * {@link moonstone/DayPicker.DayPicker} is a component that
 * allows the user to choose day(s) of the week.
 *
 * @class DayPickerBase
 * @memberof moonstone/DayPicker
 * @ui
 * @public
 */
const DayPickerBase = kind({
	name: 'DaySelectorBase',

	propTypes: /** @lends moonstone/DayPicker.DayPickerBase.prototype */ {
		/**
		 * The primary text of the Picker.
		 *
		 * @type {String}
		 * @required
		 * @public
		 */
		title: PropTypes.string.isRequired,

		/**
		 * Array of day names
		 *
		 * @type {String[]}
		 * @default false
		 * @private
		 */
		children: PropTypes.arrayOf(PropTypes.string),

		/**
		 * When `true`, applies a disabled style and the control becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * The format for names of days used in the label. "M, T, W" for `short`; "Mo, Tu, We" for `medium`, etc.
		 *
		 * @type {String}
		 * @default 'long'
		 * @public
		 */
		labelDayNameLength: PropTypes.oneOf(['short', 'medium', 'long', 'full']),

		/**
		 * Current locale for DayPicker
		 *
		 * @type {String}
		 * @private
		 */
		locale: PropTypes.string,

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
	},

	defaultProps: {
		disabled: false
	},

	// computed: {
	// 	'aria-label': ({selected, title}) => {
	// 		const type = this.calcSelectedDayType(selected);
	// 		if (type === SELECTED_DAY_TYPES.SELECTED_DAYS) {
	// 			return `${title} ${this.getSelectedDayString(type, this.longDayNames)}`;
	// 		}
	// 	},
	// 	label: ({selected}) => {
	// 		const type = this.calcSelectedDayType(selected);
	// 		return this.getSelectedDayString(type, this.shortDayNames);
	// 	}
	// },

	render: ({...rest}) => {
		return (
			<ExpandableListBase
				{...rest}
				select="multiple"
			/>
		);
	}
});

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

const DayPicker = Subscription(
	{channels: ['i18n'], mapMessageToProps: (channel, {locale}) => ({locale})},
	DaySelectorDecorator(
		DayPickerBase
	)
);

export default DayPicker;
export {DayPicker, DayPickerBase};
