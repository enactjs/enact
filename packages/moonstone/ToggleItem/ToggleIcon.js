import kind from '@enact/core/kind';
import React from 'react';

import Icon from '../Icon';

import css from './ToggleItem.less';

/**
 * Utility component to render the {@link moonstone/Icon.Icon} for
 * {@link moonstone/ToggleItem.ToggleItem}.
 *
 * @class ToggleIcon
 * @memberof moonstone/ToggleItem
 * @ui
 * @private
 */
const ToggleIconBase = kind({
	name: 'ToggleIcon',

	propTypes: /** @lends moonstone/ToggleItem.ToggleIcon.prototype */ {
		/**
		 * Nothing, a string, or an {@link moonstone/Icon.Icon}
		 *
		 * @type {Node}
		 */
		children: React.PropTypes.node,

		/**
		 * When `true`, the icon is displayed
		 *
		 * @type {Boolean}
		 */
		selected: React.PropTypes.bool
	},

	defaultProps: {
		selected: false
	},

	styles: {
		css,
		className: 'icon'
	},

	computed: {
		className: ({selected, styler}) => styler.append({selected})
	},

	render: ({children, ...rest}) => {
		if (children) {
			if (React.isValidElement(children)) {
				return children;
			}
			return (
				<Icon {...rest}>{children}</Icon>
			);
		}

		return null;
	}
});

export default ToggleIconBase;
export {
	ToggleIconBase as ToggleIcon,
	ToggleIconBase
};
