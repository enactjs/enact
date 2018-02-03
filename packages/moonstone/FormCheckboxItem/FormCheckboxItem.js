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
// import PropTypes from 'prop-types';

import ToggleItem from '../ToggleItem';
import FormCheckbox from '../FormCheckbox';

import componentCss from './FormCheckboxItem.less';

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

	styles: {
		css: componentCss,
		className: 'toggleItem'
	},

	render: (props) => (
		<ToggleItem {...props} css={componentCss} iconComponent={FormCheckbox} />
	)
});

export default FormCheckboxItemBase;
export {
	FormCheckboxItemBase as FormCheckboxItem,
	FormCheckboxItemBase
};
