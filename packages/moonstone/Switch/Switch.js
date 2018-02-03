/**
 * Provides Moonstone-themed pill-shaped toggle switch component with interactive togglable
 * capabilities.
 *
 * @example
 * <Switch />
 *
 * @module moonstone/Switch
 * @exports Switch
 * @exports SwitchBase
 * @exports SwitchDecorator
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@enact/ui/Icon';

import ToggleIcon from '../ToggleIcon';

import componentCss from './Switch.less';

/**
 * Renders the base level DOM structure of the component.
 *
 * @class SwitchBase
 * @memberof moonstone/Switch
 * @extends ui/ToggleIcon.ToggleIcon
 * @ui
 * @public
 */
const SwitchBase = kind({
	name: 'Switch',

	propTypes: /** @lends moonstone/Switch.SwitchBase.prototype */ {
		/**
		 * Sets whether this control is animated during change.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		animated: PropTypes.bool
	},

	defaultProps: {
		animated: true
	},

	styles: {
		css: componentCss,
		className: 'switch',
		publicClassNames: ['switch']
	},

	computed: {
		className: ({animated, styler}) => styler.append(
			{animated}
		)
	},

	render: (props) => {
		delete props.animated;

		return (
			<ToggleIcon
				{...props}
				css={props.css}
				iconComponent={Icon}
			>
				circle
			</ToggleIcon>
		);
	}
});

export default SwitchBase;
export {
	SwitchBase as Switch,
	SwitchBase
};
