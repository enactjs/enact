/**
 * Exports [DaySelectorItemBase]{@link moonstone/DaySelectorItem.DaySelectorItemBase} and
 * [DaySelectorItem]{@link moonstone/DaySelectorItem.DaySelectorItem} (default) components.
 *
 * @module moonstone/DaySelectorItem
 */

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
 * [DaySelectorItemBase]{@link moonstone/DaySelectorItem.DaySelectorItemBase} is a stateless
 * component that is an extension of [Item]{@link moonstone/Item} that supports
 * [toggleableability]{@link ui/Toggleable}. It has two states: `true` (selected) & `false`
 * (unselected). It uses a check icon to represent its selected state. This differs from
 * [FormCheckboxItemBase]{@link moonstone/FormCheckboxItem.FormCheckboxItemBase}, only visually, in its handling
 * of `Spotlight` focus. When this item receives focus, the entire element appear focused,
 * relying on its child element [DaySelectorCheckbox]{@link moonstone/DaySelectorCheckbox} to reflect that state.
 *
 * @class DaySelectorItemBase
 * @memberof moonstone/DaySelectorItem
 * @ui
 * @public
 */
const DaySelectorItemBase = kind({
	name: 'DaySelectorItem',

	propTypes: /** @lends moonstone/DaySelectorItem.DaySelectorItemBase.prototype */ {
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
 * [DaySelectorItem]{@link moonstone/DaySelectorItem.DaySelectorItem} is the composed version of
 * [DaySelectorItemBase]{@link moonstone/DaySelectorItem.DaySelectorItemBase} which adds the
 * [Toggleable]{@link ui/Toggleable} High Order Component to support interactivity of the component.
 * [DaySelectorItem]{@link moonstone/DaySelectorItem.DaySelectorItem} has two states: `true`
 * (selected) & `false` (unselected). It uses a check icon to represent its selected state.
 *
 * By default, `DaySelectorItem` maintains the state of its `selected` property. Supply the
 * `defaultSelected` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `selected` at creation time and update it in response to
 * `onToggle` events.
 *
 * @class DaySelectorItem
 * @memberof moonstone/DaySelectorItem
 * @ui
 * @public
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
