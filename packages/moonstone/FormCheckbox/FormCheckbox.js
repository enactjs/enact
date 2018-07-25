/**
 * Moonstone styled checkmark icon inside a circle, primarily used inside the
 * [FormCheckboxItem]{@link moonstone/FormCheckboxItem.FormCheckboxItem}. This also has built-in
 * `Spotlight` support since `FormCheckboxItem` is a specialized [Item]{@link moonstone/Item} that
 * does not visually respond to focus; this child component shows focus instead.
 *
 * @example
 * <FormCheckbox />
 *
 * @module moonstone/FormCheckbox
 * @exports FormCheckbox
 * @exports FormCheckboxBase
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import ToggleIcon from '../ToggleIcon';

import componentCss from './FormCheckbox.less';

/**
 * A component that represents a Boolean state, and looks like a check mark in a circle.
 *
 * @class FormCheckbox
 * @memberof moonstone/FormCheckbox
 * @extends moonstone/ToggleIcon.ToggleIcon
 * @ui
 * @public
 */
const FormCheckboxBase = kind({
	name: 'FormCheckbox',

	propTypes: /** @lends moonstone/FormCheckbox.FormCheckbox.prototype */ {
		/**
		 * The icon to be shown when selected.
		 *
		 * May be specified as either:
		 *
		 * * A string that represents an icon from the [iconList]{@link ui/Icon.IconBase.iconList},
		 * * An HTML entity string, Unicode reference or hex value (in the form '0x...'),
		 * * A URL specifying path to an icon image, or
		 * * An object representing a resolution independent resource (See {@link ui/resolution}).
		 *
		 * @type {String}
		 * @public
		 */
		children: PropTypes.string,
		css: PropTypes.object
	},

	defaultProps: {
		children: 'check'
	},

	styles: {
		css: componentCss
	},

	render: ({children, css, ...rest}) => (
		<ToggleIcon {...rest} css={css}>{children}</ToggleIcon>
	)
});

export default FormCheckboxBase;
export {
	FormCheckboxBase as FormCheckbox,
	FormCheckboxBase
};
