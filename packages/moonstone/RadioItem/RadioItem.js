/**
 * Provides Moonstone-themed Item component and interactive togglable radio icon.
 *
 * @module moonstone/RadioItem
 * @exports RadioItem
 * @exports RadioItemBase
 */

import kind from '@enact/core/kind';
import React from 'react';

import ToggleIcon from '../ToggleIcon';
import ToggleItem from '../ToggleItem';

import componentCss from './RadioItem.less';

const StyledToggleIcon = (props) => <ToggleIcon {...props} css={componentCss} />;

/**
 * Renders an `Item` with a radio-dot component. Useful to show a selected state on an Item.
 *
 * @class RadioItem
 * @memberof moonstone/RadioItem
 * @extends moonstone/ToggleItem.ToggleItem
 * @ui
 * @public
 */
const RadioItemBase = kind({
	name: 'RadioItem',

	styles: {
		css: componentCss,
		className: 'radioItem',
		publicClassNames: ['radioItem']
	},

	render: (props) => (
		<ToggleItem
			{...props}
			css={props.css}
			iconComponent={StyledToggleIcon}
		/>
	)
});

export default RadioItemBase;
export {
	RadioItemBase as RadioItem,
	RadioItemBase
};
