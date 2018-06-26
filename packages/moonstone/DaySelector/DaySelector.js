/**
 * Moonstone styled inline day selector components.
 *
 * @example
 * <DaySelector
 *   defaultSelected={[2, 3]}
 *   onSelect={console.log}
 * />
 *
 * @module moonstone/DaySelector
 * @exports	DaySelector
 * @exports DaySelectorBase
 * @exports DaySelectorDecorator
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
 * A Moonstone styled inline day of the week selection component.
 *
 * This component is most often not used directly but may be composed within another component as it
 * is within {@link moonstone/DaySelector.DaySelector}.
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
		 * Applies a disabled style and prevents interacting with the component.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: PropTypes.bool,

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
 * An inline day of the week selection component, ready to use in Moonstone applications.
 *
 * `DaySelector` may be used to select one or more days of the week from a horizontal list of
 * abbreviated day names.
 *
 * By default, `DaySelector` maintains the state of its `selected` property. Supply the
 * `defaultSelected` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `selected` at creation time and update it in response to
 * `onChange` events.
 *
 * Usage:
 * ```
 * <DaySelector
 *   defaultSelected={[2, 3]}
 *   longDayLabels
 *   onSelect={handleSelect}
 * />
 * ```
 * @class DaySelector
 * @extends moonstone/DaySelector.DaySelectorBase
 * @mixes moonstone/DaySelector.DaySelectorDecorator
 * @memberof moonstone/DaySelector
 * @ui
 * @public
 */
const DaySelector = DaySelectorDecorator(DaySelectorBase);

export default DaySelector;
export {
	DaySelector,
	DaySelectorBase,
	DaySelectorDecorator
};
