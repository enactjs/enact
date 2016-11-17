/**
 * Exports the {@link moonstone/RadioItem.RadioItem} component.
 *
 * @module moonstone/RadioItem
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

import ToggleItem from '../ToggleItem';

import css from './RadioItem.less';

/**
 * {@link moonstone/RadioItem.RadioItem} is a component that
 * combines a Toggleable radio selector and an Item. It has two selected states
 * `true` & `false`.
 *
 * @class RadioItem
 * @memberof moonstone/RadioItem
 * @ui
 * @public
 */
const RadioItemBase = kind({
	name: 'RadioItem',

	propTypes: /** @lends moonstone/RadioItem.RadioItem.prototype */ {
		/**
		 * The string to be displayed as the main content of the radio item.
		 *
		 * @type {String}
		 * @public
		 */
		children: PropTypes.string.isRequired,

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
		 * @param {String} event.selected - Selected value of item.
		 * @param {*} event.value - Value passed from `value` prop.
		 * @public
		 */
		onToggle: PropTypes.func,

		/**
		 * Applies a filled circle icon to the radio item.
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
		disabled: false,
		inline: false,
		selected: false,
		value: ''
	},

	styles: {
		css,
		className: 'radioItem'
	},

	computed: {
		iconClasses: ({selected, styler}) => styler.join(
			css.dot,
			{selected}
		)
	},

	render: (props) => (
		<ToggleItem {...props} icon=" " />
	)
});

export default RadioItemBase;
export {RadioItemBase as RadioItem, RadioItemBase};
