/**
 * Exports [FormCheckboxItemBase]{@link moonstone/FormCheckboxItem.FormCheckboxItemBase} and
 * [FormCheckboxItem]{@link moonstone/FormCheckboxItem.FormCheckboxItem} (default) components.
 *
 * @module moonstone/FormCheckboxItem
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Toggleable from '@enact/ui/Toggleable';

import {ToggleItemBase} from '../ToggleItem';
import FormCheckbox from '../FormCheckbox';
import Skinnable from '../Skinnable';

import css from './FormCheckboxItem.less';

/**
 * [FormCheckboxItemBase]{@link moonstone/FormCheckboxItem.FormCheckboxItemBase} is a stateless
 * component that is an extension of [Item]{@link moonstone/Item} that supports
 * [toggleableability]{@link ui/Toggleable}. It has two states: `true` (selected) & `false`
 * (unselected). It uses a check icon to represent its selected state. This differs from
 * [CheckboxItemBase]{@link moonstone/CheckboxItem.CheckboxItemBase}, only visually, in its handling
 * of `Spotlight` focus. This item receives focus, but the entire element does not appear focused,
 * relying on its child element [FormCheckbox]{@link moonstone/FormCheckbox} to reflect that state.
 *
 * @class FormCheckboxItemBase
 * @memberof moonstone/FormCheckboxItem
 * @ui
 * @public
 */
const FormCheckboxItemBase = kind({
	name: 'FormCheckboxItem',

	propTypes: /** @lends moonstone/FormCheckboxItem.FormCheckboxItemBase.prototype */ {
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

	styles: {
		css,
		className: 'formCheckboxItem'
	},

	computed: {
		icon: ({selected, disabled}) => (
			<FormCheckbox selected={selected} disabled={disabled} />
		)
	},

	render: (props) => (
		<ToggleItemBase {...props} />
	)
});

/**
 * [FormCheckboxItem]{@link moonstone/FormCheckboxItem.FormCheckboxItem} is the composed version of
 * [FormCheckboxItemBase]{@link moonstone/FormCheckboxItem.FormCheckboxItemBase} which adds the
 * [Toggleable]{@link ui/Toggleable} High Order Component to support interactivity of the component.
 * [FormCheckboxItem]{@link moonstone/FormCheckboxItem.FormCheckboxItem} has two states: `true`
 * (selected) & `false` (unselected). It uses a check icon to represent its selected state.
 *
 * By default, `FormCheckboxItem` maintains the state of its `selected` property. Supply the
 * `defaultSelected` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `selected` at creation time and update it in response to
 * `onToggle` events.
 *
 * @class FormCheckboxItem
 * @memberof moonstone/FormCheckboxItem
 * @ui
 * @public
 */
const FormCheckboxItem = Toggleable(
	{prop: 'selected'},
	Skinnable(
		FormCheckboxItemBase
	)
);

export default FormCheckboxItem;
export {FormCheckboxItem, FormCheckboxItemBase};
