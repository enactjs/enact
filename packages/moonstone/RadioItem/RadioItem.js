import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

import {ToggleItemBase} from '../ToggleItem';

import css from './RadioItem.less';

const RadioItemBase = kind({
	name: 'RadioItem',

	propTypes: {
		/**
		 * The string to be displayed as the main content of the radio item.
		 *
		 * @type {String}
		 * @public
		 */
		children: PropTypes.string.isRequired,

		/**
		 * Applies a "checked" visual state to the radio item.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		checked: PropTypes.bool,

		/**
		 * Applies a disabled visual state to the radio item.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Applies inline styling to the radio item.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		inline: PropTypes.bool,

		/**
		 * The handler to run when the radio item is toggled.
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
		checked: false,
		disabled: false,
		inline: false,
		onToggle: () => {},
		value: ''
	},

	styles: {
		css,
		className: 'radioItem'
	},

	computed: {
		iconClasses: ({checked, styler}) => styler.join(
			css.dot,
			{checked}
		)
	},

	render: (props) => (
		<ToggleItemBase {...props} icon=" " />
	)
});

export default RadioItemBase;
export {RadioItemBase as RadioItem, RadioItemBase};
