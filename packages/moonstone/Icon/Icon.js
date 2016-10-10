/**
 * Exports the {@link module:@enact/moonstone/Icon~Icon} component.
 *
 * @module @enact/moonstone/Icon
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

import iconList from './IconList.js';

import css from './Icon.less';

/**
 * {@link module:@enact/moonstone/ToggleItem~ToggleItem} is a component to make a Toggleable Item
 * (e.g Checkbox, RadioItem). It has a customizable prop for icon, so any Moonstone Icon can be used
 * to represent the checked state.
 *
 * @class ToggleItem
 * @ui
 * @public
 */
const IconBase = kind({
	name: 'Icon',

	propTypes: {
		/**
		 * The string to be displayed as the main content of the toggle item.
		 *
		 * @type {String}
		 * @public
		 */
		children: PropTypes.string.isRequired,
		/**
		 * If `true`, apply the 'small' class.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		small: PropTypes.bool
	},

	defaultProps: {
		small: false
	},

	styles: {
		css,
		className: 'icon'
	},

	computed: {
		className: ({children: icon, pressed, small, styler}) => styler.append(
			!iconList[icon] && css.dingbat,	// If the icon isn't in our known set, apply our custom font class
			{pressed, small}
		),
		content: ({children: icon}) => {
			let iconEntity = iconList[icon] || icon;

			if (!iconList[icon]) {
				if (typeof iconEntity == 'string') {
					if (iconEntity.indexOf('&#') === 0) {
						// Convert an HTML entity: &#99999;
						iconEntity = parseInt(iconEntity.slice(2, -1), 10);
					} else if (iconEntity.indexOf('\\u') === 0) {
						// Convert a unicode reference: \u99999;
						iconEntity = parseInt(iconEntity.slice(2), 16);
					} else if (iconEntity.indexOf('0x') === 0) {
						// Converts a hex reference in string form
						iconEntity = String.fromCodePoint(iconEntity);
					}
				}
			}
			if (typeof iconEntity == 'number') {
				// Converts a hex reference in number form
				iconEntity = String.fromCodePoint(iconEntity);
			}
			return iconEntity;
		}
	},

	render: ({content, ...rest}) => {
		delete rest.small;

		return (
			<div {...rest}>
				{content}
			</div>
		);
	}
});

export default IconBase;
export {IconBase as Icon, IconBase, iconList as icons};
