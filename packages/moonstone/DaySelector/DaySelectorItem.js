import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Pure from '@enact/ui/internal/Pure';
import Toggleable from '@enact/ui/Toggleable';

import {ToggleItemBase} from '../ToggleItem';
import DaySelectorCheckbox from './DaySelectorCheckbox';
import Skinnable from '../Skinnable';

import css from './DaySelectorItem.less';

/**
 * An extension of [Item]{@link moonstone/Item.Item} that can be toggled between two states via its
 * `selected` prop.
 *
 * It uses a check icon to represent its selected state. This differs from
 * [FormCheckboxItemBase]{@link moonstone/FormCheckboxItem.FormCheckboxItem}, only visually, in its
 * handling of `Spotlight` focus. When this item receives focus, the entire element appear focused,
 * relying on its child element
 * [DaySelectorCheckbox]{@link moonstone/DaySelector.DaySelectorCheckbox} to reflect that state.
 *
 * @class DaySelectorItemBase
 * @memberof moonstone/DaySelector
 * @ui
 * @private
 */
const DaySelectorItemBase = kind({
	name: 'DaySelectorItem',

	propTypes: /** @lends moonstone/DaySelector.DaySelectorItemBase.prototype */ {
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
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
	},

	defaultProps: {
		iconPosition: 'before',
		value: ''
	},

	styles: {
		css,
		className: 'daySelectorItem'
	},

	computed: {
		className: ({selected, styler}) => styler.append({selected}),
		icon: ({selected, disabled}) => (
			<DaySelectorCheckbox selected={selected} disabled={disabled} />
		)
	},

	render: (props) => (
		<ToggleItemBase {...props} />
	)
});

/**
 * An extension of [Item]{@link moonstone/Item.Item} that can be toggled between two states via its
 * `selected` prop.
 *
 * By default, `DaySelectorItem` maintains the state of its `selected` property. Supply the
 * `defaultSelected` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `selected` at creation time and update it in response to
 * `onToggle` events.
 *
 * @class DaySelectorItem
 * @extends moonstone/DaySelector.DaySelectorItemBase
 * @mixes ui/Toggleable,Toggleable
 * @mixes ui/Skinnable.Skinnable
 * @memberof moonstone/DaySelector
 * @ui
 * @private
 */
const DaySelectorItem = Pure(
	Toggleable(
		{prop: 'selected'},
		Skinnable(
			DaySelectorItemBase
		)
	)
);

export default DaySelectorItem;
export {DaySelectorItem, DaySelectorItemBase};
