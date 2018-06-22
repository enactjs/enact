/**
 * Provides Moonstone-themed pill-shaped toggle switch component.
 *
 * @example
 * <Switch />
 *
 * @module moonstone/Switch
 * @exports Switch
 * @exports SwitchBase
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import ToggleIcon from '../ToggleIcon';

import componentCss from './Switch.less';

/**
 *
 * @class Switch
 * @memberof moonstone/Switch
 * @extends moonstone/ToggleIcon.ToggleIcon
 * @ui
 * @public
 */
const SwitchBase = kind({
	name: 'Switch',

	propTypes: /** @lends moonstone/Switch.Switch.prototype */ {
		children: PropTypes.string,
		css: PropTypes.object,

		/**
		 * Disables animation.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAnimation: PropTypes.bool
	},

	defaultProps: {
		children: 'circle',
		noAnimation: false
	},

	styles: {
		css: componentCss
	},

	computed: {
		className: ({noAnimation, styler}) => styler.append({
			animated: !noAnimation
		})
	},

	render: ({children, css, ...rest}) => {
		delete rest.noAnimation;

		return (
			<ToggleIcon
				{...rest}
				css={css}
			>
				{children}
			</ToggleIcon>
		);
	}
});

export default SwitchBase;
export {
	SwitchBase as Switch,
	SwitchBase
};
