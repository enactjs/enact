/**
 * Exports the {@link moonstone/DayPicker.DayPicker} component.
 *
 * @module moonstone/DayPicker
 */

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
		 * When `true`, applies a disabled style and the control becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Array of full day names
		 *
		 * @type {String[]}
		 * @default false
		 * @private
		 */
		fullDayNames: PropTypes.arrayOf(PropTypes.string),

		/**
		 * The selected label for DayPicker
		 *
		 * @type {String}
		 * @public
		 */
		label: PropTypes.string,


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

	computed: {
		'aria-label': ({label, title}) => label ? `${title} ${label}` : null
	},

	render: ({fullDayNames, ...rest}) => {
		return (
			<ExpandableListBase
				{...rest}
				select="multiple"
			>
				{fullDayNames}
			</ExpandableListBase>
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

const DayPicker = Pure(
	Expandable(
		Subscription(
			{channels: ['i18n'], mapMessageToProps: (channel, {locale}) => ({locale})},
			DaySelectorDecorator(
				DayPickerBase
			)
		)
	)
);

export default DayPicker;
export {DayPicker, DayPickerBase};
