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

import css from './Icon.less';

const mergeStyle = function (style, src) {
	let updated = Object.assign({}, style);
	let source = ri.selectSrc(src);
	if (src && src !== 'none' && src !== 'inherit' && src !== 'initial') {
		source = `url(${source})`;
	}

	updated.backgroundImage = source;
	return updated;
};

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
		 * The icon specified as either:
		 *
		 * * A string that represents an icon from the [IconList]{@link moonstone/Icon.IconList},
		 * * An HTML entity string, Unicode reference or hex value (in the form '0x...'),
		 * * A URL specifying path to an icon image, or
		 * * An object representing a resolution independent resource (See {@link ui/resolution}).
		 *
		 * @type {String|Object}
		 * @public
		 */
		children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

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
		children: ({children}) => {
			let icon = iconList[children];

			if (icon) {
				icon = String.fromCodePoint(icon);
			} else if (typeof children === 'string' && children.length === 1) {
				icon = children;
			}

			return icon;
		},
		style: ({children, style}) => {
			const isPath = !iconList[children] && (
				(typeof children == 'string' && children.length > 1) ||
				typeof children === 'object'
			);

			return isPath ? mergeStyle(style, children) : style;
		}
	},

	render: (props) => {
		delete props.small;

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

export default IconBase;
export {IconBase as Icon, IconBase, iconList as icons};
