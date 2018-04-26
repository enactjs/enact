/**
 * Provides Moonstone-themed item component and interactive togglable switch.
 *
 * @module moonstone/SwitchItem
 * @exports SwitchItem
 * @exports SwitchItemBase
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

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

	propTypes: /** @lends moonstone/SwitchItem.SwitchItem.prototype */ {
		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `switchItem` - The root class name
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,
		iconComponent: PropTypes.object
	},

	defaultProps: {
		iconComponent: <Switch className={componentCss.switch} />
	},

	styles: {
		css: componentCss,
		className: 'switchItem',
		publicClassNames: ['switchItem']
	},

	render: (props) => (
		<ToggleItem
			data-webos-voice-intent="SelectToggleItem"
			{...props}
			css={props.css}
			iconPosition="after"
		/>
	)
});

export default SwitchItemBase;
export {
	SwitchItemBase as SwitchItem,
	SwitchItemBase
};
