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
import Icon from '@enact/ui/Icon';

import componentCss from './Checkbox.less';

/**
 * Renders a check mark in a shape which supports a Boolean state.
 *
 * @class Checkbox
 * @memberof moonstone/Checkbox
 * @extends moonstone/ToggleIcon.ToggleIcon
 * @ui
 * @public
 */
const CheckboxBase = kind({
	name: 'Checkbox',

	styles: {
		css: componentCss
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
