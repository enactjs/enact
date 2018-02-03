/**
 * Provides Moonstone-themed form item component and interactive togglable checkbox.
 *
 * @module moonstone/FormCheckboxItem
 * @exports FormCheckboxItem
 * @exports FormCheckboxItemBase
 * @exports FormCheckboxItemDecorator
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import Pure from '@enact/ui/internal/Pure';
import Toggleable from '@enact/ui/Toggleable';

import {ToggleItemBase} from '../ToggleItem';
import FormCheckbox from '../FormCheckbox';
import Skinnable from '../Skinnable';

import css from './FormCheckboxItem.less';

/**
 * Renders a form item with a checkbox component. Useful to show a selected state on an item inside a form.
 *
 * @class CheckboxItemBase
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
		// eslint-disable-next-line enact/display-name
		toggleIcon: ({selected, disabled}) => () => (
			<FormCheckbox selected={selected} disabled={disabled} />
		)
	},

	render: (props) => (
		<ToggleItemBase {...props} />
	)
});

/**
 * Represents a Boolean state of a form item with a checkbox
 *
 * @class FormCheckboxItem
 * @memberof moonstone/FormCheckboxItem
 * @mixes ui/Toggleable.Toggleable
 * @ui
 * @public
 */

const FormCheckboxItem = compose(
	Pure,
	Toggleable({prop: 'selected'}),
	Skinnable
)(FormCheckboxItemBase);

export default FormCheckboxItem;
export {FormCheckboxItem, FormCheckboxItemBase};
