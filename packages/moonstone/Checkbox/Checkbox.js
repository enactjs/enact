/**
 * Provides Moonstone-themed checkmark in a circle component and interactive togglable capabilities.
 *
 * @example
 * <Checkbox />
 *
 * @module moonstone/Checkbox
 * @exports Checkbox
 * @exports CheckboxBase
 * @exports CheckboxDecorator
 */

import kind from '@enact/core/kind';
import React from 'react';
import compose from 'ramda/src/compose';
import Pure from '@enact/ui/internal/Pure';
import ToggleIcon from '@enact/ui/ToggleIcon';

import Icon from '../Icon';
import Skinnable from '../Skinnable';

import componentCss from './Checkbox.less';

/**
 * Renders a check mark in a shape which supports a Boolean state.
 *
 * @class CheckboxBase
 * @memberof moonstone/Checkbox
 * @extends ui/ToggleIcon.ToggleIcon
 * @ui
 * @public
 */
const CheckboxBase = kind({
	name: 'Checkbox',

	styles: {
		css: componentCss,
		className: 'checkbox',
		publicClassNames: 'checkbox'
	},

	render: (props) => {
		return (
			<ToggleIcon {...props} css={componentCss} iconComponent={Icon}>check</ToggleIcon>
		);
	}
});

/**
 * Moonstone-specific behaviors to apply to `CheckboxBase`.
 *
 * @hoc
 * @memberof moonstone/Checkbox
 * @mixes moonstone/Skinnable.Skinnable
 * @public
 */
const CheckboxDecorator = compose(
	Pure,
	Skinnable
);

/**
 * A fully functional, ready-to-use, checkbox component.
 *
 * @class Checkbox
 * @memberof moonstone/Checkbox
 * @extends moonstone/Checkbox.CheckboxBase
 * @mixes moonstone/Checkbox.CheckboxDecorator
 * @ui
 * @public
 */
const Checkbox = CheckboxDecorator(CheckboxBase);

export default Checkbox;
export {
	Checkbox,
	CheckboxBase,
	CheckboxDecorator
};
