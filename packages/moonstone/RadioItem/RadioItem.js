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

/**
 * Renders an `Item` with a radio-dot component. Useful to show a selected state on an Item.
 *
 * @class RadioItemBase
 * @memberof moonstone/RadioItem
 * @ui
 * @public
 */
const RadioItemBase = kind({
	name: 'RadioItem',

	render: ({...rest}) => (
		<ToggleItem {...rest} css={componentCss} iconComponent={ToggleIcon} />
	)
});

export default RadioItemBase;
export {
	RadioItemBase as RadioItem,
	RadioItemBase
};
