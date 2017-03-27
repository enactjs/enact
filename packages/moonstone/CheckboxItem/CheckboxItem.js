/**
 * Exports the {@link moonstone/CheckboxItem.CheckboxItem} component.
 *
 * @module moonstone/CheckboxItem
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';
import Toggleable from '@enact/ui/Toggleable';

import {ToggleItemBase} from '../ToggleItem';
import Checkbox from '../Checkbox';

/**
 * {@link moonstone/CheckboxItem.CheckboxItemBase} is a component that
 * is an Item that is Toggleable. It has two states: `true` (selected) & `false`
 * (unselected). It uses a check icon to represent its selected state.
 *
 * @class CheckboxItemBase
 * @memberof moonstone/CheckboxItem
 * @ui
 * @public
 */
const CheckboxItemBase = kind({
	name: 'CheckboxItem',

	propTypes: /** @lends moonstone/CheckboxItem.CheckboxItemBase.prototype */ {
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
		 * Specifies on which side (`before` or `after`) of the text the icon appears.
		 *
		 * @type {String}
		 * @default 'before'
		 * @public
		 */
		iconPosition: PropTypes.oneOf(['before', 'after']),

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
		iconPosition: 'before',
		inline: false,
		value: ''
	},

	computed: {
		icon: ({selected, disabled}) => (
			<Checkbox selected={selected} disabled={disabled} />
		)
	},

	render: (props) => (
		<ToggleItemBase {...props} />
	)
});

/**
 * {@link moonstone/CheckboxItem.CheckboxItem} is a component that is an Item that is Toggleable. It
 * has two states: `true` (selected) & `false` (unselected). It uses a check icon to represent its
 * selected state.
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
const CheckboxItem = Toggleable(
	{prop: 'selected'},
	CheckboxItemBase
);

export default CheckboxItem;
export {CheckboxItem, CheckboxItemBase};
