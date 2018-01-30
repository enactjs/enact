/**
 * Provides Moonstone-themed item component and interactive togglable checkbox.
 *
 * @module moonstone/CheckboxItem
 * @exports CheckboxItem
 * @exports CheckboxItemBase
 * @exports CheckboxItemDecorator
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import Pure from '@enact/ui/internal/Pure';
import Toggleable from '@enact/ui/Toggleable';

import Skinnable from '../Skinnable';
import {ToggleItemBase} from '../ToggleItem';
import Checkbox from '../Checkbox';

/**
 * Renders an item with a checkbox component. Useful to show a selected state on an item.
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
		// eslint-disable-next-line enact/display-name
		toggleIcon: ({selected, disabled}) => () => (
			<Checkbox selected={selected} disabled={disabled} />
		)
	},

	render: (props) => (
		<ToggleItemBase {...props} />
	)
});

/**
 * Represents a Boolean state of an item with a checkbox
 *
 * @class CheckboxItem
 * @memberof ui/CheckboxItem
 * @mixes ui/Toggleable.Toggleable
 * @ui
 * @public
 */
const CheckboxItem = compose(
	Pure,
	Toggleable({prop: 'selected'}),
	Skinnable
)(CheckboxItemBase);

export default CheckboxItem;
export {CheckboxItem, CheckboxItemBase};
