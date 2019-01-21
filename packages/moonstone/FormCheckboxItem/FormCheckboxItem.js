/**
 * Provides Moonstone styled form item component and interactive toggleable checkbox.
 *
 * @example
 * <FormCheckboxItem>A Checkbox for a form</FormCheckboxItem>
 *
 * @module moonstone/FormCheckboxItem
 * @exports FormCheckboxItem
 * @exports FormCheckboxItemBase
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import FormCheckbox from '../FormCheckbox';
import ToggleItem from '../ToggleItem';

import componentCss from './FormCheckboxItem.less';

/**
 * Renders a form item with a checkbox component. Useful to show a selected state on an item inside a form.
 *
 * @class FormCheckboxItem
 * @memberof moonstone/FormCheckboxItem
 * @extends moonstone/ToggleItem.ToggleItem
 * @omit iconComponent
 * @ui
 * @public
 */
const FormCheckboxItemBase = kind({
	name: 'FormCheckboxItem',

	propTypes: /** @lends moonstone/FormCheckboxItem.FormCheckboxItem.prototype */ {
		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `formCheckboxItem` - The root class name
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object
	},

	styles: {
		css: componentCss,
		className: 'formCheckboxItem',
		publicClassNames: ['formCheckboxItem']
	},

	render: (props) => (
		<ToggleItem
			data-webos-voice-intent="SelectCheckItem"
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
