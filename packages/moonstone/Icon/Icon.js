/**
 * Exports the {@link moonstone/Icon.Icon} component and the list of icon constants as
 * [iconList]{@link moonstone/Icon.iconList}.
 *
 * @module moonstone/Icon
 */

import kind from '@enact/core/kind';
import ri from '@enact/ui/resolution';
import React, {PropTypes} from 'react';

import iconList from './IconList.js';
import {TooltipDecorator} from '../Tooltip';

import css from './Icon.less';

/**
 * {@link moonstone/Icon.Icon} is a component that displays an icon image.  You may
 * specify an image, by setting the `src` property, or a font-based icon, by setting the child to a
 * string from the [IconList]{@link moonstone/Icon.IconList}.  If both `src` and
 * children are specified, both will be rendered.
 *
 * Usage:
 * ```
 * <Icon small>
 *     plus
 * </Icon>
 * ```
 *
 * @class Icon
 * @memberof moonstone/Icon
 * @ui
 * @public
 */
const IconBase = kind({
	name: 'Icon',

	propTypes: /** @lends moonstone/Icon.Icon.prototype */ {
		/**
		 * A string that represents an icon from the [IconList]{@link moonstone/Icon.IconList}.
		 * Can also be an HTML entity string, Unicode reference or hex value (in the form '0x...').
		 *
		 * @type {String}
		 * @public
		 */
		children: PropTypes.string,

		/**
		 * If `true`, apply the 'small' class.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		small: PropTypes.bool,

		/**
		 * URL specifying path to an icon image or an object representing a resolution independent resource (See
		 * {@link ui/resolution}).
		 * If both `src` and `children` are specified, they will both be rendered.
		 *
		 * @type {String|Object}
		 * @public
		 */
		src: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
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
		style: ({src, style}) => {
			let updated = Object.assign({}, style);

			let source = ri.selectSrc(src);
			if (src && src !== 'none' && src !== 'inherit' && src !== 'initial') {
				source = `url(${source})`;
			}

			updated.backgroundImage = source;
			return updated;
		},
		children: ({children: icon}) => {
			let iconEntity = iconList[icon] || icon;

			if (!iconList[icon]) {
				if (typeof iconEntity == 'string') {
					if (iconEntity.indexOf('&#') === 0) {
						// Convert an HTML entity: &#99999;
						iconEntity = parseInt(iconEntity.slice(2, -1));
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

	render: (props) => {
		delete props.small;
		delete props.src;

		return <div {...props} />;
	}
});

/**
 * {@link moonstone/Icon.iconList} is an object whose keys can be used as the child of an
 * {@link moonstone/Icon.Icon} component.
 *
 * @name iconList
 * @memberof moonstone/Icon
 * @type Object
 * @ui
 * @public
 */

const Icon = TooltipDecorator(IconBase);

export default Icon;
export {Icon, IconBase, iconList as icons};
