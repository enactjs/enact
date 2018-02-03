/**
 * Provides Moonstone-themed item component and interactive togglable checkbox.
 *
 * @module moonstone/CheckboxItem
 * @exports CheckboxItem
 * @exports CheckboxItemBase
 * @exports CheckboxItemDecorator
 */

import kind from '@enact/core/kind';
import React from 'react';

import ToggleItem from '../ToggleItem';
import Checkbox from '../Checkbox';

/**
 * Renders an item with a checkbox component. Useful to show a selected state on an item.
 *
 * @class CheckboxItemBase
 * @memberof moonstone/CheckboxItem
 * @ui
 * @public
 */
const CheckboxItemBase = kind({
	name: 'CheckboxItem',

	render: (props) => (
		<ToggleItem {...props} iconComponent={Checkbox} />
	)
});

export default CheckboxItemBase;
export {
	CheckboxItemBase as CheckboxItem,
	CheckboxItemBase
};
