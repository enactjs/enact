/**
 * Provides Moonstone-themed checkmark in a circle component and interactive togglable capabilities.
 *
 * @example
 * <Checkbox />
 *
 * @module moonstone/Checkbox
 * @exports Checkbox
 * @exports CheckboxBase
 */

import kind from '@enact/core/kind';
import React from 'react';

import ToggleIcon from '../ToggleIcon';

import componentCss from './Checkbox.less';

/**
 * Renders a check mark in a shape which supports a Boolean state.
 *
 * @class CheckboxBase
 * @memberof moonstone/Checkbox
 * @extends moonstone/ToggleIcon.ToggleIcon
 * @ui
 * @public
 */
const CheckboxBase = kind({
	name: 'Checkbox',

	propTypes: /** @lends moonstone/Checkbox.CheckboxBase.prototype */ {
		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `checkbox` - The root class name
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object
	},

	styles: {
		css: componentCss,
		className: 'checkbox',
		publicClassNames: ['checkbox']
	},

	render: (props) => {
		return (
			<ToggleIcon
				{...props}
				css={props.css}
				iconComponent={Icon}
			>
				check
			</ToggleIcon>
		);
	}
});

export default CheckboxBase;
export {
	CheckboxBase as Checkbox,
	CheckboxBase
};
