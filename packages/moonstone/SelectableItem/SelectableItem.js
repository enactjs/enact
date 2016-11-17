/**
 * Exports the {@link moonstone/SelectableItem.SelectableItem}
 *
 * @module moonstone/SelectableItem
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

import ToggleItem from '../ToggleItem';

import css from './SelectableItem.less';

/**
 * {@link moonstone/SelectableItem.SelectableItem} is component
 * that is an Item that is Toggleable. It has two selected states `true` &
 * `false`. It uses a dot to represent its selected state.
 *
 * @class SelectableItem
 * @memberof moonstone/SelectableItem
 * @ui
 * @public
 */
const SelectableItemBase = kind({
	name: 'SelectableItem',

	propTypes: /** @lends moonstone/SelectableItem.SelectableItem.prototype */ {
		/**
		 * The string to be displayed as the main content of the selectable item.
		 *
		 * @type {String}
		 * @public
		 */
		children: PropTypes.string.isRequired,

		/**
		 * When true, a disabled visual state is applied to the selectable item.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * When `true`, inline styling is applied to the selectable item.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		inline: PropTypes.bool,

		/**
		 * The handler to run when the selectable item is toggled.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @param {String} event.selected - Selected value of item.
		 * @param {*} event.value - Value passed from `value` prop.
		 * @public
		 */
		onToggle: PropTypes.func,

		/**
		 * When `true`, a dot, indicating it is selected, is shown on the selectable item.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		selected: PropTypes.bool,

		/**
		 * The value that will be sent to the `onToggle` handler.
		 *
		 * @type {*}
		 * @default ''
		 * @public
		 */
		value: PropTypes.any
	},

	defaultProps: {
		selected: false
	},

	styles: {
		css,
		className: 'selectableItem'
	},

	computed: {
		iconClasses: ({selected, styler}) => styler.join(
			css.dot,
			{selected}
		)
	},

	render: (props) => (
		<ToggleItem {...props} beginningIcon="circle" />
	)
});

export default SelectableItemBase;
export {SelectableItemBase as SelectableItem, SelectableItemBase};
