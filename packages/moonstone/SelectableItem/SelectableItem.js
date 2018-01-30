/**
 * Provides Moonstone-themed item component and interactive togglable circle.
 *
 * @module moonstone/SelectableItem
 * @exports SelectableItem
 * @exports SelectableItemBase
 * @exports SelectableItemDecorator
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import Pure from '@enact/ui/internal/Pure';
import Toggleable from '@enact/ui/Toggleable';

import {RemeasurableDecorator} from '@enact/ui/Remeasurable';

import {ToggleItemBase} from '../ToggleItem';
import Skinnable from '../Skinnable';
import SelectableIcon from './SelectableIcon';

/**
 * Renders an item with a circle shaped component. Useful to show a selected state on an item.
 *
 * @class SelectableItemBase
 * @memberof moonstone/SelectableItem
 * @ui
 * @public
 */
const SelectableItemBase = kind({
	name: 'SelectableItem',

	propTypes: /** @lends moonstone/SelectableItem.SelectableItemBase.prototype */ {
		/**
		 * The string to be displayed as the main content of the selectable item.
		 *
		 * @type {String}
		 * @public
		 */
		children: PropTypes.string.isRequired,

		/**
		 * When true, a disabled visual state is applied to the selectable item.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * When `true`, inline styling is applied to the selectable item.
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
		 * @param {String} event.selected - Selected value of item.
		 * @param {*} event.value - Value passed from `value` prop.
		 * @public
		 */
		onToggle: PropTypes.func,

		/**
		 * When `true`, a dot, indicating it is selected, is shown on the selectable item.
		 *
		 * @type {Boolean}
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

	computed: {
		// eslint-disable-next-line enact/display-name
		toggleIcon: ({selected, disabled}) => () => {
			return <SelectableIcon selected={selected} disabled={disabled} />;
		}
	},

	render: (props) => (
		<ToggleItemBase {...props} />
	)
});

/**
 * Represents a Boolean state of an item with a checkbox
 *
 * @class SelectablItem
 * @memberof ui/SelectablItem
 * @mixes ui/Toggleable.Toggleable
 * @ui
 * @public
 */

const SelectableItem = compose(
	Pure,
	Toggleable({prop: 'selected'}),
	RemeasurableDecorator({trigger: 'selected'}),
	Skinnable
)(SelectableItemBase);

export default SelectableItem;
export {SelectableItem, SelectableItemBase};
