/**
 * Provides Moonstone-themed form item component and interactive togglable checkbox.
 *
 * @module moonstone/FormCheckboxItem
 * @exports FormCheckboxItem
 * @exports FormCheckboxItemBase
 */

import kind from '@enact/core/kind';
import React from 'react';

import FormCheckbox from '../FormCheckbox';
import ToggleItem from '../ToggleItem';

import componentCss from './FormCheckboxItem.less';

/**
 * Renders a form item with a checkbox component. Useful to show a selected state on an item inside a form.
 *
 * @class FormCheckboxItem
 * @memberof moonstone/FormCheckboxItem
 * @extends moonstone/ToggleItem.ToggleItem
 * @ui
 * @public
 */
const FormCheckboxItemBase = kind({
	name: 'FormCheckboxItem',

	styles: {
		css: componentCss,
		className: 'formCheckboxItem',
		publicClassNames: ['formCheckboxItem']
	},

	render: (props) => (
		<ToggleItem
			{...props}
			css={props.css}
			iconComponent={FormCheckbox}
		/>
	)
});

export default FormCheckboxItemBase;
export {
	FormCheckboxItemBase as FormCheckboxItem,
	FormCheckboxItemBase
};
