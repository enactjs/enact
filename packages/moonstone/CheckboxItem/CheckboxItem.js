import React, {PropTypes} from 'react';
import kind from '@enact/core/kind';

import ToggleItem from '../ToggleItem';

import css from './CheckboxItem.less';

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
		 * Applies a "checked" visual state to the checkbox item.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		checked: PropTypes.bool,

		/**
		 * Applies a disabled visual state to the checkbox item.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Applies inline styling to the checkbox item.
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
		iconClasses: ({checked, styler}) => styler.join(
			css.icon,
			{checked}
		)
	},

	render: (props) => (
		<ToggleItem {...props} icon="check" />
	)
});

export default CheckboxItemBase;
export {CheckboxItemBase as CheckboxItem, CheckboxItemBase};
