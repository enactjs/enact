import React, {PropTypes} from 'react';
import kind from '@enact/core/kind';

import {ToggleItemBase} from '../ToggleItem';

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
		 * @default () => {}
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
		disabled: false,
		inline: false,
		onToggle: () => {},
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
		<ToggleItemBase {...props} icon="check" />
	)
});

export default CheckboxItemBase;
export {CheckboxItemBase as CheckboxItem, CheckboxItemBase};
