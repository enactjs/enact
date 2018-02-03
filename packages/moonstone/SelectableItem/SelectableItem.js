/**
 * Provides Moonstone-themed item component and interactive togglable circle.
 *
 * @module moonstone/SelectableItem
 * @exports SelectableItem
 * @exports SelectableItemBase
 */

import kind from '@enact/core/kind';
import React from 'react';

import ToggleItem from '../ToggleItem';

import SelectableIcon from './SelectableIcon';

import componentCss from './SelectableIcon.less';

/**
 * Renders an item with a circle shaped component. Useful to show a selected state on an item.
 *
 * @class SelectableItemBase
 * @memberof moonstone/SelectableItem
 * @extends moonstone/ToggleItem.ToggleItem
 * @ui
 * @public
 */
const SelectableItemBase = kind({
	name: 'SelectableItem',

	render: (props) => (
		<ToggleItem {...props} css={componentCss} iconComponent={SelectableIcon} />
	)
});

export default SelectableItemBase;
export {
	SelectableItemBase as SelectableItem,
	SelectableItemBase
};
