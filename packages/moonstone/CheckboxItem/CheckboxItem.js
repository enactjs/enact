/**
 * Exports the {@link moonstone/CheckboxItem.CheckboxItem} component.
 *
 * @module moonstone/CheckboxItem
 */

import React, {PropTypes} from 'react';
import kind from '@enact/core/kind';

import ToggleItem from '../ToggleItem';

/**
 * {@link moonstone/CheckboxItem.CheckboxItem} is a component that
 * is an Item that is Toggleable. It has two states: `true` (selected) & `false`
 * (unselected). It uses a check icon to represent its selected state.
 *
 * By default, `CheckboxItem` maintains the state of its `selected` property. Supply the
 * `defaultSelected` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `selected` at creation time and update it in response to
 * `onToggle` events.
 *
 * @class CheckboxItem
 * @memberof moonstone/CheckboxItem
 * @ui
 * @public
 */
const CheckboxItemBase = kind({
	name: 'CheckboxItem',

	propTypes: /** @lends moonstone/CheckboxItem.CheckboxItem.prototype */ {
		/**
		 * The string to be displayed as the main content of the checkbox item.
		 *
		 * @type {String}
		 * @public
		 */
		children: PropTypes.string.isRequired,

		/**
		 * When `true`, applies a disabled style and the control becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * When `true`, an inline visual effect is applied to the button.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		inline: PropTypes.bool,

		/**
		 * The handler to run when the checkbox item is toggled.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @param {String} event.selected - Selected value of item.
		 * @param {*} event.value - Value passed from `value` prop.
		 * @public
		 */
		onToggle: PropTypes.func,

		/**
		 * When `true`, a check mark icon is applied to the button.
		 *
		 * @type {Boolean}
		 * @public
		 */
		selected: PropTypes.bool,

		/**
		 * The value that will be sent to the `onToggle` handler.
		 *
		 * @type {String|Number}
		 * @default ''
		 * @public
		 */
		value: PropTypes.any
	},

	defaultProps: {
		disabled: false,
		inline: false,
		value: ''
	},

	render: (props) => (
		<ToggleItem {...props} icon="check" />
	)
});

export default CheckboxItemBase;
export {CheckboxItemBase as CheckboxItem, CheckboxItemBase};
