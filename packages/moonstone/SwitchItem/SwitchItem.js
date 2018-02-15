/**
 * Provides Moonstone-themed item component and interactive togglable switch.
 *
 * @module moonstone/SwitchItem
 * @exports SwitchItem
 * @exports SwitchItemBase
 */

import kind from '@enact/core/kind';
import React from 'react';

import Switch from '../Switch';
import ToggleItem from '../ToggleItem';

import componentCss from './SwitchItem.less';

/**
 * Renders an item with a switch component. Useful to show an on/off state.
 *
 * @class SwitchItem
 * @memberof moonstone/SwitchItem
 * @extends moonstone/ToggleItem.ToggleItem
 * @ui
 * @public
 */
const SwitchItemBase = kind({
	name: 'SwitchItem',

	styles: {
		css: componentCss,
		className: 'switchItem',
		publicClassNames: ['switchItem']
	},

	render: (props) => (
		<ToggleItem
			{...props}
			css={props.css}
			iconComponent={
				<Switch className={componentCss.switch} />
			}
			iconPosition="after"
		/>
	)
});

export default SwitchItemBase;
export {
	SwitchItemBase as SwitchItem,
	SwitchItemBase
};
