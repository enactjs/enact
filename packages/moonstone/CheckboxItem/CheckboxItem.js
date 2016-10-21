/**
 * Exports the {@link module:@enact/moonstone/CheckboxItem~CheckboxItem} component.
 *
 * @module @enact/moonstone/CheckboxItem
 */

import React, {PropTypes} from 'react';
import kind from '@enact/core/kind';

import ToggleItem from '../ToggleItem';

import css from './CheckboxItem.less';

/**
 * {@link module:@enact/moonstone/CheckboxItem~CheckboxItem} is a component that
 * is an Item that is Toggleable. It has two states: `true` (checked) & `false`
 * (unchecked). It uses a check icon to represent its checked state.
 *
 * @class CheckboxItem
 * @ui
 * @public
 */
const CheckboxItemBase = kind({
	name: 'CheckboxItem',

	propTypes: {
		/**
		 * The string to be displayed as the main content of the checkbox item.
		 *
		 * @type {String}
		 * @public
		 */
		children: PropTypes.string.isRequired,

		/**
		 * When `true`, a "checked" visual effect is applied to the button.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		checked: PropTypes.bool,

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
		 * @param {String} event.checked - Checked value of item.
		 * @param {*} event.value - Value passed from `value` prop.
		 * @public
		 */
		onToggle: PropTypes.func,

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
		checked: false,
		disabled: false,
		inline: false,
		value: ''
	},

	styles: {
		css,
		className: 'checkboxItem'
	},

	computed: {
		iconClasses: ({checked}) => !checked ? css.translucent : null
	},

	render: (props) => (
		<ToggleItem {...props} icon="check" />
	)
});

export default CheckboxItemBase;
export {CheckboxItemBase as CheckboxItem, CheckboxItemBase};
