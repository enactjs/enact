/**
 * Exports the {@link module:@enact/moonstone/SelectableItem~SelectableItem}
 *
 * @module @enact/moonstone/SelectableItem
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

import {ToggleItemBase} from '../ToggleItem';

import css from './SelectableItem.less';

/**
 * {@link module:@enact/moonstone/SelectableItem~SelectableItem} is component
 * that is an Item that is Toggleable. It has two checked states `true` &
 * `false`. It uses a dot to represent its checked state.
 *
 * @class SelectableItem
 * @ui
 * @public
 */
const SelectableItemBase = kind({
	name: 'SelectableItem',

	propTypes: {
		/**
		 * The string value to be displayed as the main content of the selectable item.
		 *
		 * @type {String}
		 * @public
		 */
		children: PropTypes.string.isRequired,

		/**
		 * Applies a "checked" visual state to the selectable item.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		checked: PropTypes.bool,

		/**
		 * Applies a disabled visual state to the selectable item.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Applies inline styling to the selectable item.
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
		 * @param {String} event.checked - Checked value of item.
		 * @param {*} event.value - Value passed from `value` prop.
		 * @public
		 */
		onToggle: PropTypes.func,

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
		disabled: false,
		checked: false,
		inline: false,
		value: ''
	},

	styles: {css},

	computed: {
		iconClasses: ({checked, styler}) => styler.join(
			css.dot,
			{checked}
		)
	},

	render: (props) => (
		<ToggleItemBase {...props} icon="circle" />
	)
});

export default SelectableItemBase;
export {SelectableItemBase as SelectableItem, SelectableItemBase};
