/**
 * Exports the {@link moonstone/DaySelector.DaySelector} component.
 *
 * @module moonstone/DaySelector
 */

import kind from '@enact/core/kind';
import Changeable from '@enact/ui/Changeable';
import Group from '@enact/ui/Group';
import Pure from '@enact/ui/internal/Pure';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import Skinnable from '../Skinnable';

import Decorator from './DaySelectorDecorator';
import DaySelectorItem from './DaySelectorItem';

import componentCss from './DaySelector.less';

/**
 * A component that allows the user to choose day(s) of the week.
 *
 * @class DaySelectorBase
 * @memberof moonstone/DaySelector
 * @ui
 * @public
 */
const DaySelectorBase = kind({
	name: 'DaySelectorBase',

	propTypes: /** @lends moonstone/DaySelector.DaySelectorBase.prototype */ {
		/**
		 * When `true`, applies a disabled style and the control becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Called when an item is selected. The first parameter will be an object containing a
		 * `selected` member, containing the array of numbers representing the selected days, zero
		 * indexed.
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
		selected: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)])
	},

	defaultProps: {
		disabled: false
	},

	styles: {
		css: componentCss,
		className: 'daySelector'
	},

	render: (props) => {
		return (
			<Group
				{...props}
				childComponent={DaySelectorItem}
				childSelect="onToggle"
				itemProps={{
					className: componentCss.daySelectorItem,
					disabled: props.disabled
				}}
				select="multiple"
				selectedProp="selected"
			/>
		);
	}
});

// documented in ./DaySelectorDecorator.js
const DaySelectorDecorator = compose(
	Pure,
	Changeable({change: 'onSelect', prop: 'selected'}),
	Decorator,
	Skinnable
);

/**
 * A component that allows the user to choose day(s) of the week.
 *
 * @class DaySelector
 * @extends moonstone/DaySelector.DaySelectorBase
 * @mixes moonstone/DaySelector.DaySelectorDecorator
 * @memberof moonstone/DaySelector
 * @ui
 * @public
 */

/**
 * Use long day names (Sunday, Monday..) for labels
 *
 * If `false` short text will be displayed for the the days (Sun, Mon..)
 *
 * @name longDayLabels
 * @memberof moonstone/DaySelector.DaySelector.prototype
 * @type {Boolean}
 * @default false
 * @public
 */

/**
 * The text displayed in the label when every day is selected
 *
 * @name everyDayText
 * @type {String}
 * @default 'Every Day'
 * @memberof moonstone/DaySelector.DaySelector.prototype
 * @public
 */

/**
 * The text displayed in the label when every weekeday is selected
 *
 * @name everyWeekdayText
 * @type {String}
 * @default 'Every Weekday'
 * @memberof moonstone/DaySelector.DaySelector.prototype
 * @public
 */

/**
 * The text displayed in the label when every weekend day is selected
 *
 * @name everyWeekendText
 * @type {String}
 * @default 'Every Weekend'
 * @memberof moonstone/DaySelector.DaySelector.prototype
 * @public
 */

const DaySelector = DaySelectorDecorator(DaySelectorBase);

export default DaySelector;
export {
	DaySelector,
	DaySelectorBase,
	DaySelectorDecorator
};
