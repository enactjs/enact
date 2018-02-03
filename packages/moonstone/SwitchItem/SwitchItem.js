/**
 * Provides Moonstone-themed item component and interactive togglable switch.
 *
 * @module moonstone/SwitchItem
 * @exports SwitchItem
 * @exports SwitchItemBase
 */

import kind from '@enact/core/kind';
import React from 'react';

import ToggleItem from '../ToggleItem';
import Switch from '../Switch';

import css from './SwitchItem.less';

const CustomizedSwitch = (props) => (
	// The css prop here leverages the fact that the `switch` class name in our less file matches
	// the Switch.less file's class name.
	<Switch {...props} css={css} />
);

/**
 * Renders an item with a switch component. Useful to show an on/off state.
 *
 * @class SwitchItemBase
 * @memberof moonstone/SwitchItem
 * @extends moonstone/ToggleItem
 * @ui
 * @public
 */
const SwitchItemBase = kind({
	name: 'SwitchItem',

	styles: {
		css,
		className: 'switchItem'
	},

	render: (props) => (
		<ToggleItem iconPosition="after" {...props} iconComponent={CustomizedSwitch} />
	)
});

export default SwitchItemBase;
export {
	SwitchItemBase as SwitchItem,
	SwitchItemBase
};
