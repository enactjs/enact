/**
 * Exports the {@link module:@enact/moonstone/RadioItem~RadioItem}
 *
 * @module @enact/moonstone/RadioItem
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

import {ToggleItemBase} from '../ToggleItem';

import css from './RadioItem.less';

/**
 * {@link module:@enact/moonstone/RadioItem~RadioItem} is a component that
 * combines a Toggleable radio selector and an Item. It has two checked states
 * `true` & `false`.
 *
 * @class RadioItem
 * @ui
 * @public
 */
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
		 * Applies a "checked" visual state to the toggle item.
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
		checked: false,
		disabled: false,
		inline: false,
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
