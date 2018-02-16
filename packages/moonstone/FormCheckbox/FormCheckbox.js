/**
 * Provides Moonstone-themed checkmark icon inside a circle, primarily used inside the
 * [FormCheckboxItem]{@link moonstone/FormCheckboxItem.FormCheckboxItem}. This also has built-in
 * `Spotlight` support since `FormCheckboxItem` is a specialized [Item]{@link moonstone/Item} that
 * does not visually respond to focus; this child component shows focus instead.
 *
 * @module moonstone/FormCheckbox
 * @exports FormCheckbox
 * @exports FormCheckboxBase
 */

import kind from '@enact/core/kind';
import React from 'react';

import ToggleIcon from '../ToggleIcon';

import componentCss from './FormCheckbox.less';

/**
 * Represents a Boolean state, and looks like a check mark in a circle.
 *
 * @class FormCheckbox
 * @memberof moonstone/FormCheckbox
 * @extends moonstone/ToggleIcon.ToggleIcon
 * @ui
 * @public
 */
const FormCheckboxBase = kind({
	name: 'FormCheckbox',

	styles: {
		css: componentCss
	},

	render: (props) => (
		<ToggleIcon {...props} css={props.css}>check</ToggleIcon>
	)
});

export default FormCheckboxBase;
export {
	FormCheckboxBase as FormCheckbox,
	FormCheckboxBase
};
