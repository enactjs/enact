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
import PropTypes from 'prop-types';

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

	propTypes: {
		children: PropTypes.string,
		css: PropTypes.object
	},

	defaultProps: {
		children: 'check'
	},

	styles: {
		css: componentCss
	},

	render: ({children, css, ...rest}) => {
		return (
			<ToggleIcon
				{...rest}
				css={css}
				iconComponent={Icon}
			>
				{children}
			</ToggleIcon>
		);
	}
});

export default CheckboxBase;
export {
	CheckboxBase as Checkbox,
	CheckboxBase
};
